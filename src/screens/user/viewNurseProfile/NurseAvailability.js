import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground, 
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

import api from '../../../services/api/availability';
import detailsApi from '../../../services/api/details';

import Icon from '@expo/vector-icons/AntDesign';

import {Calendar} from 'react-native-calendars';


export default function Cal(props) {

  const[selected, setSelected] = useState(null);
  const[details, setDetails] = useState(null)

  // get unavailable details
  const getUnavailableDates = async () => {
    await api.getUnavailableDatesOfNurse(props.route.params.nurse_id, props.route.params.token)
          .then( res => {
            let dates = res.data
            // write the unavailable dates in the format needed for the calendar
            let unavailableDates = {}
            dates.forEach( date => {
              unavailableDates[date] = {selected: true}
            })
            setSelected(unavailableDates)
          })
          .catch( err => console.log(err))
  }
  // get details
  const getDetails = async () => {
      await detailsApi.getDetailsOfNurse(props.route.params.nurse_id, props.route.params.token)
      .then( (res) => setDetails(res.data))
  }

  useEffect( () => {
    getUnavailableDates()
    getDetails()
  },[])

  const renderViews = () => {
    if(!selected)
      return  <View style={{marginTop: 100}}>
                <ActivityIndicator size="large" color="#00ced1" />
              </View>

    return (
    <View>
          <StatusBar barStyle="light-content"/>
          <Image source={require('../../../images/availability.png')} style={styles.image}/>
          <View>
            <Text style={styles.text}>Sorry! I'm unavailable at the marked dates</Text>
          </View>
          <Calendar
                style={styles.calendar}
                hideExtraDays
                minDate={new Date()}
                markedDates={selected}
                theme={{
                  selectedDayBackgroundColor: '#00ced1',
                  todayTextColor: '#00ced1',
                  arrowColor: '#00ced1',
                  textSectionTitleColor: 'black',
                  textDayHeaderFontSize: 16,
                }}
              />

          {/* details component */}
          {   details && details.length !== 0 && 
                    details.map((detail, i) => (
                        <View key={i} style={styles.detailCtr}>
                            { (i+1)%2==0? 
                                <Icon name="star" size={30} color="#00ced1" />:
                                <Icon name="star" size={30} color="#dc143c" />
                            }
                            <Text style={styles.detail}>{detail.detail}</Text>
                           
                        </View>
                    ))
                }

    </View>
    );
  }

  return (
  <View style={styles.container}>
    <ImageBackground source={require('../../../images/background2.png')} style={styles.backImage}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        {renderViews()}      
      </ScrollView>
    </ImageBackground>
  </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image:{
    alignSelf: "center",
    resizeMode: "contain",
    height: 80,
    marginBottom: 10,
  },
  calendar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 370,
    marginVertical: 15,
  },
  backImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  detailCtr: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    margin: 10,
    },
    detail: {
        fontSize: 15,
        marginLeft: 3,
        paddingRight: 10,
    }
});