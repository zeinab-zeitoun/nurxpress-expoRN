import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Linking, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';
import {
  Text,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpoIcon from '@expo/vector-icons/AntDesign';
//import AnimatedLoader from "react-native-animated-loader"; no working

import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

import DeleteEducation from './DeleteEducation';

export default function Education ({navigation}) {

     // fetch nurse education
    const [nurseEducation, setNurseEducation]=useState([])
    const getNurseEducation = async () => {
        await api.getNurseEducation(token)
        .then(res => setNurseEducation(res.data))
        .catch( err => console.log(err))
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // initialize delete state as false
    //set it to true when education is deleted to render views again
    const [deleted, setDeleted] = useState(false);

    useEffect( () => {
        getToken()
        //fetch the data and save it
        if (token)
          getNurseEducation()

        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        navigation.addListener ('focus', () => {
          //fetch the data and save it
          if (token)
            getNurseEducation()
        })
        
    }, [token, deleted]) //render again when we get the token or when education is deleted



    // rendering the Education
    const renderEducation = () => {
        if (!nurseEducation){
          return <View style={{marginTop:100}}
          >
              <ActivityIndicator size="large" color="#00ced1" />
          </View>
        }
        else{
            return(
        <View>
            {/* Education */}
            <View style={{borderTopWidth:1, borderTopColor:"#dddddd", backgroundColor: "white"}}>
                { nurseEducation.map( education => (
                    <View key={education.id}>
                        <View style={styles.menuItem}>
                            <Icon name="school" color="#00ced1" size={25}/>
                            <Text style={styles.menuItemText}>
                                {education.degree} at {education.school}
                                <Text style={styles.date}> {education.graduationYear}</Text>
                            </Text>
                        </View>
                        <View style={[styles.row, {justifyContent:"flex-end", borderBottomWidth:1, borderBottomColor:"#dddddd"}]}>
                            <TouchableOpacity onPress={ () => navigation.navigate("EditEducation", {id: education.id})}>
                                    <ExpoIcon name="edit" color="gray" style={{ margin:10 }} size={25}/>
                            </TouchableOpacity>
                            <DeleteEducation id={education.id} setDeleted={setDeleted} deleted={deleted}/>
                        </View>
                    </View>
                ))
                }
            </View>
            
            {/* Add education */}
            <TouchableOpacity style={[styles.row, {alignItems:"center", margin: 30}]} 
            onPress={() => navigation.navigate('AnotherEducation')}
            >
                    <ExpoIcon name="pluscircleo" size={30} style={{color:"#dc143c", alignSelf:"center"}}/>
                    <Text>  add education</Text>
            </TouchableOpacity>
        </View>
            )
        }
    }
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView>
            {renderEducation()} 
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