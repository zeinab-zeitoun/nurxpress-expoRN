import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from '@expo/vector-icons/AntDesign';

import Profile from '../screens/nurse/profile/view/Profile';
import NurseRooms from '../screens/chats/NurseRooms';
import NurseSettings from '../screens/nurse/settings/Settings';
import Community from '../screens/nurse/community/Community';

export default function NurseTabNavigation(){

	const Tab = createMaterialBottomTabNavigator();

	return (
		<Tab.Navigator>
			
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
				tabBarLabel: 'Profile',
				tabBarIcon: () => (
					<Icon name="user" size={24} color="gray" />
				),
				}}
			/>

			<Tab.Screen
				name="NurseRooms"
				component={NurseRooms}
				options={{
				tabBarLabel: 'Chats',
				tabBarIcon: () => (
					<Icon name="wechat" size={24} color="gray" />
				),
				}}
			/>
			<Tab.Screen
				name="Community"
				component={Community}
				options={{
				tabBarLabel: 'Community',
				tabBarIcon: () => (
					<Icon name="team" size={24} color="gray" />
				),
				}}
			/>

			<Tab.Screen
				name="NurseSettings"
				component={NurseSettings}
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