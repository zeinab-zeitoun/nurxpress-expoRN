import React, {useState, useEffect} from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import api from '../../../../services/api/regular';
import cookie from 'cross-cookie';
import * as Permissions from 'expo-permissions';

export default function CurrentLocation(props) {
	
	const [pressed, setpressed] = useState(false)
	// get token 
	// get the token
    const [token, setToken] = useState('');
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
    }
    useEffect( () => {
        getToken()
	}, []) 
	
	// add regular user info 
	const addUser = async (data) => {
		await api.addUser(data, token)
	}

	const findCoordinates = async () => {
		setpressed(true)
		const { status: existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
		await Permissions.askAsync(Permissions.LOCATION);

		let finalStatus = existingStatus;
		// if permission is already denied, get the new status
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);
			finalStatus = status;
		}
		//check final status
		if (finalStatus !== 'granted') {
			Alert.alert('You cannot edit your location!');
			return;
		}
		//get the current location of the user
		navigator.geolocation.getCurrentPosition(
			position => {
				//get the coordinates
				const latitude = position.coords.latitude.toString();
				const longitude = position.coords.longitude.toString();
				// get full name sent by previous page
				const fullName = props.route.params
				//merge previous and new data
				const data = {...fullName, latitude, longitude}
				//add user
				addUser(data)
				props.navigation.navigate("UserTabNavigation")	
			},
			error => Alert.alert("Failed to send location, please try again"),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
	};


	return (
		<View style={styles.container}>
			<ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>

			<Image source ={require('../../../../images/location.jpg')}
                   style={{
							height: "40%",
							width: "100%",
							marginBottom: 50
						}}
            />

			<Text style={styles.text}>
				Send your location to get started! 
				Your location will not be visible to other users.
			</Text>
			

			{/* customized button when pressed => calls findcoordinates function */}
			<TouchableOpacity style={styles.btn} onPress={findCoordinates}>
				<Text style={styles.textBtn}>Send my current location</Text>
			</TouchableOpacity>

			{/* send a success message when the location is sent */}
			{pressed? <Text style={styles.text}>Wait a moment!</Text>: null}
		</ImageBackground>
		</View>
	);
	
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	backImage: {
        flex: 1,
        resizeMode: 'cover',
        padding: 20,
    },
	textBtn: {
		fontSize: 20,
		color: "white",
	},
	text: {
		marginTop: 20,
		fontSize: 17,
		textAlign: "center"
	},
	btn: {
        marginHorizontal:30,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        backgroundColor:"#00ced1",
		paddingVertical:10,
		paddingHorizontal:10,
        borderRadius:23
	},
	image: {
        height: "40%",
        width: "100%",
        marginBottom: 50
    },
})