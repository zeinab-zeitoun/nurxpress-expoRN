import React, { useEffect } from 'react';
import { BackHandler , TextInput, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import { ScrollView } from 'react-native-gesture-handler';


//verification of data
const reviewSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    contact: yup.string().required().min(8)
})

export default function Fill({navigation}) {

  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>

        <Text style={styles.titleText}>Complete your profile to get started!</Text>
      
        <Formik
            //initialize the values of the requested data as empty string
            initialValues={{firstName:'', 
                            lastName:'', 
                            contact: '', 
                             }}
                 
            validationSchema={reviewSchema}

            // will be executed if the the form data is validated, otherwise, the error messages will be shown
            onSubmit={(values) => {
            console.log(values);
            navigation.navigate('NurseCurrentLocation', values)
            
            }}
        >
            {/* javascript: function that takes as a parameter props
             which are passed to the formik component */}
            {props => (
                
            <View>
                {/* text input for the first name, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='First Name'
                onChangeText={props.handleChange('firstName')}
                value={props.values.firstName}
                onBlur={props.handleBlur('firstName')}
                />
                <Text style={styles.errorText}>{props.touched.firstName && props.errors.firstName}</Text>

                 {/* text input for the last name, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Last Name'
                onChangeText={props.handleChange('lastName')}
                value={props.values.lastName}
                onBlur={props.handleBlur('lastName')}
                />
                <Text style={styles.errorText}>{props.touched.lastName && props.errors.lastName}</Text>

                {/* text input for the contact number, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Contact Number'
                onChangeText={props.handleChange('contact')}
                value={props.values.contact}
                onBlur={props.handleBlur('contact')}
                keyboardType='numeric'
                />
                <Text style={styles.errorText}>{props.touched.contact && props.errors.contact}</Text>
                
                {/* cotsumized button, when pressed => calls handlesubmit, a props element, which checks for data validation
                and then calss the onsubmit function*/}
                <TouchableOpacity onPress={props.handleSubmit}>
                    <View style={styles.btn}>
                        <Text style={{color:"white"}}>
                            Next
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
            
            )}
        </Formik>

        </ScrollView> 
    </ImageBackground>
    </View>
    
  );
}
