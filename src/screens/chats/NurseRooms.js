import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, LogBox, ActivityIndicator, ImageBackground} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import {Avatar} from 'react-native-paper';
import cookie from "cross-cookie";

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../FirebaseConfig';

import Icon from '@expo/vector-icons/AntDesign';

import moment from 'moment';

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); // if already initialized
  } 
  
LogBox.ignoreLogs(['Setting a timer']);
export default function NurseRooms(props){
  
    const db = firebase.firestore()
    
    const [avatarUrls, setAvatarUrls] = useState(null)
    const [rooms, setRooms] = useState(null)
    const [filteredRooms, setFilteredRooms] = useState([])

    // get user_id
    const [user_id, setUser_id] = useState('');
    const getUserId = async () => {
        await cookie.get('user_id')
        .then( res => {
            setUser_id(res)
          })
    }

    // when component mounts, get the userId and the his/her rooms
    useEffect ( () => {
        getUserId()
    }, [])

    useEffect( () => {
        if(!user_id)
            return

        //get the rooms of the user
        var unsubscribeFromRooms = db.collection("rooms")
              .orderBy("updatedAt", "desc")
              .where("user2", "==", user_id)
              .onSnapshot( snapShot => {
                  let room = []
                  snapShot.forEach( function (roomDoc) {    
                      room.push({...roomDoc.data(), roomId: roomDoc.id})
                })
                
                setRooms(room)
                setFilteredRooms(room)
            }) 

        // get users avatar
        var unsubscribeFromAvatars = db.collection("users")
                  .onSnapshot( snap => {
                      let avatarUrl = {}
                      snap.forEach(doc => {
                          avatarUrl[doc.id]= doc.data().avatarUrl
                      })
                      setAvatarUrls(avatarUrl)
                  })
                          
        props.navigation.addListener ('blur', () => {
            // stop listening to changesfrom firestore when leaving the screen
            unsubscribeFromRooms()
            unsubscribeFromAvatars()

        })

    }, [user_id])

    // filtering rooms according to search input
    const handleSearchNames = (input) => {
        // lowercase the input and the name
        if (input){
          input = input.toLowerCase()
          const filteredRooms = rooms.filter( (room) => {
              //return the rooms where the names contain the input text
              return room.user1Name.toLowerCase().includes(input)
          })
          setFilteredRooms(filteredRooms)
        }
        else 
          setFilteredRooms(rooms)
    }

    const renderViews = () => {
      // loading screen while rooms are being fetched
      if (!rooms)
      return <View style={{marginTop:100}}>
                      <ActivityIndicator size="large" color="#00ced1" />
              </View>
              
      // no chats yet
      if (rooms.length===0)
      return(
        <View style={styles.noRoom}>
            <Image source ={require('../../images/noChats.jpeg')}
                style={styles.image}
            />
            <Text style={{fontSize: 30}}>No chats yet!</Text>
        </View>)

      //else
      return(
          <View
          style={styles.container}>
            <ImageBackground source={require('../../images/background2.png')} style={styles.backImage}>
              <ScrollView
                keyboardShouldPersistTaps='handled'
              >
                {/* search input */}
                <View style={styles.search}>
                    <Icon name="search1" size={25} color="#d1d1d1" style={{marginRight:10}}/>
                    <TextInput placeholder="search"
                        onChangeText={(input) => handleSearchNames(input)}
                    />
                </View>

                {/* handle search names */}
                {
                    filteredRooms.length===0 &&
                      <Text style={styles.noResults}>no results!</Text>
                }
                {/* for reach chat room, display avatar, name, last message, and time of the last message */}
                { 
                    filteredRooms.map ((room) => {
                    
                    return(
                        <TouchableOpacity 
                            style={
                                  [styles.room,
                                  room.user2openedAt.toDate() > room.updatedAt.toDate()?
                                  styles.read:
                                  styles.unread]
                                  }
                            
                            key={room.user1}
                            onPress={ () => 
                              {
                                  props.navigation.navigate("Chats", {
                                      receiver_id : room.user1,
                                      receiver_name : room.user1Name,
                                      sender_id: room.user2,
                                      loggedin: "nurse",
                                      roomId: room.roomId
                                  })
                              }
                        }>
                            <View style ={styles.row}>
                                {avatarUrls &&
                                  <Avatar.Image 
                                    source={{
                                    uri: avatarUrls[room.user1],
                                    }}
                                    size={40}
                                  />}

                                <View style={styles.column}>
                                    <View style={styles.row}>
                                        <Text style={styles.name} >{room.user1Name}</Text>
                                        <Text style={styles.time}>  {moment(room.updatedAt.toDate()).fromNow()}</Text>
                                    </View>
                                        <Text numberOfLines={1} style={styles.lastMessage} >{room.lastMessage}</Text>
                                </View>
                            </View>
                            
                        </TouchableOpacity>
                    )
                })}
              </ScrollView>
            </ImageBackground>
          </View>
      )
    }
  return(
      <View style={styles.container}>
          {renderViews()}
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
      backImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
    image:{
        marginTop: 70,
        height: 350,
        width: "100%"
    },
    noRoom:{
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    room:{
        borderBottomWidth: 1,
        borderColor: "#dddddd",
        padding: 20,
        alignItems: "center",
        flexDirection: "row",        
    },
    read:{
        backgroundColor: "white"
    },
    unread:{
        backgroundColor: "#dddddd"
    },
    search:{
        flexDirection:"row",
        alignItems:"center",
        margin:15,
        borderWidth:2,
        padding:10,
        height: 50,
        borderColor:"#00ced1",
        borderRadius:23,
        backgroundColor:"white"
    },

    name:{
        fontWeight: "bold",
        fontSize: 16
    },
    row:{
        flexDirection: "row",
        alignItems: "center"
        
    },
    column:{
        flexDirection: "column",
        marginLeft:10,
    },
    lastMessage:{
        marginRight:50
    },
    time:{
        marginRight: 10,
        color: "gray"
    },
    noResults:{
        color: "gray",
        marginLeft: 20,
        fontSize: 18
    }
  });