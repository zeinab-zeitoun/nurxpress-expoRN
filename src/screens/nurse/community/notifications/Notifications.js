import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, ActivityIndicator, ImageBackground, ScrollView} from 'react-native';
import api from '../../../../services/api/community';
import cookie from 'cross-cookie';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

export default function Notifications({navigation}) {


    // fetch comments on user's post
    const [comments, setComments]=useState(null)
    const getComments = async () => {
        await api.getUserPostsComments(token)
        .then(res => setComments(res.data))
        .catch( err => {
            // unable to fetch comments
        })
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }

    // mark notification as red
    const markRead = async (id) => {
        await api.markRead(id, token)
        .catch( () => {
            // unable to mark notification as read
        })
    } 

    useEffect( () => {
        getToken()
        //fetch the posts
        if (token)
            getComments()

        // will be executed when we come back to the screen
        // so in case any update happened, it will update the data
        //~ refresh feature
        navigation.addListener ('focus', () => {
            //fetch the data
            if (token)
                getComments()
        })
        
    }, [token]) //render again when we get the token

    const renderViews = () => {
        if(!comments)
        return <View>
                    <ActivityIndicator size="large" color="#00ced1" />
                </View>

    return(
        <View style={styles.container}>
            <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
                <ScrollView keyboardShouldPersistTaps='handled'>

                    <View >
                        {
                            comments.length === 0?
                            (
                                <>
                                <Image source ={require('../../../../images/notifications.png')}
                                    style={styles.image}
                                />
                                <Text style={styles.noNotifications}>You do not have notifications on the last month</Text>
                                </>
                            ):
                            
                            comments.map( comment =>(
                                
                                // if the message is unread yet, set the backgrount gray 
                                // add a function to make it read
                                comment.read === 0? 
                                <TouchableOpacity key={comment.id}
                                                    style={styles.notificationCtr}
                                                    onPress={() => {
                                                        markRead(comment.id)
                                                        navigation.navigate("Comments", {post_id:comment.post_id})
                                                        }}
                                                    >
                                        
                                        <View style={styles.column}>
                                            <Icon name="comment" size={40} style={styles.commentIcon}/>
                                            <Text style={{fontSize:10}}>{moment(comment.created_at).fromNow()}</Text>
                                        </View>
                                        
                                        <View>
                                            <Text style={styles.name}>
                                                {comment.firstName} {comment.lastName}
                                            </Text>
                                            
                                            <Text style={{fontSize: 16}}>
                                                added a review on your post
                                            </Text>
                                        </View>
                
                                </TouchableOpacity>:

                                // if the message is read , set the background white 
                                <TouchableOpacity key={comment.id}
                                                    style={styles.readNotificationCtr}
                                                    onPress={() => navigation.navigate("Comments", {post_id:comment.post_id})}>
                                        
                                        <View style={styles.column}>
                                            <Icon name="comment" size={40} style={styles.commentIcon}/>
                                            <Text style={{fontSize:10}}>{moment(comment.created_at).fromNow()}</Text>
                                        </View>
                                        
                                        <View>
                                            <Text style={styles.name}>
                                                {comment.firstName} {comment.lastName}
                                            </Text>
                                            
                                            <Text style={{fontSize: 16}}>
                                                added a review on your post
                                            </Text>
                                        </View>
                
                                </TouchableOpacity>

                            ))
                        }
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
        )
    }
    return(
        <>
        {renderViews()}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    backImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    notificationCtr:{
        borderBottomWidth: 1,
        borderColor: "#dddddd",
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#EEEEEE"
    },
    image:{
        margin: 70,
        alignSelf: "center",
    },
    noNotifications:{
        fontSize: 20,
        textAlign: "center",
        marginHorizontal: 40,
    },
    readNotificationCtr:{
        borderBottomWidth: 1,
        borderColor: "#dddddd",
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white"
    },
    name:{
        fontWeight: "bold",
        fontSize: 16
    },
    commentIcon:{
        marginHorizontal: 20,
        color: "#00ced1"
    },
    row:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column:{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: 15
    }
  });