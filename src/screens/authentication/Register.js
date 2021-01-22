import React, { useEffect, useState } from 'react';
import { StyleSheet, 
    LogBox, 
    Image, 
    TextInput, 
    Text, 
    View, 
    ScrollView,
    TouchableOpacity, 
    Platform,
    KeyboardAvoidingView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import {Formik } from 'formik';
import * as yup from 'yup';
import Icon from '@expo/vector-icons/AntDesign';
import api from "../../services/api/auth";
import cookie from 'cross-cookie';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../FirebaseConfig';

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app(); // if already initialized
}  

Notifications.setNotificationHandler({
    handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    }),
});

export default function Register({navigation}){

    LogBox.ignoreLogs(['Setting a timer']);
    const[avatarUrl, setAvatarUrl] = useState('')
    const db = firebase.firestore()

    // request permission for sending notifications
    // if request is accepted, add to firestore

    async function registerForPushNotificationsAsync(user_id) {
        let token;
        // check if it's a physical device
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          // if permission is already denied, get the new status
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          //check final status
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
          // if permission is granted, get expo push token
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            sound: true,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        // function that adds the push token to firebase
        addExpoPushTokenToFirstore(token, user_id)
      }

    //add the expoPushToken and  default avatar to users collection in firestore
    const addExpoPushTokenToFirstore = (expoPoshToken, user_id) => {
        db.collection('users')
        .doc(user_id.toString())
        .update({
            pushToken: expoPoshToken,
        })
    }

    const [remember_me, setRemember_me] = useState(false);
    const [isNurse, setIsNurse] = useState(false);

    // if the user is a nurse, then the register button will have a title: 
    //"register as a nurse" otherwise it will be "Register"
    
    const registerBtn = () => {
        if (isNurse)
            
            return(
                <Text 
                style={{color:"white"}}
                >Register as a nurse
                </Text>
            ) 
        else 
            return(
                <Text 
                style={{color:"white"}}
                >Register
                </Text>
            ) 
    }

    const register =  (attributes) => {
        console.log(attributes["email"], attributes["password"])
        firebase.auth()
        .createUserWithEmailAndPassword(attributes["email"], attributes["password"])
        .then( (value) => {
            return value.user.getIdToken()
            })
            .then( (Firebasetoken) => {
                console.log({...attributes,Firebasetoken})
                api.register({...attributes, Firebasetoken})
                .then( res => {
                //store access token in cookies
                cookie.set('token', res.data.access_token)
                .then(() => console.log('cookie set!'));

                //store user_id in cookies
                cookie.set('user_id', res.data.user_id)
                .then(() => console.log('user_id set!'));

                //store role in cookies
                cookie.set('role', res.data.role)
                .then(() => console.log('role set:', res.data.role));

                //get default avatar and set it for the user
                // then get his expoPushNoification
                firebase
                .storage()
                .ref()
                .child("avatar")
                .child("default-avatar.jpg")
                .getDownloadURL().then(url => {
                     //add null expoPushToken and default avatar to users collection in firestore
                    db.collection('users')
                    .doc(res.data.user_id.toString())
                    .set({
                        pushToken: null,
                        avatarUrl: url
                    })
                    .then( () =>{
                        //get expo notification token
                        registerForPushNotificationsAsync(res.data.user_id)
                    })
                })
               
                //navigation
                if (isNurse)
                navigation.navigate("PersonalInfo")
                else 
                navigation.navigate("FullName")
             
            })
            .catch (err => console.log(err))
        })
        .catch(error => console.log("firebase ",error))
    }

    // get all emails to check if the email already has an account
    const [emails, setEmails] = useState([]);
    const getEmails = async () => {
        await api.emails()
        .then( (res) => setEmails(res.data))
        console.log("emails", emails)
    }
    
    useEffect(  () => {
        getEmails()
    }, [])

    //validations for email and password
    const reviewSchema = yup.object({
        email: yup.string().required('email is required').email('email is invalid').notOneOf(emails, "There's already an account with this email"),
        password: yup.string().required('password is required').min(8),
        c_password: yup.string().required('confirm your password!').oneOf([yup.ref('password')], 'Passwords do not match!')
    })
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={styles.container}
            >
        <ScrollView
        keyboardShouldPersistTaps='handled' 
        >
            
            <Image source ={require('../../images/nurses.jpg')}
                    style={styles.image}
            />

            {/* user formik with yup to validate the form data */}
            <Formik
            //initialize the values of the formik data
            initialValues={{email: '',
                            password: '',
                            c_password: '',
                        }}

            //validate input data
            validationSchema={reviewSchema}

            // will be executed if the the form data is validated, otherwise, the error messages will be shown
            onSubmit={(values) => {

                // add the remember_me and isNurse input to the values object
                values['remember_me']=remember_me;
                values['role']= isNurse==1? "nurse": "regular";
                register(values);
                }
            }>


                { props => (
                    <View>
                        {/* specify if the user is a regular user or a nurse */}
                        <View style={styles.checkboxContainer}>
                            <Text>Are you registering as a nurse?</Text>
                            <Checkbox
                                status={isNurse ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setIsNurse(!isNurse);
                                }} 
                            />
                        </View>

                        {/* email input */}
                        <View style={styles.textInput}>
                            <Icon name="mail" color="#00ced1" size={24}/>
                            <TextInput 
                                onChangeText={props.handleChange('email')}
                                value={props.values.email}
                                onBlur={props.handleBlur('email')}
                                placeholder="enter your email address"
                                style={{paddingHorizontal:10, width:"100%"}}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>
                        <Text style={styles.errorText}>{props.touched.email && props.errors.email}</Text>

                        {/* password input */}
                        <View style={styles.textInput}>
                            <Icon name="lock" color="#00ced1" size={24}/>
                            <TextInput 
                                onChangeText={props.handleChange('password')}
                                value={props.values.password}
                                onBlur={props.handleBlur('password')}
                                placeholder="enter your password"
                                style={{paddingHorizontal:10, width:"100%"}}
                                secureTextEntry={true}
                                autoCapitalize='none'
                            />
                        </View>
                        <Text style={styles.errorText}>{props.touched.password && props.errors.password}</Text>

                        {/* password input confirmation*/}
                        <View style={styles.textInput}>
                            <Icon name="lock" color="#00ced1" size={24}/>
                            <TextInput 
                                onChangeText={props.handleChange('c_password')}
                                value={props.values.c_password}
                                onBlur={props.handleBlur('c_password')}
                                placeholder="confirm your password"
                                style={{paddingHorizontal:10, width:"100%"}}
                                secureTextEntry={true}
                                autoCapitalize='none'
                            />
                        </View>
                        <Text style={styles.errorText}>{props.touched.c_password && props.errors.c_password}</Text>

                        {/* ask if the user wants to be kept signed in */}
                        <View style={styles.checkboxContainer}>
                        <Checkbox
                        status={remember_me ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setRemember_me(!remember_me);
                        }} 
                        />
                        <Text style={{color:"gray", fontStyle:"italic"}}>Keep me signed in</Text>
                        </View>


                        <TouchableOpacity onPress={props.handleSubmit}>
                            <View style={styles.btn}>
                            {registerBtn()}
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#FFF',
    },
    image: {
        height: 250,
        width: "100%",
        marginBottom: 25
    },
	textInput: {
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:40,
        borderWidth:2,
        paddingHorizontal:10,
        height: 45,
        borderColor:"#00ced1",
        borderRadius:23,  
    },
    btn: {
        marginHorizontal:40,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30,
        backgroundColor:"#00ced1",
        paddingVertical:10,
        borderRadius:23
    },
    checkboxContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 7,
        marginTop: 5,
        textAlign: 'center'
    },
})