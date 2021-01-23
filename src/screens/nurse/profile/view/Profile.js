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

import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

import Rating from './Rating';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../../../FirebaseConfig';


// Initialize Firebase
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}else {
firebase.app(); // if already initialized
}

export default function Profile ({navigation}) {

    const db = firebase.firestore()
    // fetch nurse info
    const [nurse, setNurse]=useState(null)
    const getNurse = async () => {
        await api.getNurse(token)
        .then(res => {
            //get avatar
            getAvatar(res.data.user_id)
            setNurse(res.data)})
        .catch( err => console.log("get nurse", err))
    }
    // fetch nurse education and experience
    const [nurseEducation, setNurseEducation]=useState([])
    const getNurseEducation = async () => {
        await api.getNurseEducation(token)
        .then(res => setNurseEducation(res.data))
        .catch( err => console.log(err))
    }
    // fetch nurse experience
    const [nurseExperience, setNurseExperience]=useState([])
    const getNurseExperience = async () => {
        await api.getNurseExperience(token)
        .then(res => setNurseExperience(res.data))
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
            })
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
            getNurseEducation()
            getNurseExperience()
        }
        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        navigation.addListener ('focus', () => {
        console.log("hi")
        firebase.auth().currentUser.getIdToken().then(token => console.log('got token', token))
            //fetch the data and save it
            if (token){
                getNurse()
                getNurseEducation()
                getNurseExperience()
            }
        })
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

                    {/* Full name, location, and contact number */}
                    <View style={styles.column}>
                        <View >
                            <Text 
                                style={[styles.name, {
                                marginTop:25,
                                marginBottom: 15,
                                }]}
                                textBreakStrategy={'simple'}
                            >
                                {nurse.firstName} {nurse.lastName}
                            </Text>
                        </View>
                        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!! hard coded*/}
                        

                            {/* allow calling from react native */}
                            <TouchableOpacity onPress={()=>{Linking.openURL(`tel:${nurse.contact}`);}}>
                                <View style={styles.row}>
                                    <Icon name="phone" color="green" size={20}/>
                                    <Text style={{color:"#777777", marginLeft: 10, fontSize:17}}>{nurse.contact}</Text>
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Rating/>
                            </View>

                       
                    </View>
                </View>
            </View>

            {/* edit profile button */}
            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}
                style={{flexDirection:"row", alignItems:"center"}}>
                <ExpoIcon name="edit" color="gray" style={{ margin:10}} size={25}/>
                <Text>Edit Profile</Text>
            </TouchableOpacity>






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
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}> 
                        <Text style={styles.title}>Experience</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("ShowExperience")}>
                            <ExpoIcon name="edit" color="gray" style={{ margin:10}} size={25}/>
                        </TouchableOpacity>
                    </View>
                    {
                        nurseExperience.length === 0?

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
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}> 
                        <Text style={styles.title}>Education</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("ShowEducation")}>
                            <ExpoIcon name="edit" color="gray" style={{ margin:10}} size={25}/>
                        </TouchableOpacity>
                    </View>
                    { 
                        nurseEducation.length === 0?

                        <View><Text style={{marginLeft:10}}>No education yet...</Text></View>:

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
        <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
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
    fontSize: 22,
    fontWeight: 'bold',
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
  column:{
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 30,
  }
});