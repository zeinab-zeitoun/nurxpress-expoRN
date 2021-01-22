import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../../services/api/community';
import cookie from 'cross-cookie';
import {Avatar} from 'react-native-paper';
import moment from 'moment';
import Icon from '@expo/vector-icons/AntDesign';

import DeletePost from './DeletePost';


export default function OnePost(props){

    // get post
    const [post, setPost]=useState([])
    const getPost = async () => {
        await api.getPost(props.route.params.id, token)
        .then(res => setPost(res.data))
        .catch( err => console.log(err))
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }

    useEffect( () => {
        getToken()
        //fetch the posts
        if (token)
        getPost()

        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        props.navigation.addListener ('focus', () => {
            //fetch the data
            if (token)
            getPost()
        })
        
    }, [token]) //render again when we get the token

    return(
        <ScrollView style={styles.container}>

            <View>
            {
                post === null?
                    <View style={{marginTop:100}}>
                        <ActivityIndicator size="large" color="#00ced1" />
                    </View>:
               
                   
                    <View style={styles.postContainer}>
                        <View style = {styles.row}>
                            {/* name of the user with his profile and time posted */}
                            <View style = {styles.row}>
                                <Avatar.Image 
                                        source={{
                                        uri: 'https://www.ecpi.edu/sites/default/files/Nursing%20Sept%2027.png',
                                        }}
                                        size={50}
                                    />
                                <View style={styles.column}>
                                    <Text style={styles.name}>{post.firstName} {post.lastName}</Text>
                                    <Text style={styles.time}>{moment(post.created_at).fromNow()}</Text>
                                </View> 
                            </View>                          

                        </View>
                        <Text>{post.post}</Text>
                    </View>
            }
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#dddddd',
        // marginTop: Platform.OS === 'android' ? 25 : 0
    },
    image: {
        height: 250,
        width: "100%",
    },
    postContainer: {
        backgroundColor: "white",
        padding:20,
    },
    row:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        justifyContent: "space-between"
    },
    name:{
        marginLeft:10,
        fontSize: 18,
        fontWeight: "bold"
    },
    column: {
        flexDirection: "column",
    },
    time:{
        marginLeft:10,
        color: "gray"
    },
    commentSection: {
        flexDirection: "column",
        borderTopWidth: 1,
        borderColor: "#dddddd",
        backgroundColor: "white",
        marginBottom: 15,
        padding: 10
    },
    commentContainer: {
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#F7F7F7",
        backgroundColor: "#F7F7F7",
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    writePost:{
        borderWidth: 1,
        borderColor: "#00ced1",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 25,
        marginVertical: 5
    },
    commenter:{
        fontWeight: "bold",
        color:"black",
    },
    writeComment:{
        borderWidth: 1,
        borderColor: "#EEEEEE",
        backgroundColor: "#EEEEEE",
        padding: 10,
        borderRadius: 25,
        margin: 10
    },
})