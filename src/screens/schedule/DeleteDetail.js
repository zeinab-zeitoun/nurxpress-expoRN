import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native';
import api from '../../services/api/details';
import cookie from 'cross-cookie';
import Icon from '@expo/vector-icons/AntDesign';



export default function DeletePost(props) {

    // delete detail
    const deleteDetail = () => {
        api.deleteDetail(props.id, props.token)
        .catch( err => console.log(err))
    }

    // confirm deletion
    const confirmDeletion = () =>
    Alert.alert(
      "Delete Post",
      "Are you sure you want to permenantly delete your comment?",
      [
        {text: "Cancel"},
        { text: "Yes", onPress: () => {
            deleteDetail() 
            props.setRender(!props.render)
        }
        }
      ],
      { cancelable: false }
    );


    return (

        <View>
           <TouchableOpacity onPress={ () => confirmDeletion()}>
                <Icon name="delete" color="#dc143c"  size={25}/>
            </TouchableOpacity>
        </View>
    
  );
}

