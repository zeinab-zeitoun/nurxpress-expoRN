import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../../services/api/community';
import cookie from 'cross-cookie';
import {Avatar} from 'react-native-paper';


export default function EditPost(props){

         // edit post
         const [id, setId] = useState(props.route.params.id)
         const [post, setPost] = useState(props.route.params.post);
         const editPosts = async () => {
             await api.editPosts(id, {post}, token)
             .then(res => console.log(res.data))
             .catch( err => console.log(err))
             // navigate back to community after editing post 
             props.navigation.goBack()
         }
     
         // get the token
         const [token, setToken] = useState('');
         const getToken = async () => {
             await cookie.get('token')
             .then(value => setToken(value));
         }
     
     
         useEffect( () => {
            getToken() 
         }, [token]) //render again when we get the token

    return(
        <ScrollView style={styles.container}
            keyboardShouldPersistTaps='handled' 
        >
            <Image source ={require('../../../../images/nurses-community.jpg')}
                    style={styles.image}
            />

            {/* input text with tehe previous post to be edited */}
            <View style={styles.writePost}>
                <TextInput placeholder="Share your experience and knowledge"
                    multiline={true}
                    value={post}
                    onChangeText={value => setPost(value)}
                />
            </View>

            {/* bottun => pressed => edit post */}
            <TouchableOpacity style={styles.btn}
                            onPress={editPosts}
            >
                <Text>
                    Post
                </Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#dddddd',
    },
    image: {
        height: 250,
        width: "100%",
    },
    
    writePost:{
        borderWidth: 1,
        borderColor: "#00ced1",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 25,
        marginVertical: 5,
        height: 300
    },
    btn: {
        marginHorizontal:150,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#00ced1",
        paddingVertical:10,
        borderRadius:23,
        marginBottom: 50
    },
})