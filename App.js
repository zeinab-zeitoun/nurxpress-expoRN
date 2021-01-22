import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NurseTabNavigation from './src/navigations/NurseTabNavigation';
import UserTabNavigation from './src/navigations/UserTabNavigation';

import Login from './src/screens/authentication/Login'
import Register from './src/screens/authentication/Register';
import Welcome from './src/screens/welcome/Welcome';

//nurse profile
import Profile from './src/screens/nurse/profile/view/Profile';

//fill profile
import PersonalInfo from './src/screens/nurse/profile/fill/PersonalInfo';
import NurseCurrentLocation from './src/screens/nurse/profile/fill/CurrentLocation';
import Education from './src/screens/nurse/profile/fill/Education';
import AnotherEducation from './src/screens/nurse/profile/fill/AnotherEducation';
import Experience from './src/screens/nurse/profile/fill/Experience';
import AnotherExperience from './src/screens/nurse/profile/fill/AnotherExperience';
import Price from './src/screens/nurse/profile/fill/Price';

//edit profile
import EditProfile from './src/screens/nurse/profile/edit/EditProfile';
import EditLocation from './src/screens/nurse/profile/edit/EditLocation';
import EditEducation from './src/screens/nurse/profile/edit/EditEducation';
import ShowEducation from './src/screens/nurse/profile/edit/ShowEducation';
import EditExperience from './src/screens/nurse/profile/edit/EditExperience';
import ShowExperience from './src/screens/nurse/profile/edit/ShowExperience';

// maps
import NursesOnMap from './src/screens/user/maps/NursesOnMap';
import Limit8HoursBudget from './src/screens/user/maps/Limit8HoursBudget';
import Limit12HoursBudget from './src/screens/user/maps/Limit12HoursBudget';
import Limit24HoursBudget from './src/screens/user/maps/Limit24HoursBudget';

// Community
import AddPost from './src/screens/nurse/community/posts/AddPost';
import EditPost from './src/screens/nurse/community/posts/EditPost';
import Comments from './src/screens/nurse/community/comments/Comments';
import CommunityNotifications from './src/screens/nurse/community/notifications/Notifications'
import OnePost from './src/screens/nurse/community/posts/OnePost';

//Chats
import Chats from './src/screens/chats/Chats';

//Cookies
import cookie from 'cross-cookie';

//regular User//

//user info
import UserCurrentLocation from './src/screens/user/information/fill/Location';
import FullName from './src/screens/user/information/fill/FullName';

// edit user info
import EditUserLocation from './src/screens/user/information/edit/EditLocation';

// view nurse profile
import ViewNurseProfile from './src/screens/user/viewNurseProfile/ViewNurseProfile';

import Availability from './src/screens/schedule/Availability';
import NurseAvailability from './src/screens/user/viewNurseProfile/NurseAvailability';


const MyTheme = {
	...DefaultTheme,
	colors: {
	  ...DefaultTheme.colors,
	  primary: 'white', 
	},
  };

  //const theme_toapply_Navigatoin=darkState?(DarkTheme):(MyTheme);
  
