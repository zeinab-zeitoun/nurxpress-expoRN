import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TextInput, Platform, TouchableWithoutFeedback, StatusBar} from 'react-native'
import { GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat'
import {ActivityIndicator, Avatar} from 'react-native-paper';

import Icon from '@expo/vector-icons/AntDesign';
import Constants from "expo-constants";

import api from '../../services/api/nurse';
import cookie from 'cross-cookie';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../FirebaseConfig';


  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); // if already initialized
  }  

export default function Example(props) {

  const [messages, setMessages] = useState([]);
  const [params, setParams] = useState(props.route.params);
   
  const db = firebase.firestore()

  // check if the other user read message
  // if not, send notification
  const checkIfMessageIsRead = () => {
    
    db.collection("rooms")
    .doc(params.roomId)
    .get()
    .then( snapshot => {
      // if the nurse didn't read the message
      if (params.loggedin == "nurse" && !snapshot.data().opened1 ){
        // get his expo notification token
        db.collection('users')
        .doc(params.receiver_id.toString())
        .get()
        .then(expoPushToken => {
          // send the notification
          sendPushNotification(snapshot.data().user2Name, snapshot.data().lastMessage, expoPushToken.data().pushToken)
        })
        
      }
      // if the regular didn't read the message
      if (params.loggedin == "regular" && !snapshot.data().opened2 ){
        // get his expo notification token
        db.collection('users')
        .doc(params.receiver_id.toString())
        .get()
        .then(expoPushToken => {
          // send the notification
          sendPushNotification(snapshot.data().user1Name, snapshot.data().lastMessage, expoPushToken.data().pushToken)
        })
        
      }
    })
  }


  // Add messages to firestore
  const addMessageToFirestore = async (message) => {
    // fisrt update the last message sent with its time
    // then add the message to messages collection
    await db.collection('rooms')
    .doc(params.roomId)
    .update({
      lastMessage: message[0].text,
      updatedAt: new Date()
    }).then( async () => await db.collection('rooms')
        .doc(params.roomId)
        .collection('messages')
        .add({
          text: message[0].text,
          sentBy: params.sender_id,
          createdAt: message[0].createdAt
      })).then( () => {
        // check if the message id read after adding it
       checkIfMessageIsRead()
      })
  }

  // get all messages => real time
  // limit them to the last 100 messages
  const getMessages = async () => {

    db.collection("rooms")
    .doc(params.roomId)
    .collection('messages')
    .orderBy("createdAt", "desc")
    .limit(100)
    .onSnapshot(function(querySnapshot) {
        var msgs = [];
        querySnapshot.forEach(function(doc) {
          // msg object in the format that gifted chat accepts
          msgs.push({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user:  {
              _id: parseInt(doc.data().sentBy),
            },
          })
          
        });
        setMessages(msgs);
    });
    
  }

  // close chat room
  //for nurse
  const setClosed2 = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
        opened2: false
    })
  }
  //for user
  const setClosed1 = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
        opened1: false
    })
  }

  // open chat room
  //for nuser
  const setOpened1 = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
        opened1: true
    })
  }
  //for nurse
  const setOpened2 = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
        opened2: true
    })
  }
 
  // set the time where the user last opened the chat
  //for user
  const setUser1openedAt = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
      user1openedAt: new Date()
    })
  }
  //for nurse
  const setUser2openedAt = () => {
    db.collection('rooms')
    .doc(params.roomId.toString())
    .update({
      user2openedAt: new Date()
    })
  }

  useEffect( () => {
    // when the component mounts => user opened the chat room
    if (params.loggedin === "regular")
      setOpened1()
    else setOpened2()
    
    // get all the previous messages
    getMessages()

    // when the component unmounts => user closed the chat room
    return( () => {
      // when leaving the chat room
      //set opened to false and 
      //update the last time the user opened the room
      if (params.loggedin === "regular")
        {
          setClosed1()
          setUser1openedAt()
        }
      else {
        setClosed2()
        setUser2openedAt()
      }
    })
  }, [])

  // get the nurse id if the user is a regular user
  // nurse id is needed so that the user can navigate to nurse profile
  // when pressing on the nurse name
  const [nurse_id, setNurse_id] = useState('')
  const getNurseGivenUserId = async (token) => {
    await api.getNurseGivenUserId(params.receiver_id, token)
    .then((res) => setNurse_id(res.data.id))
  }
  useEffect ( () => {
    async function getToken(){
      await cookie.get("token")
      .then((value) => getNurseGivenUserId(value))
    }
    getToken()
  }, [])


  // get avatar
  const[avatarUrl, setAvatarUrl] = useState('')
  const getAvatar = (user_id) => {
     db.collection("users")
         .doc(user_id.toString())
         .get()
         .then( (url) => {
             setAvatarUrl(url.data().avatarUrl)
         })
  }
  useEffect( () => {
    getAvatar(params.receiver_id)
  }, [])


    //customize the input text of the chat component
    const customtInputToolbar = props => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                backgroundColor: "white",
                borderTopColor: "#E8E8E8",
                padding: 7,
                justifyContent: "center",
                }}
            />
        );
      };

    //customize the messages of the chat component
    const renderBubble = (props) => {
    return (
        <Bubble
        {...props}
        wrapperStyle={{
            right: {
            backgroundColor: "#00ced1",
            }
        }}
        />
    )
    }


  const renderViews = () => {
    // loading screen while avatar is being fetched
    if(!avatarUrl)
      return <View style={{marginTop:200}}
              >
              <ActivityIndicator size="large" color="#00ced1" />
            </View>

    return (
      <View 
        style={styles.container} 
      >
          <View style={styles.receiverCtr}>
            {/* back bottun */}
            <Icon name="arrowleft" size={30} 
                  color="black" 
                  style={{marginRight: 15}}
                  onPress = { () => props.navigation.goBack()}
                />
            {/* avatar */}
            <Avatar.Image 
              source={{
              uri: avatarUrl,
              }}
              size={40}
            />
            {/* name of the receiver
            if the receiver is a nurse, allow the user 
            to navigate to his profile when pressed*/}
            <TouchableWithoutFeedback onPress={() => {
              if (params.loggedin == "regular")
              props.navigation.navigate("ViewNurseProfile", {nurse_id: nurse_id})
            }}>
              <Text style={styles.receiver}>{params.receiver_name}</Text>
            </TouchableWithoutFeedback>
          </View>
          
          {/* react chat component */}
          <GiftedChat
            messages={messages}
            renderAvatarOnTop
            renderBubble={renderBubble}
            alignTop
            renderAvatar={ () => null}
            showAvatarForEveryMessage={true}
            renderInputToolbar={props => customtInputToolbar(props)}
            onSend={messages => addMessageToFirestore(messages)}
            user={{
                _id: parseInt(params.sender_id),
            }}
          />
      </View>
    )

  }
  return (
    <>
    {renderViews()}
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        height : "100%",
        backgroundColor: "white",
        paddingTop: Constants.statusBarHeight,
    },
    receiverCtr:{
      backgroundColor: "white",
      height: 70,
      flexDirection: "row",
      alignItems: "center",
      padding:10
    },
    receiver:{
      marginLeft: 10,
      color: "black",
      fontSize: 20,
      fontWeight: "bold",
    }
})

// send notification to the other user
async function sendPushNotification(name, text, expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    body: name + ": " + text,
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}