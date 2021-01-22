import React, {useState, useEffect} from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';
import * as Permissions from 'expo-permissions';

export default function CurrentLocation({navigation}) {
	
	const [pressed, setpressed] = useState(false)

	 // get the token
	 const [token, setToken] = useState('');
	 const getToken = async () => {
		 await cookie.get('token')
		 .then(value => setToken(value));
		 console.log(token)
	 }
	 // fetch the previous data
	 useEffect( () => {
		getToken()
	 }, [token]) //render again when we get the token

	const changeLocation = async (data) => {
		await api.changeLocation(data, token)
		navigation.navigate("NurseSettings")
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
				console.log(longitude, latitude)
				changeLocation({latitude, longitude})
			},
			error => Alert.alert(error),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
		};


	return (
		<View style={styles.container}>
			<ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
				<Image source ={require('../../../../images/location.jpg')}
					style={{
								height: "50%",
								width: "100%",
								resizeMode: "contain",
								marginBottom: 50
							}}
				/>

				{/* customized button when pressed => calls findcoordinates function */}
				<TouchableOpacity style={styles.btn} onPress={findCoordinates}>
					<Text style={styles.textBtn}>Send my new current location</Text>
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