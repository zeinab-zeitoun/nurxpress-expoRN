import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/AntDesign';

export default function Services(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [eightHours, setEightHours] = useState(false);
  const [twelveHours, setTwelveHours] = useState(false);
  const [twentyFourHours, setTwentyFourHours] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>What service are you looking for?</Text>

            {/* 8 hours service */}
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#e0ffff' }}
              onPress={() => {
                setEightHours(true)
                setTwelveHours(false)
                setTwentyFourHours(false)
              }}>
              <Text style={styles.textStyle}>8 hours private nursing</Text>
            </TouchableOpacity>
            
              {
                eightHours &&
                <View style={styles.inputCtr}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Maximum Price in $"
                    onChangeText={(value) => props.setBudget8(value)}
                    />
                </View>
              }

            {/* 12 hours service */}
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#00ffff' }}
              onPress={() => {
                setTwelveHours(true)
                setEightHours(false)
                setTwentyFourHours(false)
              }}>
              <Text style={styles.textStyle}>12 hours private nursing</Text>
            </TouchableOpacity>
            
              {
                twelveHours &&
                <View style={styles.inputCtr}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Maximum Price in $"
                    onChangeText={(value) => props.setBudget12(value)}
                    />
                </View>
              }
            
            {/* 24 hours service */}
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#00ced1' }}
              onPress={() => {
                setTwentyFourHours(true)
                setEightHours(false)
                setTwelveHours(false)
              }}>
              <Text style={styles.textStyle}>24 hours private nursing</Text>
            </TouchableOpacity>
            
              {
                twentyFourHours &&
                <View style={styles.inputCtr}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Maximum Price in $"
                    onChangeText={(value) => props.setBudget24(value)}
                    />
                </View>
              }

              {/* search bottun */}
            <View style={styles.btnsCtr}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => {
                  setEightHours(false)
                  setTwelveHours(false)
                  setTwentyFourHours(false)
                  setModalVisible(false);
                  if (eightHours)
                    props.setNavigate8(true)  
                  if (twelveHours)
                    props.setNavigate12(true) 
                  if (twentyFourHours)
                    props.setNavigate24(true) 
                }}>
                <Icon name="search1" size={35} color="#d1d1d1" style={{marginRight:10}}/>
              </TouchableOpacity>

                <View>
                  <Text>        </Text>
                </View>

                {/* cancel icon */}
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => {
                  setEightHours(false)
                  setTwelveHours(false)
                  setTwentyFourHours(false)
                  setModalVisible(false);         
                }}>
                <Icon name="close" size={35} color="red" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>Limit nurses according to your budget </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 35,
    paddingHorizontal: 35,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    width: 220,
    borderRadius: 20,
    padding: 10,
    elevation: 3,
    marginBottom: 5
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16
  },
  cancel:{
    marginTop: 20
  },
  input:{
    padding: 5,
    alignSelf: "center",
    textAlign: "center",
  },
  inputCtr:{
    width:220,
    borderWidth: 2,
    borderColor: "#dddddd",
    marginBottom: 10,
    borderRadius: 20,
  },
  btnsCtr:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
});