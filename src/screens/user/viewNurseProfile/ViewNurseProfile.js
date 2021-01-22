import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Linking, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpoIcon from '@expo/vector-icons/AntDesign';

import api from '../../../services/api/nurse';
import authApi from '../../../services/api/user';
import cookie from 'cross-cookie';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../uploadingAvatar/UploadAvatar';

import Rating from '../rating/Rating';
import NurseAvailability from './NurseAvailability';

export default function Profile (props) {

    const [roomId, setRoomId] = useState('');
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }else {
        firebase.app(); // if already initialized
      }

      const db = firebase.firestore()

      // add chat room if it doesn't already exist
      const addChatRoom  = async () =>{

        await db.collection('rooms')
        .where("user1", "==", user.id.toString()).where("user2", "==", nurse.user_id.toString())
        .get()
        .then( querySnapShot => {
            //if room doesnt exist, then add one
            if(querySnapShot.size == 0){
                db.collection("rooms")
                .add({
                    user1: user.id.toString(),
                    user1Name: user.firstName + " " + user.lastName,
                    user2: nurse.user_id.toString(),
                    user2Name: nurse.firstName + " " + nurse.lastName,
                    lastMessage: "no messages yet...",
                    updatedAt: new Date(),
                    user1openedAt: new Date(),
                    user2openedAt: new Date(),
                    opened1: false,
                    opened2: false
                }).then( (value) => {
                    props.navigation.navigate("Chats", {
                        receiver_id : nurse.user_id,
                        receiver_name : nurse.firstName.toUpperCase() +" "+nurse.lastName.toUpperCase(),
                        sender_id: user.id,
                        loggedin: "regular",
                        roomId: value.id
                    })
                })
            }
            else{
                // if room already exists, send its id
                querySnapShot.forEach( room => {

                    props.navigation.navigate("Chats", {
                        receiver_id : nurse.user_id,
                        receiver_name : nurse.firstName.toUpperCase() +" "+nurse.lastName.toUpperCase(),
                        sender_id: user.id,
                        loggedin: "regular",
                        roomId: room.id
                    })
                })
            }
            
        })  

      }

    // get auth user
    const [user, setUser] = useState('');
    const getAuthUser = async () => {
      await authApi.getAuthUser(token)
      .then( res => {
        setUser(res.data)
        console.log(user)
      })
      .catch( err => console.log(err))
    }

    // get avatar
    const[avatarUrl, setAvatarUrl] = useState('')
    const getAvatar = (user_id) => {
        db.collection("users")
            .doc(user_id.toString())
            .get()
            .then( (url) => {
                setAvatarUrl(url.data().avatarUrl)
                console.log("url: ",url.data().avatarUrl)
            })
    }

    //id of nusre
    const [id, setId] = useState("");
    
    // fetch nurse info
    const [nurse, setNurse]=useState(null)
    const getNurse = async () => {
        await api.getThisNurse(id, token)
        .then(res => {
            console.log(res.data)
            //get his avatar
            getAvatar(res.data.user_id)
            setNurse(res.data)})
        .catch( err => console.log(err))
    }
    // fetch nurse education and experience
    const [nurseEducation, setNurseEducation]=useState([])
    const getNurseEducation = async () => {
        await api.getThisNurseEducation(id, token)
        .then(res => setNurseEducation(res.data))
        .catch( err => console.log(err))
    }
    // fetch nurse experience
    const [nurseExperience, setNurseExperience]=useState([])
    const getNurseExperience = async () => {
        await api.getThisNurseExperience(id, token)
        .then(res => setNurseExperience(res.data))
        .catch( err => console.log(err))
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }
    useEffect( () => {
        //get id
        setId(props.route.params.nurse_id)
        console.log(id)
        getToken()
        //fetch the data and save it
        if (token){
            getNurse()
            getNurseEducation()
            getNurseExperience()
            getAuthUser()
        }
    }, [token]) //render again when we get the token

    // rendering the profile
    const renderProfile = () => {
        if (!nurse || !nurseEducation || !nurseExperience || !avatarUrl){
            return <View style={{marginTop:100}}
                    >
                        <ActivityIndicator size="large" color="#00ced1" />
                    </View>
        }
        else{
            return(
        <View>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 15}}>

                    {/* !!!!!!!!!!!!!!!!!!!!!!hard coded */}
                    {/* profile image */}
                    <Avatar.Image 
                        source={{
                        uri: avatarUrl,
                        }}
                        size={140}
                    />

                    {/* Full name and contact number */}
                    <View style={styles.column}>
                        <View style={styles.nameContainer}>
                            <Text 
                            textBreakStrategy={'simple'}
                            style={styles.name}>
                            {nurse.firstName} {nurse.lastName}
                            </Text>
                        </View>
                        
                        <View style={styles.userInfoSection}>

                            {/* allow calling from react native */}
                            <TouchableOpacity onPress={()=>{Linking.openURL(`tel:${nurse.contact}`);}}>
                                <View style={styles.row}>
                                    <Icon name="phone" color="green" size={20}/>
                                    <Text style={{color:"#777777", marginLeft: 10, fontSize:17}}>{nurse.contact}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("NurseAvailability", {token: token, nurse_id: nurse.id})
                            }}>
                                <View style={styles.row}>
                                    <Icon name="calendar" color="#dc143c" size={20}/>
                                    <Text style={{color:"#777777", marginLeft: 10, fontSize:17}}>Availability</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* rating feature, pass the user id as prop to rating component */}
            <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                    <Rating nurse_id={nurse.id}/>
                </View> 

                {/* Navigate to the chat room with the nurse */}
                <TouchableOpacity onPress={ () => addChatRoom()}>
                    <ExpoIcon name="message1" size={30} color="#00ced1" style={styles.chat}/>
                </TouchableOpacity>
            </View>

            {/* prices per 8, 12 and 24 hours */}
            <View style={styles.infoBoxWrapper}>
                <View style={[styles.infoBox, {
                borderRightColor: '#dddddd',
                borderRightWidth: 1
                }]}>
                    <Title>{nurse.pricePer8Hour}</Title>
                    <Caption>8 hours</Caption>
                </View>
                <View style={[styles.infoBox, {
                borderRightColor: '#dddddd',
                borderRightWidth: 1
                }]}>
                    <Title>{nurse.pricePer12Hour}</Title>
                    <Caption>12 hours</Caption>
                </View>
                <View style={styles.infoBox}>
                    <Title>{nurse.pricePer24Hour}</Title>
                    <Caption>24 hours</Caption>
                </View>
            </View>

            

            <View style={styles.menuWrapper}>
                {/* Experience */}
                <View>
                    <Text style={styles.title}>Experience</Text>
                    {   nurseExperience.length === 0?

                        <View><Text style={{marginLeft:10, marginBottom:10}}>No experience yet...</Text></View>:
                        
                        nurseExperience.map( experience => (
                        <View key={experience.id}>
                            <View style={styles.menuItem}>
                                <Icon name="briefcase" color="#00ced1" size={25}/>
                                <Text style={styles.menuItemText}>
                                {experience.employmentType} {experience.position} at {experience.company}
                                    {experience.endYear!==null ? 
                                    <Text style={styles.date}> ({experience.startYear}-{experience.endYear})</Text>
                                    :<Text style={styles.date}> ({experience.startYear})</Text>}
                                </Text>
                            </View>
                        </View>
                    ))
                    }
                </View>
            
                {/* Education */}
                <View style={{borderTopWidth:1, borderTopColor:"#dddddd"}}>
                    <Text style={[styles.title, {marginTop: 10}]}>Education</Text>
                    { nurseEducation.length === 0?

                        <View><Text style={{marginLeft:10, marginBottom:10}}>No education yet...</Text></View>:
                        nurseEducation.map( education => (
                        <View key={education.id}>
                            <View style={styles.menuItem}>
                                <Icon name="school" color="#00ced1" size={25}/>
                                <Text style={styles.menuItemText}>
                                    {education.degree} at {education.school}
                                    <Text style={styles.date}> ({education.graduationYear})</Text>
                                </Text>
                            </View>
                        </View>
                    ))
                    }
                    </View>
                </View>

        </View>
            )
        }
    }
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../images/background2.png')} style={styles.backImage}>
            <ScrollView>
            {renderProfile()} 
            </ScrollView> 
    </ImageBackground>
    </View>
  );
};

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
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:15,
    marginBottom: 15,
  },
  nameContainer:{
    marginTop: 10,
    marginLeft: 20,
    flexDirection:'row'
  },
  title:{
    marginLeft:10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  date:{
    color:"gray",
    fontSize: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: 'black',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  ratingContainer:{
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rating:{
      margin: 10,
      flexDirection:"row",
      alignItems: "center"
  },
  chat:{
      marginRight: 20,
  }, 
  column:{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
  }
});