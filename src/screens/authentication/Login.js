import React, { useState } from 'react';
import {StyleSheet, 
        Image, 
        TextInput, 
        Text, 
        View, 
        Alert,
        ActivityIndicator,
        YellowBox ,
        LogBox,
        KeyboardAvoidingView,
        TouchableOpacity} 
        from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from '@expo/vector-icons/AntDesign';
import api from "../../services/api/auth";
import cookie from 'cross-cookie';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../FirebaseConfig';

import 'firebase/auth';

export default function Login({navigation}){
    LogBox.ignoreLogs(['Setting a timer']);
    
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [remember_me, setRemember_me] = useState(false);

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    else {
        firebase.app(); // if already initialized
    }   
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
            addExpoPushTokenToFirstore(null, user_id)
            return;
          }
          // if permission is granted, get expo push token
          token = (await Notifications.getExpoPushTokenAsync()).data;
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

    //add the expoPushNotificationToken to firestore
    const addExpoPushTokenToFirstore = (expoPoshToken, user_id) => {
        db.collection('users')
        .doc(user_id.toString())
        .update({
            pushToken: expoPoshToken
        })
    }
    
    // Api call to login
    const login = () => {
        console.log("remeber: ", remember_me)
        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((value) => {
            return value.user.getIdToken();
        })
        .then( async (Firebasetoken) => {
            console.log('FB', Firebasetoken)
            await api.login({Firebasetoken, remember_me})
            .then(res => {
                console.log("fb ", Firebasetoken)
                //store the token sent by laravel passport
                cookie.set('token', res.data.access_token)
                .then(() => console.log('cookie set!'));

                //store the user id
                cookie.set('user_id', res.data.user_id)
                .then(() => console.log('user_id set!'));

                //store the role
                cookie.set('role', res.data.role)
                .then(() => console.log('role set:', res.data.role));

                registerForPushNotificationsAsync(res.data.user_id)
                .then( () => {
                    // navigation
                    if (res.data.role === "nurse"){
                        res.data.info?  navigation.navigate('NurseTabNavigation'):  navigation.navigate('PersonalInfo')
                    }    
                   
                    else 
                     res.data.info? navigation.navigate("UserTabNavigation"):navigation.navigate("FullName")
                })	
            })
            .catch(err => console.log("laravel " + err))
        })
        .catch(error => {
            //if at least one of the fields are empty
            if (email === '' || password === '')
                Alert.alert("Both fields are required")
            else
                Alert.alert("Invalid credentials")
        })
    }

    return(
        <KeyboardAvoidingView 
        keyboardShouldPersistTaps='handled' 
        behavior="padding"
        style={styles.container}>
            
            <Image source ={require('../../images/nurses.jpg')}
                    style={styles.image}
            />

                {/* email input */}
                <View style={styles.textInput}>
                    <Icon name="mail" color="#00ced1" size={24}/>
                    <TextInput 
                        value={email}
                        onChangeText={setEmail}
                        placeholder="enter your email address"
                        style={{paddingHorizontal:10, width:"100%"}}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>

                {/* password input */}
                <View style={styles.textInput}>
                    <Icon name="lock" color="#00ced1" size={24}/>
                    <TextInput 
                        value={password}
                        onChangeText={setPassword}
                        placeholder="enter your password"
                        style={{paddingHorizontal:10, width:"100%"}}
                        secureTextEntry={true}
                        autoCapitalize='none'
                    />
                </View>

                {/* Remember me checkbox */}
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={remember_me ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setRemember_me(!remember_me);
                        }} 
                    />
                    <Text style={{color:"gray", fontStyle:"italic"}}>Remember me</Text>
                </View>

                {/* customized button, when pressed, will call login function */}
                <TouchableOpacity
                onPress={login}> 
                             
                    <View style={styles.btn}>
                        <Text 
                        style={{color:"white"}}>
                        login
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* create an account */}
                <Text 
                onPress={() => navigation.navigate('Register')}
                style={styles.register}>
                New to Nurxpress? Register Here!
                </Text>

   
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#FFF'
        // marginTop: Platform.OS === 'android' ? 25 : 0
    },
    image: {
        height: "40%",
        width: "100%",
        marginBottom: 50
    },
	textInput: {
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:40,
        borderWidth:2,
        marginTop:15,
        paddingHorizontal:10,
        height: 45,
        borderColor:"#00ced1",
        borderRadius:23,
    },
    btn: {
        marginHorizontal:40,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        backgroundColor:"#00ced1",
        paddingVertical:10,
        borderRadius:23
    },
    register: {
        alignSelf:"center",
        color:"#00ced1",
        paddingVertical:15
    },
    checkboxContainer:{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal:45,
        marginTop:10,
    }
})
