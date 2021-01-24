import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpoIcon from '@expo/vector-icons/AntDesign';

import apiNurse from '../../../services/api/nurse';
import apiAuth from '../../../services/api/auth';
import apiCommunity from '../../../services/api/community';

import cookie from 'cross-cookie';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../../FirebaseConfig';


export default function Settings ({navigation}) {

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }else {
        firebase.app(); // if already initialized
    }   
    const db = firebase.firestore()
    
    // fetch nurse info
    const [nurse, setNurse]=useState(null)
    const getNurse = async () => {
        await apiNurse.getNurse(token)
        .then(res => {
            //get avatar
            getAvatar(res.data.user_id)
            setNurse(res.data)})
        .catch( err => console.log("getnurse: ",err))
    }

    // get avatar
    const[avatarUrl, setAvatarUrl] = useState('')
    const getAvatar = async (user_id) => {
        if(firebase.auth().currentUser)
            await db.collection("users")
                .doc(user_id.toString())
                .get()
                .then( (fields) => {
                    setAvatarUrl(fields.data().avatarUrl)
                })
    }

    //get unread notifications
    const [unread, setUnread] = useState(0);
    const unreadComments = async () => {
        await apiCommunity.unreadComments(token)
        .then(res => {
            setUnread(res.data)})
        .catch( err => console.log("community ", err))
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }
    useEffect( () => {
        
        getToken()
        //fetch the data and save it
        if (token){
            getNurse()
            unreadComments()
        }
        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        navigation.addListener ('focus', () => {
            //fetch the data and save it
            if (token)
                unreadComments()
        })
    }, [token]) //render again when we get the token

 
    //logout
    const logout = async() => {
        // set the push notification to null
        await db.collection('users')
            .doc(nurse.user_id.toString())
            .update({
                pushToken : null
            })
        .then( async () => {
            // logout from firebase
            await firebase.auth().signOut()
        }).then(async () => {
            // logout from laravel
            await apiAuth.logout(token)
        }).then( async() => {
            //clear all cookies
            await cookie.clearAll()
        }).then( () => {
            navigation.navigate("Login")
        })
    }

    // rendering the profile
    const renderSettings = () => {
        if (!nurse || !avatarUrl){
            return <View style={{marginTop:100}}
                    >
                        <ActivityIndicator size="large" color="#00ced1" />
                    </View>
        }
        else{
            return(
        <View>
            <View style={styles.userInfoSection}>
                
                    {
                        avatarUrl && 
                        <Avatar.Image 
                            source={{
                            uri: avatarUrl,
                            }}
                            size={100}
                        />
                    }

                    {/* Full name*/}
                   
                    <View style={{marginLeft: 20}}>
                        <Title style={[styles.name, {
                        marginTop:25,
                        marginBottom: 15,
                        }]}>{nurse.firstName} {nurse.lastName}</Title>
                    </View>
            </View>

    
            <View style={styles.menuWrapper}>
                <View>
                    <TouchableOpacity onPress={ () => navigation.navigate("CommunityNotifications")}
                                        style={styles.notifications} >
                        {/* section for community notifications */}
                        <View style={styles.menuItem}>
                            <ExpoIcon name="notification" color="#00ced1" size={25}/>
                            <Text style={styles.menuItemText}>
                                Community Notifications
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.unread}>{unread}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* section for Availability*/}
                    <TouchableOpacity onPress={ () => navigation.navigate("Availability", {token:token})}>
                    <View style={styles.menuItem}>
                        <Icon name="calendar" color="#00ced1" size={25}/>
                        <Text style={styles.menuItemText}>
                            My Availability
                        </Text>
                    </View>
                    </TouchableOpacity>

                    {/* section to change location*/}
                    <TouchableOpacity onPress={ () => navigation.navigate("EditLocation")}>
                    <View style={styles.menuItem}>
                        <Icon name="map-marker-radius" color="#00ced1" size={25}/>
                        <Text style={styles.menuItemText}>
                            Change my Location
                        </Text>
                    </View>
                    </TouchableOpacity>

                    {/* section to logout*/}
                    <TouchableOpacity onPress={ () => logout()}>
                    <View style={[styles.menuItem, {borderTopWidth: 2,borderBottomWidth: 2, borderColor: "#dddddd"}]}>
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
    backgroundColor: "white"
  },
  menuItemText: {
    color: 'black',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  notifications:{
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    borderTopWidth: 2, 
    borderTopColor: "#dddddd",
    backgroundColor: "white",
  },
  unread: {
      marginRight: 40,
      fontSize: 18,
      color: "#b22222",
      fontWeight: "bold"
  }
});