import React, {useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating';
import cookie from 'cross-cookie'; 
import api from '../../../../services/api/nurse';

import Icon from '@expo/vector-icons/AntDesign';


function Rating() {

    const [starCount, setStarCount] = useState(0);

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }

    // get the nurse average rating 
    const rating = async() =>{
        await api.rating(token)
        .then( res => {
            if (res.data !== "")
                setStarCount(res.data)
        })
        .catch( err => console.log(err))

    }
    useEffect( () => {

        // get token
        getToken()
        if (token)
            rating()

    }, [token]) //render again when we get the token

    const renderRating = () => {
        if(starCount==0)
        return (
            <View>
                <Text style={styles.text}>No rating yet</Text>
            </View>
        )
              
            
        return (
            <View style={styles.container}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    fullStarColor={'orange'}
                    emptyStarColor={'orange'}
                    starSize={30}
                    rating={starCount}
                />
            </View>
        )
    }
    return (
        <>
        {renderRating()}
        </>
      )
}
 
export default Rating

const styles = StyleSheet.create({
    text:{
        marginLeft: 3,
         color:"gray"
    }
})