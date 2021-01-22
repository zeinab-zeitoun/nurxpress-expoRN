import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Linking, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
} from 'react-native-paper';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpoIcon from '@expo/vector-icons/AntDesign';
//import AnimatedLoader from "react-native-animated-loader"; no working

import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

import DeleteExperience from './DeleteExperience';

function ShowExperience ({navigation}) {

 
    // fetch nurse experience
    const [nurseExperience, setNurseExperience]=useState([])
    const getNurseExperience = async () => {
        await api.getNurseExperience(token)
        .then(res => setNurseExperience(res.data))
        .catch( err => console.log(err))
    }
    
    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // initialize delete state as false
    //set it to true when experience is deleted to render views again
    const [deleted, setDeleted] = useState(false);

    useEffect( () => {
        getToken()
        //fetch the data and save it
        if (token)
            getNurseExperience()
        
        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        navigation.addListener ('focus', () => {
            //fetch the data and save it
            if (token)
                getNurseExperience()
        })
    }, [token, deleted]) //render again when we get the token or when we delete an experience

    // rendering the experience
    const renderExperience = () => {
        if (!nurseExperience){
          return <View style={{marginTop:100}}
          >
              <ActivityIndicator size="large" color="#00ced1" />
          </View>
        }
        else{
            return(
        <View>
            
            <View style={{borderTopWidth:1, borderTopColor:"#dddddd", backgroundColor: "white",}}>
                { nurseExperience.map( experience => (
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
                        <View style={[styles.row, {justifyContent:"flex-end", borderBottomWidth:1, borderBottomColor:"#dddddd"}]}>
                            {/* edit experience */}
                            <TouchableOpacity onPress={ () => navigation.navigate("EditExperience", {id: experience.id})}>
                                    <ExpoIcon name="edit" color="gray" style={{ margin:10 }} size={25}/>
                            </TouchableOpacity>
                            {/* Delete experience */}
                            <DeleteExperience id={experience.id} setDeleted={setDeleted} deleted={deleted}/>
                        </View>
                    </View>
                ))
                }
            </View>
            {/* Add experience */}
            <TouchableOpacity style={[styles.row, {alignItems:"center", margin: 30}]} 
            onPress={() => navigation.navigate('AnotherExperience')}
            >
                    <ExpoIcon name="pluscircleo" size={30} style={{color:"#dc143c", alignSelf:"center"}}/>
                    <Text>  add experience</Text>
            </TouchableOpacity>
        </View>
            )
        }
    }
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>
            {renderExperience()} 
            </ScrollView> 
    </ImageBackground>
    </View>
  );
};

export default ShowExperience

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
    marginBottom: 5,
  },
  name: {
    fontSize: 26,
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
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
    backgroundColor: "white",
  },
  infoBox: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
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
});