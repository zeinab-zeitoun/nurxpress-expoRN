import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Button,
  StatusBar,
  View,
} from 'react-native';

import Icon from '@expo/vector-icons/AntDesign';

import * as firebase from 'firebase';
import firebaseConfig from '../../FirebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function UploadAvatar(props) {

    const[image, setImage] = useState(null)
    const db = firebase.firestore();


  const pickImage = async () => {
    
    await Permissions.askAsync(Permissions.CAMERA_ROLL).then(async(result) => {
      if(result.status === "granted")
      {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.2,
        });
    
        handleImagePicked(pickerResult);
      }
      else return
    })
  };
  async function uploadImageAsync(uri, name) {

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = firebase
      .storage()
      .ref()
      .child("avatar")
      .child(name);
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
  }

  const addUrlToFireStore = async (avatarUrl) =>{
    await db.collection('users')
            .doc(props.user_id.toString())
            .update({
              avatarUrl: avatarUrl
            })
  }
  const handleImagePicked = async pickerResult => {
    try {
      if (!pickerResult.cancelled) {

        // set the name of the image from the uri we get from the image picker
        let name = pickerResult.uri.split('.')
        name = name[name.length-2]
        name = name.split('/')
        name = name[name.length-1]
  
        //get the image url from firebase
        const uploadUrl = await uploadImageAsync(pickerResult.uri, name)

        //add the url to user in firestore
        addUrlToFireStore(uploadUrl)
        setImage(uploadUrl);

      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } 
  };

   return (
      <View>
        <TouchableOpacity>
          <Icon name="edit" size={30}
                  onPress={pickImage} color="#00ced1"/>
        </TouchableOpacity>
      </View>
    );
}

