import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ScrollView} from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../../services/api/community';
import cookie from 'cross-cookie';
import {Avatar} from 'react-native-paper';
import Icon from '@expo/vector-icons/AntDesign';

import DeleteComment from './DeleteComment';


export default function Comments(props){

    // fetch comments
    const [comments, setComments]=useState([])
    const getComments = async () => {
        await api.getPostComments(props.route.params.post_id,token)
        .then(res => setComments(res.data))
        .catch( () => {
            //unable o fetch comments
        })
    }

    //add comment

    const [comment, setComment] = useState('');
    const addComment = async () => {
        await api.addComment(props.route.params.post_id, {comment} ,token)
        .then(() => {
            setAdded(!added)
            //empty comment again to empty the input text value
            setComment("")
        })
        .catch( err => {
            //unable to add comment
        })
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // initialize added state as false
    //set it to true when comment is added to render views again
    const [added, setAdded] = useState(false);

    // initialize deleted state as false
    //set it to true when comment is deleted to render views again
    const [deleted, setDeleted] = useState(false);

    useEffect( () => {
        getToken()
        //fetch the posts
        if (token)
        getComments()

        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        props.navigation.addListener ('focus', () => {
            //fetch the data
            if (token)
            getComments()
        })
        
    }, [token, added, deleted]) //render again when we get the token or when a comment is added/deleted

    return(
        <View style={styles.container}>
            <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
                <ScrollView keyboardShouldPersistTaps='handled'>

                    <View style={styles.commentSection}>

                        <TouchableOpacity onPress={() => props.navigation.navigate("OnePost", {id: props.route.params.post_id})}>
                            <Text style={styles.seePost}>See Post</Text>
                        </TouchableOpacity>

                        {/* display all comments if any */}
                        {   comments.length!==0 &&
                            
                            comments.map( comment => (
                                <View key={comment.id}>
                                    <View style={styles.commentContainer}>
                                        <View style={styles.row}>
                                            <Text style={styles.commenter}>{comment.firstName} {comment.lastName}</Text>
                                            {comment.commenter &&
                                                    <TouchableOpacity >
                                                        <DeleteComment id = {comment.id} deleted={deleted} setDeleted={setDeleted} />
                                                    </TouchableOpacity>       
                                            }
                                        </View>
                                        <Text>{comment.comment}</Text>
                                    </View>
                                </View>
                                
                            ))
                        }

                            {/* text input for comments */}
                            <View style={styles.writeComment}>
                                <TextInput 
                                    placeholder="write a review" 
                                    multiline
                                    style={{width:"90%"}}
                                    value = {comment}
                                    onChangeText={ value => setComment(value)}
                                    />

                                {/* add the comment on press */}
                                <TouchableOpacity onPress={addComment}>
                                    <Icon name="caretright" size={30} color="#00ced1" />
                                </TouchableOpacity>
                            </View>
                            
                    </View>

                </ScrollView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#dddddd',
        // marginTop: Platform.OS === 'android' ? 25 : 0
    },
    backImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
    row:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        justifyContent: "space-between"
    },
    name:{
        marginLeft:10,
        fontSize: 18
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
        marginBottom: 15,
        padding: 10,
        
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
    commenter:{
        fontWeight: "bold",
    },
    writeComment:{
        borderWidth: 1,
        borderColor: "#EEEEEE",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        margin: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    seePost:{
        marginLeft: 10,
        color:"blue"
    }
})