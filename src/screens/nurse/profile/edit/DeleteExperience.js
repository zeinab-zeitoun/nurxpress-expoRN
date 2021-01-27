import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';
import Icon from '@expo/vector-icons/AntDesign';



export default function DeleteExperience(props, {navigation}) {

    const [id, setId] = useState('');
    const [token, setToken] = useState('');

    // get the token
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // delete education
    const deleteNurseExperience = async () => {
        await api.deleteNurseExperience(id, token)
        .catch( err => console.log(err))
    }

    // confirm deletion

    const confirmDeletion = () =>
    Alert.alert(
      "Delete Experience",
      "Are you sure you want to permenantly delete your experience?",
      [
        {text: "Cancel"},
        { text: "Yes", onPress: () => {
            deleteNurseExperience() 
            props.setDeleted(!props.deleted)
        }
        }
      ],
      { cancelable: false }
    );

    useEffect( () => {
        // get id of the experience
        setId(props.id)
        // get the token
        getToken()
        //fetch nurse experience       
    }, [token])

    return (

        <View>
           <TouchableOpacity onPress={ () => confirmDeletion()}>
                <Icon name="delete" color="red" style={{ margin:10 }} size={25}/>
            </TouchableOpacity>
        </View>
    
  );
}

