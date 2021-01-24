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

export default function Edit (props) {

    const db = firebase.firestore()

     // get avatar
     const[avatarUrl, setAvatarUrl] = useState('')

    useEffect( () => {
        var unsubscribe = db.collection("users")
                            .doc(props.route.params.user_id.toString())
                            .onSnapshot( (url) => {
                                setAvatarUrl(url.data().avatarUrl)
                            })

        props.navigation.addListener ('blur', () => {
            // stop listening to changes from firestore when leaving the screen
            unsubscribe()
        })

    }, []) 


    // rendering the profile
    const renderProfile = () => {
        if (!avatarUrl){
            return <View style={{marginTop:100}}
                    >
                        <ActivityIndicator size="large" color="#00ced1" />
                    </View>
        }

        return(
            <View>
                {/* avatar */}
                <View style={styles.imageCtr}>
                    <Avatar.Image 
                        source={{
                        uri: avatarUrl,
                        }}
                        size={300}
                        style={styles.image}
                    />
                </View>   
                {/* Change avatar   */}
                
                <View style={styles.edit}>
                    <Text style={styles.text}>Change My Profile Picture</Text>
                    <UploadAvatar user_id={props.route.params.user_id}/>
                </View>
                  
        </View>
        )
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
        alignItems: "center"
    },
    edit: {
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    imageCtr:{
        flexDirection: "column",
        marginTop: 100,
        marginBottom: 30,
    },
    text:{
        marginRight: 5,
        fontSize: 16,
        color: "black"
    }

});