
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';

import api from '../../services/api/availability';
import Icon from '@expo/vector-icons/AntDesign';
import {Calendar} from 'react-native-calendars';
import Details from './Details';


export default function Cal(props) {

  const [pressed, setPressed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const[selected, setSelected] = useState(null);
  const[newSelected, setNewSelected] = useState([]);
  const[prevSelected, setPrevSelected] = useState([]);

  //handle pressed days
  const onDayPress = (day) => {
    setPressed(true)
    // get the new added date
    let newDay = day.dateString
    
    // check if the day is already added to the array, don't add again
    if (!newSelected.includes(newDay)){
      setNewSelected([...newSelected, newDay])
      console.log("new", [...newSelected, newDay])
    }

    // add the new selected day to the old ones
    console.log({...selected, [newDay] : {selected: true}})
    setSelected({...selected, [newDay] : {selected: true}})
  }

  // delete unavailable date
  const deleteUnavailableDate = async (date) => {
    await api.deleteUnavailableDate(date, props.route.params.token)
    .then( (res) => console.log("deleted"))
    .catch( err => console.log(err))
  }
  const onDayLongPress = (day) => {

    // if its not marked, nothing to do
    if (!prevSelected.includes(day.dateString) && !newSelected.includes(day.dateString))
      return

    // if it's saved in the db, we need and api request to delete it
    if (prevSelected.includes(day.dateString))
      {
        deleteUnavailableDate(day.dateString)
        console.log(day.dateString)
        // remove it from selected object to avoid re rendering views
        setSelected({...selected, [day.dateString] : null})
      }
    if (newSelected.includes(day.dateString))
      {
        //remove it from the new selected array 
        var filtered = newSelected.filter(function(value){ 
            return value!=day.dateString;
        });
        setNewSelected(filtered)
        // and from  the selected object
        setSelected({...selected, [day.dateString] : null})
        
      }

  }

  // add the sdelected dates to unavailable dates
  const mark = async () => {
    setPressed(false)
    setSaving(true)
    // add the new sekected dates to unavailable dates
    await api.addUnavailableDates({dates:newSelected}, props.route.params.token)
          .then( () => {
            setSaved(!saved)
            setSaving(false)
          })
          .catch( err => console.log(err))
  }

  useEffect( () => {
    const getUnavailableDates = async () => {
      await api.getUnavailableDates(props.route.params.token)
            .then( res => {
              let dates = res.data
              // save the unavailable dates in an array
              setPrevSelected(dates)
              // write the unavailable dates in the format needed for the calendar
              let unavailableDates = {}
              dates.forEach( date => {
                unavailableDates[date] = {selected: true}
              })
              setSelected(unavailableDates)
            })
            .catch( err => console.log(err))
    }
    getUnavailableDates()

  },[saved])

  const renderViews = () => {
    if(!selected)
      return  <View style={{marginTop: 100}}>
                <ActivityIndicator size="large" color="#00ced1" />
              </View>

  return (
    <View>
          <StatusBar barStyle="light-content"/>
          <Image source={require('../../images/availability.png')} style={styles.image}/>
          <View style={styles.instructions}>
            <Icon name="check" size={25} color="#dc143c"/>
            <Text style={styles.instruction}>Mark the dates where your are unavailable</Text>
          </View>
          <View style={styles.instructions}>
            <Icon name="close" size={25} color="#dc143c"/>
            <Text style={styles.instruction}>To unmark, long press the marked date</Text>
          </View>
          <Calendar
                onDayPress={onDayPress}
                onDayLongPress={onDayLongPress}
                style={styles.calendar}
                hideExtraDays
                minDate={new Date()}
                markedDates={{
                '2021-01-23': {disabled: true, disableTouchEvent: true}
                }}
                markedDates={selected}
                theme={{
                  selectedDayBackgroundColor: '#00ced1',
                  todayTextColor: '#00ced1',
                  arrowColor: '#00ced1',
                  textSectionTitleColor: 'black',
                  textDayHeaderFontSize: 16,
                }}
              />
            { saving && 
            <View style={{marginTop: 20}}>
              <ActivityIndicator size="large" color="#00ced1" />
            </View>}

      
            {pressed && 
              <TouchableOpacity style={styles.btn} onPress={mark}>
                <Text style={{color:"black"}}>
                  Save
                </Text>
              </TouchableOpacity>
            }

          {/* details component */}
          <Details token={props.route.params.token}/>
    </View>
    );
  }

  return (
  <KeyboardAvoidingView 
    style={styles.container}
        behavior="padding">
    <ImageBackground source={require('../../images/background2.png')} style={styles.backImage}>
      <ScrollView  keyboardShouldPersistTaps='handled' >
        {renderViews()}      
      </ScrollView>
    </ImageBackground>
  </KeyboardAvoidingView>
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
    marginTop: 15,
  },
  backImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  btn: {
    width: "15%",
    alignItems:"center",
    alignSelf: "flex-end",
    justifyContent:"center",
    backgroundColor:"#00ced1",
    paddingVertical:10,
    borderRadius:15,
    marginTop: 20,
  },
  instructions:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  instruction:{
    marginLeft: 3,
    fontSize: 16,
    
  }
});