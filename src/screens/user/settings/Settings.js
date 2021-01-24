import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Avatar,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpoIcon from '@expo/vector-icons/AntDesign';

import apiUser from '../../../services/api/regular';
import apiAuth from '../../../services/api/auth';

import cookie from 'cross-cookie';
import UploadAvatar from '../../../uploadingAvatar/UploadAvatar'

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../../FirebaseConfig';

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }else {
        firebase.app(); // if already initialized
    }   
    const db = firebase.firestore()

export default function Settings ({navigation}) {

    //fetch user info
    const [user, setUser]=useState(null)
    const getUser = async () => {
        await apiUser.getUser(token)
        .then(res => {
            //get avatar of the user
            getAvatar(res.data.user_id)
            setUser(res.data)})
        .catch( err => console.log("get user", err))
    }

    // get avatar
    const[avatarUrl, setAvatarUrl] = useState('')
    const getAvatar = (user_id) => {
            db.collection("users")
            .doc(user_id.toString())
            .get()
            .then( (fields) => {
                setAvatarUrl(fields.data().avatarUrl)
            })
    }

    //get the token
    const [token, setToken] = useState(null);
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }
    useEffect( () => {
        getToken()
        //fetch the data and save it
        if (token)
            getUser()

    }, [token]) //render again when we get the token


    //logout
    const logout = async() => {
        // set expo push noification to null
        //unsubscribe()
    
        await db.collection('users')
            .doc(user.user_id.toString())
            .update({
                pushToken : null
        }).then( async () => {
            //logout from firebase
            await firebase.auth().signOut()
        }).then(async () => {
            // logout from laravel
            await apiAuth.logout(token)
        }).then( async() => {
            // clear all cookies
            await cookie.clearAll()
        }).then( () => {
            navigation.navigate("Login")
        })
    }
    
    // rendering the settings
    const renderSettings = () => {
    if (!user || ! avatarUrl){
        return <View style={{marginTop:100}}
                >
                    <ActivityIndicator size="large" color="#00ced1" />
                </View>
        }
        else{
            return(
        <View>
            <View style={styles.userInfoSection}>
                
                    {/* !!!!!!!!!!!!!!!!!!!!!!hard coded */}
                    {/* profile image */}
                    <Avatar.Image 
                        source={{
                        uri: avatarUrl,
                        }}
                        size={100}
                    />                  
                      
                    {/* Full name*/}
                   
                    <View style={{alignItems:"center", margin:20}}>
                        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>                    
                    </View>
            </View>

            <View style={styles.menuWrapper}>
                <View>

                    <TouchableOpacity 
                        style={[styles.menuItem, {borderTopWidth: 2, borderColor: "#dddddd"}]}
                        onPress = { () => navigation.navigate("EditUserAvatar", {user_id: user.user_id})}
                    >
                        <ExpoIcon name="edit" size={30} color="#00ced1"/>
                        <Text style={styles.menuItemText}>
                            Change my Profile Picture
                        </Text>
                    </TouchableOpacity>
                  
                    <TouchableOpacity onPress={() => navigation.navigate("EditUserLocation")}>
                        <View style={styles.menuItem}>
                            <Icon name="map-marker-radius" color="#00ced1" size={25}/>
                            <Text style={styles.menuItemText}>
                                Change my Location
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={ () => logout()}>
                    <View style={[styles.menuItem, {borderTopWidth: 2, borderBottomWidth: 2, borderColor: "#dddddd"}]}>
                        <Icon name="logout" color="#00ced1" size={25}/>
                        <Text style={styles.menuItemText}>
                            Logout
                        </Text>
                    </View>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
            )
        }
    }
  return (
    <View
    style={styles.container}>
        <ImageBackground source={require('../../../images/background2.png')} style={styles.backImage}>
            <ScrollView
                keyboardShouldPersistTaps='handled'
            >
                {renderSettings()}  
            </ScrollView>
        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  backImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    },
  userInfoSection: {
    paddingHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: "white",
  },
  menuItemText: {
    color: 'black',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});