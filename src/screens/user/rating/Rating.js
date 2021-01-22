import React, {useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating';
import cookie from 'cross-cookie'; 
import api from '../../../services/api/regular';

function Rating(props) {

    // store nurse id received as prop 
    const [nurse_id, setNurse_id] = useState('');

    const [starCount, setStarCount] = useState(0);
    const [rated, setRated] = useState(false);
    const [ratedBefore, setRatedBefore] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleRating = (rating) => {
        setStarCount(rating)
        setRated(true)
    }

    const handleSubmit = () => {
        setRated(false)
        setSubmitted(true)
        rate()
    }

    // add rating
    const rate = async () => {
        console.log(nurse_id, starCount)
        await api.rate(nurse_id, {rating:starCount}, token)
        .then( res => console.log(res.data))
        .catch( err => console.log(err))
    }

    // get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }

    //check if the user already rated the nurse
    const checkRated = async () => {
        await api.rated(nurse_id, token)
        .then( res => res.data===1? setRatedBefore(true): setRatedBefore(false))
        .catch( err => console.log(err))
    }

    // get the nurse average rating 
    const rating = async() =>{
        await api.rating(nurse_id, token)
        .then( res => {
            if (res.data !== "")
                setStarCount(res.data)
        })
        .catch( err => console.log(err))

    }
    useEffect( () => {
        //get  nurse id
        setNurse_id(props.nurse_id)
        // get token
        getToken()
        //check if user already rated
        if (token){
            checkRated()
            rating()
        }
    
    }, [token]) //render again when we get the token

    return (
        <View style={styles.container}>
            
            {/* if the user submitted, disable rating again */}
            {   (submitted || ratedBefore)?
                <StarRating
                    disabled={true}
                    maxStars={5}
                    fullStarColor={'orange'}
                    emptyStarColor={'orange'}
                    starSize={30}
                    rating={starCount}
                />:
                <StarRating
                    disabled={false}
                    maxStars={5}
                    fullStarColor={'orange'}
                    emptyStarColor={'orange'}
                    starSize={30}
                    rating={starCount}
                    selectedStar={(rating) => handleRating(rating)}
                />

            }

            {/* if the user rates, show submit bottun */}
            { rated ?
                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>:
                <View></View>
            }

            {/* if the user submits the rating, show thank you message */}
            { submitted?
                <View>
                    <Text style={styles.thanks}>Thanks for rating!</Text>
                </View>:
                <View></View>
            }
            {/* if the user had rated this nurse before, display the message */}
            { ratedBefore?
                <View>
                    <Text style={styles.thanks}>You already rated this nurse</Text>
                </View>:
                <View></View>
            }
            {/* if no one rated the nurse yet, display the message: */}
            {
                starCount>0?
                <View></View>:
                <View>
                    <Text style={styles.thanks}>be the first one to rate</Text>
                </View>
            }
        </View>
      )
}
 
export default Rating

const styles = StyleSheet.create({
    container:{
        flexDirection: "column",
        alignItems: "center"
    },

    btnText:{
        borderWidth: 1,
        borderColor: "#dddddd",
        padding:5,
        borderRadius:25,
        marginLeft:5,
    },
    thanks:{
        marginLeft: 5,
        color:"gray"
    }
})