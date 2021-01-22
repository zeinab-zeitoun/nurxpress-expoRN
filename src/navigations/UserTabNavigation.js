import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from '@expo/vector-icons/AntDesign';

import UserRooms from '../screens/chats/UserRooms';
import UserSettings from '../screens/user/settings/Settings';
import NursesOnMap from '../screens/user/maps/NursesOnMap';

export default function UserTabNavigation(){

	const Tab = createMaterialBottomTabNavigator();

	return (
		<Tab.Navigator>
			
			<Tab.Screen
				name="NursesOnMap"
				component={NursesOnMap}
				options={{
				tabBarLabel: '',
				tabBarIcon: () => (
					<Icon name="search1" size={24} color="gray" />
				),
				}}
			/>

			<Tab.Screen
				name="UserRooms"
				component={UserRooms}
				options={{
				tabBarLabel: 'Chats',
				tabBarIcon: () => (
					<Icon name="message1" size={24} color="gray" />
				),
				}}
			/>
			

			<Tab.Screen
				name="UserSettings"
				component={UserSettings}
				options={{
				tabBarLabel: 'Settings',
				tabBarIcon: () => (
					<Icon name="bars" size={24} color="gray" />
				),
				}}
			/>
			
		</Tab.Navigator>
	);

}