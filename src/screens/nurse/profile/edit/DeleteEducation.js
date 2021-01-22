import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';
import Icon from '@expo/vector-icons/AntDesign';



export default function DeleteEducation(props) {

    const [id, setId] = useState('');
    const [token, setToken] = useState('');

    // get the token
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }

    // delete education
    const deleteNurseEducation = () => {
        api.deleteNurseEducation(id, token)
        .then(res => console.log(res.data))
        .catch( err => console.log(err))
    }

    // confirm deletion

    const confirmDeletion = () =>
    Alert.alert(
      "Delete Education",
      "Are you sure you want to permenantly delete your education?",
      [
        {text: "Cancel"},
        { text: "Yes", onPress: () => {
            deleteNurseEducation() 
            props.setDeleted(!props.deleted)
        }
        }
      ],
      { cancelable: false }
    );

    useEffect( () => {
        // get id of the education
        setId(props.id)
        // get the token
        getToken()
        //fetch nurse education   
    }, [token])

    return (

        <View>
           <TouchableOpacity onPress={ () => confirmDeletion()}>
                <Icon name="delete" color="red" style={{ margin:10 }} size={25}/>
            </TouchableOpacity>
        </View>
    
  );
}

