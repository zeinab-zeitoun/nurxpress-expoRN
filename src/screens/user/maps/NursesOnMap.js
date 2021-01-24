import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout, OverlayComponent} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, Button, Platform } from 'react-native';
import {Avatar, Title, Caption} from 'react-native-paper';
import Svg from 'react-native-svg';

import apiNurse from '../../../services/api/nurse';
import apiUser from '../../../services/api/regular';
import cookie from 'cross-cookie';

import Modal from './ChooseService';

export default function Map({navigation}) {
    

    //fetch user info to know his/her location 
    // and center the map accordingly

    const [user, setUser]=useState(null)
    const getUser = async () => {
        await apiUser.getUser(token)
        .then(res => {
            setUser(res.data)})
        .catch( err => console.log(err))
    }

  const [nurses, setNurses] = useState([])
  // get nurses
  const getNurses = async () => {
      await apiNurse.getNurses(token)
      .then(res => {
          setNurses(res.data)})
      .catch( err => console.log(err))
  }

  // get token
  const [token, setToken] = useState('');
  const getToken = async () => {
      await cookie.get('token')
      .then(value => setToken(value));
  }

  useEffect( () => {
      getToken()
      //fetch the data and save it
      if (token){
        getNurses()
        getUser()
      }
  }, [token]) //render again when we get the token
  

  // since navigation on Modal doesn;t work
  //this is a playarount to make it work
  // will be navigating from thsi screen but based 
  //on states updated in the modal (children)
  const [navigate8, setNavigate8] = useState(false);
  const [navigate12, setNavigate12] = useState(false);
  const [navigate24, setNavigate24] = useState(false);
  const [budget8, setBudget8] = useState('');
  const [budget12, setBudget12] = useState('');
  const [budget24, setBudget24] = useState('');

  useEffect ( () => {
    if(navigate8)
      {
        setNavigate8(false)
        navigation.navigate("Limit8HoursBudget", {budget8})
      }
    if(navigate12){
        setNavigate12(false)
        navigation.navigate("Limit12HoursBudget", {budget12})
    }
    if(navigate24){
      setNavigate24(false)
      navigation.navigate("Limit24HoursBudget", {budget24})
  }
  }, [navigate8, navigate12, navigate24])

  //render map
  const renderMap = () => {
    if(!user)
        return <View style={{marginTop:100}}
        >
            <ActivityIndicator size="large" color="#00ced1" />
        </View>
    else
      return(
        <View>
            <MapView style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                customMapStyle={mapStyles}
                loadingEnabled = {true}
                initialRegion={{
                //change them according to user location
                latitude: parseFloat(user.latitude),
                longitude: parseFloat(user.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421}}>

              {
                nurses.map( (nurse, key) => {
                    
                  return <Marker
                          key={key}
                          coordinate={{ latitude : parseFloat(nurse.latitude) , longitude : parseFloat(nurse.longitude)}}
                          image={require('../../../images/nurseIcon.jpeg')}
                          >
                         
                            <Callout style={styles.callout} onPress={() => navigation.navigate("ViewNurseProfile", {nurse_id:nurse.id})}>                          

                            <Text style={styles.name}>{nurse.firstName} {nurse.lastName}</Text>
                            <Text style={{color:"#00ced1"}}>click me!</Text>

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
                            
                          </Callout>
                        
                      </Marker>
          
                })
              }
            </MapView>
            <View style={styles.btnView}>
              <Modal navigate8={navigate8} setNavigate8={setNavigate8}
                     navigate12={navigate12} setNavigate12={setNavigate12}
                     navigate24={navigate24} setNavigate24={setNavigate24}
                     budget8={budget8} setBudget8={setBudget8}
                     budget12={budget12} setBudget12={setBudget12}
                     budget24={budget24} setBudget24={setBudget24} />
            </View>
        </View>
      )
  }
  return (
    <View style={styles.container}>
        {renderMap()}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnView:{
      position: 'absolute',
      marginTop: Platform.OS === 'ios'? 80 :60,
      alignSelf: 'center',
      borderRadius: 5,
      padding: 10,
      shadowColor: "#ccc",
      borderWidth: 1,
      backgroundColor: "white",
      borderColor:"#00ced1",
      shadowOpacity: 0.5,
      shadowRadius: 5,
      
    },
    btn:{
      color:"black",
      fontSize: 18,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    callout: {
        padding: 10,
        alignItems:"center",
        justifyContent:"center",
        minWidth: 250
    },
    row: {
        flexDirection: "row",
        alignItems: "center"   
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        borderLeftColor: "#dddddd",
        borderLeftWidth: 1,
        borderRightColor: "#dddddd",
        borderRightWidth: 1,
        flexDirection: 'row',
        height: 100,
        marginTop: 10,
        marginBottom: 10
    },
    infoBox: {
        width: '33.33%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10
    },
    contact: {
        color:"#777777",
        fontSize:14,
        marginLeft: 2
    },

});

//map style
const mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]