import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Animated,
    StyleSheet,
    ImageBackground,
    Image,
} from 'react-native';
import {Avatar} from 'react-native-paper';
//import * as Animatable from 'react-native-animatable';
///import LinearGradient from 'react-native-linear-gradient';
//import { useTheme } from '@react-navigation/native';react-native-vector-icons/MaterialIcons

const Welcome = ({navigation}) => {
    const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
    return (
      <View style={styles.container}>
       <ImageBackground source={require('../../images/background3.png')} style={styles.backImage} >
          <View style={styles.header}>
          <Avatar.Image 
              source={require('../../images/looking-for-nurse.png')}
              size={230}
              style={{elevation: 20}}
          />
          </View>
          <View style={styles.footer}>
              <Text style={styles.text1}>Are you looking for a <B>private nurse</B> in <B>your area</B> with <B>affordable prices</B>?</Text>
              <Text style={styles.text1}>Are you a <B>nurse</B> looking for a <B>job?</B></Text>
              <Text style={styles.text2}>This is the right place for you!</Text>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
                  <Text style={{color:"white", fontSize: 16}}>Let's Get Started</Text>
              </TouchableOpacity>
          </View>
          {/* <View style={styles.contact}>
              <Text style={styles.contactText}>contact us on zeinabzeitoun.98@gmail.com</Text>
          </View> */}
        </ImageBackground>
      </View>
    );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#00ced1',
    marginTop: 30,
  },
  backImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    },
  header: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 4,
    backgroundColor: '#f8f8ff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30
  },
  contact:{
    flex:1,
    backgroundColor: "#dddddd",
  },
  contactText:{
    textAlign: "center",
    color:"black",
    marginTop: 12,
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text1: {
      color: 'black',
      textAlign: "center",
      fontSize: 18,
      marginBottom: 20,
      justifyContent: "center"
  },
  text2: {
    color: '#40e0d0',
    marginTop:5,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  btn: {
    marginHorizontal:80,
    alignItems:"center",
    justifyContent:"center",
    marginTop:25,
    backgroundColor:"#00ced1",
    paddingVertical:10,
    borderRadius:23,
    marginBottom: 50
},
});