export default function App() {

	const [initialScreenName, setInitialScreenName] = useState(null);
	//const [token, setToken] = useState(null);
	//const [role, setRole] = useState(null);

	const Stack = createStackNavigator();

	// get the token and role if exist
	// set the initial state accordingly
    const getRoleAndToken = async () => {
		await cookie.get('token')
		.then(async (token) => {
			await cookie.get('role')
			.then(role => {
				// if token doesn't exist, take to login page
				if(!token)
					setInitialScreenName("Welcome")
				//else
				else if(role=="nurse")
					setInitialScreenName("NurseTabNavigation")
				else if(role=="regular")
					setInitialScreenName("UserTabNavigation")
		});
	})
}
	
    useEffect( () => { 
		getRoleAndToken()
	}, []) //render again when we get the token
	
	const renderNav = () => {
		if(!initialScreenName)
		return <View style={{marginTop:100}}
				>
					<ActivityIndicator size="large" color="#00ced1" />
				</View>
		return(
		
			<NavigationContainer  theme={MyTheme}>
			
			  <Stack.Navigator initialRouteName = {initialScreenName}>
			  	<Stack.Screen name="Welcome" 
				  			component={Welcome}
							  options={{
								title:"",
								headerShown: false
							}} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Register" component={Register} />
				
				{/* filling the profile of the nurse */}
				<Stack.Screen name="PersonalInfo" 
							component={PersonalInfo}
							options={{
								title:"",
								headerLeft: null
							}} />
		
				<Stack.Screen name="NurseCurrentLocation" 
							component={NurseCurrentLocation}
							options={{
								title:"Current Location"
							}} />
		
				<Stack.Screen name="Price" 
							component={Price}
							options={{
								headerLeft: null
							}} />
		
				<Stack.Screen name="Education" component={Education} />
				<Stack.Screen name="AnotherEducation" 
							component={AnotherEducation}
							options={{
								title: ""
							}} />
		
				<Stack.Screen name="Experience" 
							component={Experience}
							options={{
								headerLeft: null
							}} />
		
				<Stack.Screen name="AnotherExperience" 
							component={AnotherExperience}
							options={{
								title: ""
							}} />
		
				<Stack.Screen name="Profile" 
							component={Profile}
							options={{
								title: "",
								headerLeft: null
							}} />
				
				{/* EDiting profile */}
				<Stack.Screen name="EditProfile" 
							component={EditProfile}
							options={{
								title:"Edit My Profile"
							}} />
				<Stack.Screen name="EditLocation" 
							component={EditLocation}
							options={{
								title:"Change My Location"
							}} />
				<Stack.Screen name="ShowEducation" 
							component={ShowEducation}
							options={{
								title:"Education"
							}} />
				<Stack.Screen name="EditEducation" 
							component={EditEducation}
							options={{
								title:"Edit My Education"
							}} />
				<Stack.Screen name="ShowExperience" 
							component={ShowExperience} 
							options={{
								title:"Experience"
							}} />
				<Stack.Screen name="EditExperience" 
							component={EditExperience} 
							options={{
								title:"Edit My Experience"
							}} />
		
				{/* nurse community */}
				<Stack.Screen name="AddPost" 
							component={AddPost} 
							options={{
								title:""
							}} />
				<Stack.Screen name="EditPost" 
							component={EditPost} 
							options={{
								title:""
							}} />
				<Stack.Screen name="OnePost" 
							component={OnePost} 
							options={{
								title:""
							}} />
				<Stack.Screen name="Comments" 
							component={Comments} 
							options={{
								title:""
							}}
							 />
				
				<Stack.Screen name="CommunityNotifications" 
							component={CommunityNotifications} 
							options={{
								title:""
							}}
							 />
		
				<Stack.Screen name="NurseTabNavigation" 
							component={NurseTabNavigation}
							options={{
								title:""
							}}/>

				<Stack.Screen name="Availability" 
							component={Availability}
							options={{
								title:""
							}}/>
		
				{/* REGULAR USER */}
				<Stack.Screen name="FullName" 
							component={FullName}
							options={{
								title:"Full Name"
							}} />
		
				<Stack.Screen name="UserCurrentLocation" 
							component={UserCurrentLocation}
							options={{
								title:"Current Location"
							}} />
				
				<Stack.Screen name="EditUserLocation" 
							component={EditUserLocation}
							options={{
								title:"Edit your Name"
							}} />
		
				<Stack.Screen name="NursesOnMap" 
							component={NursesOnMap}
							options={{
								title:"",
								headerShown: false
							}} />

				<Stack.Screen name="Limit8HoursBudget" 
							component={Limit8HoursBudget}
							options={{
								title:"",
							}} />

				<Stack.Screen name="Limit12HoursBudget" 
							component={Limit12HoursBudget}
							options={{
								title:"",
							}} />

				<Stack.Screen name="Limit24HoursBudget" 
							component={Limit24HoursBudget}
							options={{
								title:"",
							}} />
				<Stack.Screen name="ViewNurseProfile" 
							component={ViewNurseProfile}
							options={{
								title:""
							}} />
				<Stack.Screen name="NurseAvailability" 
							component={NurseAvailability}
							options={{
								title:""
							}} />
		
				<Stack.Screen name="UserTabNavigation" 
							component={UserTabNavigation}
							options={{
								title:""
							}}/>
		
				<Stack.Screen name="Chats" 
							component={Chats}
							options={{
								title:"",
								headerShown: false
							}}/>
		
			  </Stack.Navigator>
			</NavigationContainer>
			)
	}
	return(
		<>
			{renderNav()}
		</>
	)
}