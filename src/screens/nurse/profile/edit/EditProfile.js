import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Text, TextInput, Button, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  
} from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

import UploadAvatar from '../../../../uploadingAvatar/UploadAvatar';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../../../FirebaseConfig';

// Initialize Firebase
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}else {
firebase.app(); // if already initialized
}   

const reviewSchema = yup.object({
  contact: yup.string().required("required field").min(8),
  pricePer8Hour: yup.string().required("required field"),
  pricePer12Hour: yup.string().required("required field"),
  pricePer24Hour: yup.string().required("required field"),
})

export default function Edit ({navigation}) {


    // get initial values of longitude and latitude
    // they will be sent to a child component to be updated
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const db = firebase.firestore()

    // fetch nurse info
    const [nurse, setNurse] = useState(null)
    const getNurse = async () => {
        await api.getNurse(token)
        .then(res => {
            setNurse(res.data)
            //get avatar
            getAvatar(res.data.user_id)
        })
        .catch( err => console.log(err))
    }

     // get avatar
     const[avatarUrl, setAvatarUrl] = useState('')
     const getAvatar = (user_id) => {
        db.collection("users")
            .doc(user_id.toString())
            .onSnapshot( (url) => {
                setAvatarUrl(url.data().avatarUrl)
            })
     }

    // render views again when avatar is changed

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }
    // fetch the previous data
    useEffect( () => {
        getToken()
        if (token)
            getNurse()
        navigation.addListener ('focus', () => {
            //fetch the data and save it
            if (token)
                getAvatar()
        })

    }, [token]) //render again when we get the token

    // function to edit nurse Info
    const editNurse = async (data) => {
        await api.editNurse(data, token)
        .catch( err => console.log(err))
    }


    // rendering the profile
    const renderProfile = () => {
        if (!nurse || !avatarUrl){
            return <View style={{marginTop:100}}
                    >
                        <ActivityIndicator size="large" color="#00ced1" />
                    </View>
        }
        else{
            return(
        <View>
                    
            <Formik
                //initialize the values of the requested data as the previous input data
                initialValues={{contact: nurse.contact, 
                                pricePer8Hour: nurse.pricePer8Hour,
                                pricePer12Hour: nurse.pricePer12Hour,
                                pricePer24Hour: nurse.pricePer24Hour,
                                }}
                    
                validationSchema={reviewSchema}

                // will be executed if the the form data is validated, otherwise, the error messages will be shown
                onSubmit={(values) => {
                editNurse({...values, latitude: nurse.latitude, longitude: nurse.longitude, firstName: nurse.firstName, lastName: nurse.lastName})
                navigation.navigate('NurseTabNavigation')
                }}
            >
            
                {props => (
                  
                
                <View>
                    {/* avatar */}
                    <View style={styles.imageCtr}>
                        <Avatar.Image 
                            source={{
                            uri: avatarUrl,
                            }}
                            size={140}
                            style={styles.image}
                        />
                        {/* Change avatar   */}
                        <TouchableOpacity>
                            <View style={styles.edit}>
                                <UploadAvatar user_id={nurse.user_id}/>
                            </View>
                        </TouchableOpacity>
                    </View>        

                    {/* text input for the contact number, it:
                    save its value each time it changes
                    send error message directly after leaving the input text, if any, using onBlur */}
                    <TextInput
                    style={styles.input}
                    placeholder='Contact Number'
                    onChangeText={props.handleChange('contact')}
                    value={props.values.contact}
                    onBlur={props.handleBlur('contact')}
                    keyboardType='numeric'
                    />
                    <Text style={styles.errorText}>{props.touched.contact && props.errors.contact}</Text>
                    
                     {/* text input for the Price per 8 hours, it:
                    save its value each time it changes
                    send error message directly after leaving the input text, if any, using onBlur */}
                    <Text>Price Per 8 Hours:</Text>
                    <TextInput
                    style={styles.input}
                    placeholder='Price per 8 hours'
                    onChangeText={props.handleChange('pricePer8Hour')}
                    value={props.values.pricePer8Hour}
                    onBlur={props.handleBlur('pricePer8Hour')}
                    />
                    <Text style={styles.errorText}>{props.touched.pricePer8Hour && props.errors.pricePer8Hour}</Text>

                    {/* text input for the Price per 12 hours, it:
                    save its value each time it changes
                    send error message directly after leaving the input text, if any, using onBlur */}
                    <Text>Price Per 12 Hours:</Text>
                    <TextInput
                    style={styles.input}
                    onChangeText={props.handleChange('pricePer12Hour')}
                    value={props.values.pricePer12Hour}
                    onBlur={props.handleBlur('pricePer12Hour')}
                    />
                    <Text style={styles.errorText}>{props.touched.pricePer12Hour && props.errors.pricePer12Hour}</Text>

                    {/* text input for the Price per 24 hours, it:
                    save its value each time it changes
                    send error message directly after leaving the input text, if any, using onBlur */}
                    <Text>Price Per 24 Hours:</Text>
                    <TextInput
                    style={styles.input}
                    placeholder='Price per 24 hours'
                    onChangeText={props.handleChange('pricePer24Hour')}
                    value={props.values.pricePer24Hour}
                    onBlur={props.handleBlur('pricePer24Hour')}
                    />
                    <Text style={styles.errorText}>{props.touched.pricePer24Hour && props.errors.pricePer24Hour}</Text>
                  
                    {/* cotsumized button, when pressed => calls handlesubmit, a props element, which checks for data validation
                    and then calss the onsubmit function*/}
                    <TouchableOpacity onPress={props.handleSubmit}>
                        <View style={styles.btn}>
                            <Text style={{color:"white"}}>
                                Save Changes
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                    
                </View>
                
                )}
            </Formik>
      </View>
            )
        }
    }
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                {renderProfile()} 
            </ScrollView> 
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({

    container: {
        height: "100%",
    },
    backImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        backgroundColor: "white",
    },

    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 18,
        borderRadius: 6,
       
    },

    errorText: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 0,
        textAlign: 'center'
    },
    btn: {
        marginHorizontal:40,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        backgroundColor:"#00ced1",
        paddingVertical:10,
        borderRadius:23,
        marginBottom: 50
    },
    row:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingBottom: 20
    },
    text: {
		marginTop: 20,
		fontSize: 17,
		textAlign: "center"
    },
    image:{
        position: "absolute",
    },
    imageCtr:{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
    },
    edit:{
        marginTop:110,
        marginLeft: 110,
        color: "gray"
    }
});