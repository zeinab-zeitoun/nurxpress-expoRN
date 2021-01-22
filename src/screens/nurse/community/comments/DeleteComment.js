import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native';
import api from '../../../../services/api/community';
import cookie from 'cross-cookie';
import Icon from '@expo/vector-icons/AntDesign';



export default function DeletePost(props) {

    const [token, setToken] = useState('');

    // get the token
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
       
    }

    // delete comment
    const deleteComment = () => {
        console.log(props.id)
        api.deleteComment(props.id, token)
        .then(res => console.log(res.data))
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
            deleteComment() 
            props.setDeleted(!props.deleted)
        }
        }
      ],
      { cancelable: false }
    );

    useEffect( () => {
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

