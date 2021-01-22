import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../services/api/community';
import cookie from 'cross-cookie';
import {Avatar} from 'react-native-paper';
import moment from 'moment';
import Icon from '@expo/vector-icons/AntDesign';

import DeletePost from './posts/DeletePost';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../../../../FirebaseConfig';

// Initialize Firebase
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}else {
firebase.app(); // if already initialized
}

const db = firebase.firestore()

export default function Community({navigation}){

    // fetch posts
    const [posts, setPosts]=useState(null)
    const getPosts = async () => {
        await api.getPosts(token)
        .then(res => {
            setPosts(res.data)
            //get avatar of the users
            getAvatar()
        })
        .catch( err => console.log("error", err))
    }

    const[avatarUrls, setAvatarUrls] = useState(null)
    const getAvatar = () => {
        // get users avatar
    db.collection("users")
    .onSnapshot( snap => {
        let avatarUrl = {}
        snap.forEach(doc => {
            avatarUrl[doc.id]= doc.data().avatarUrl
        })
        setAvatarUrls(avatarUrl)
    })
    }
    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // initialize delete state as false
    //set it to true when education is deleted to render views again
    const [deleted, setDeleted] = useState(false);

    useEffect( () => {
        getToken()
        //fetch the posts
        if (token)
            getPosts()

        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        navigation.addListener ('focus', () => {
            getToken()
            //fetch the data
            if (token)
                getPosts()
        })
        
    }, [token, deleted]) //render again when we get the token

    const renderPosts = () => {
        if(!posts)
            return <View style={{marginTop:100}}>
                            <ActivityIndicator size="large" color="#00ced1" />
                    </View>

        if(posts.length===0)
            return  <View>
                        <Text style={{fontSize: 24, textAlign: "center", padding: 30}}>No jobs opportunities shared in the last month</Text>
                        <Image source ={require('../../../images/sad-face.jpg')}
                            style={{alignSelf: "center"}}
                        />
                    </View>

        return <View>
        {
            posts.map( (post, key) => (
                <View key={key} >
                <View style={styles.postContainer}>
                    <View style = {styles.row}>
                        {/* name of the user with his profile and time posted */}
                        <View style = {styles.row}>
                            {
                                avatarUrls && 
                                <Avatar.Image 
                                    source={{
                                    uri: avatarUrls[post.user_id],
                                    }}
                                    size={50}
                                />
                            }
                            <View style={styles.column}>
                                <Text style={styles.name}>{post.firstName} {post.lastName}</Text>
                                <Text style={styles.time}>{moment(post.created_at).fromNow()}</Text>
                            </View> 
                        </View>

                        {/* if the authenticated user is the author if the post
                        show edit and delete buttons */}
                        {post.author &&
                            <View style = {styles.row}>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("EditPost", {post:post.post, id:post.id})}>
                                    <Icon name="edit" color="gray" style={{ margin:10}} size={25}/>
                                </TouchableOpacity>
                                <DeletePost id={post.id} deleted={deleted} setDeleted={setDeleted}/>
                            </View>
                        }
                        
                    </View>
                    
                    <Text>{post.post}</Text>

                {/* comment section */}
                </View>
                    <View style={styles.commentSection}>
                        
                        {/* only show last comment if any */}
                        {   post.comment!==null &&
                            <View>
                                <Text>Reviews</Text>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("Comments", {post_id:post.id})}
                                    style={styles.commentContainer}
                                >
                                    <Text style={styles.commenter}>{post.comment.firstName} {post.comment.lastName}</Text>
                                    <Text style={{color:"gray"}}>{post.comment.comment}</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {/* add a comment */}
                        <TouchableOpacity style={styles.writeComment}
                            onPress={() => navigation.navigate("Comments", {post_id:post.id})}
                        >
                                <Text style={{color:"gray"}}>Write a review if you know anything about the job</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))
        }
        </View>

    }
    return(
        <ScrollView style={styles.container}>

            {/* display imgae for the community and bottun to add post */}
            <Image source ={require('../../../images/nurses-community.jpg')}
                    style={styles.image}
            />

            <TouchableOpacity style={styles.writePost}
                            onPress={() => navigation.navigate("AddPost")}>
                <Text style={{color:"gray"}}>Share a Job Opportunity</Text>
            </TouchableOpacity>

            {/* render views */}
            {renderPosts()}

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
        fontSize: 18,
        fontWeight: "bold"
    },
    column: {
        flexDirection: "column",
        marginLeft: 10,
    },
    time:{
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