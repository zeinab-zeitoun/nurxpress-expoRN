import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, Picker, ImageBackground } from 'react-native';
import {Formik } from 'formik';
import * as yup from 'yup';
import Icon from '@expo/vector-icons/AntDesign';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';


// validating data
const reviewSchema = yup.object({
    school: yup.string().required(),
    degree: yup.string().required(),
    graduationYear: yup.string().required('graduation year is required')
})

export default function Education(props) {

    const [token, setToken] = useState('');

    //if the user wants to add another education, add will be set to true.
    //if set is true => naviagte to add education page
    const [add, setAdd] = useState(false)

    //get current year
    var currentYear = new Date().getFullYear();

    //years will be set to an array of all the years
    // since 70 years till the current year that app is being used
    const [years, setYears] = useState([]);
    
    //temporary array to store all the years
    // since 70 years till the current year the app is being used
    const array = [];
    
    useEffect( () => {
        //get all the years since 70 years till the current year that app is being used
        for(let i = currentYear ; i >= currentYear-70; i--)
            array.push(i)
        setYears(array)
        // get the token
        cookie.get('token')
        .then(value => setToken(value));
    }, [])

    // map the years to Picker.Item 
    // will be called in the views for the year input
    const yearOptions = years.map((year) => (
        <Picker.Item key={year} label={year+""} value={year.toString()} />
    ))

    // API to add nurseEducation
    const addNurseEducation = async (data) => {
        await api.addNurseEducation(data, token)
        .catch (err => console.log(err))
    }

    //Views
    return (

    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
        <ScrollView keyboardShouldPersistTaps='handled'>
 
        <TouchableOpacity onPress={() => props.navigation.navigate("Experience")} style={{ alignSelf:"flex-end"}}>
                    <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>

        {/* user formik with yup to validate the form data */}
        <Formik
            //initialize the values of the formik data
            initialValues={{school: '',
                            degree: '', 
                            graduationYear: '',
                        }}

            //validate input data
            validationSchema={reviewSchema}

            // will be executed if the the form data is validated, otherwise, the error messages will be shown
            onSubmit={(values) => {
              
                //if add is set to true, navigate to AnotherExperience page
                if (add){
                    // setting it to false again so that 
                    //when the user adds an experience and
                    //navuagte back to this page
                    //it'll be false again
                    setAdd(false)
                    props.navigation.navigate("AnotherEducation")
                } 
                //if add is false, navigate to Experience
                else 
                {
                    //add education to DB
                    addNurseEducation(values)
                    props.navigation.navigate("Experience")
                }}
            }>

            {/* javascript: function that takes as a parameter props
             which are passed to the formik component */}
            {props => (
                
            <View>
                

                {/* text input for the school name, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='School'
                onChangeText={props.handleChange('school')}
                value={props.values.school}
                onBlur={props.handleBlur('school')}
                />
                <Text style={styles.errorText}>{props.touched.school && props.errors.school}</Text>

                {/* text input for the Degree, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Degree'
                onChangeText={props.handleChange('degree')}
                value={props.values.degree}
                onBlur={props.handleBlur('degree')}
                />
                <Text style={styles.errorText}>{props.touched.degree && props.errors.degree}</Text>

                {/* Graduation Years: options from 70 years till teh current year of using the app
                with additional 2 options:
                graduation Year which will be shown as a title for the picker and holds value of empty string
                and Did not graduate option that also holds value of empty string*/}
                <View style={styles.picker}>
                    <Picker selectedValue={props.values.graduationYear}
                        onValueChange={(value) => props.setFieldValue('graduationYear', value.toString())}
                    >
                        <Picker.Item label="Graduation Year" value="" color="gray"/>
                        {yearOptions}
                    </Picker>
                </View>
                <Text style={styles.errorText}>{props.touched.graduationYear && props.errors.graduationYear}</Text>
                {/* customized button to add another education, when pressed, set add to true and calls the handlesubmit function
                which's available by the formik props */}
                <TouchableOpacity style={styles.row} onPress={() => {
                    setAdd(true)
                    props.handleSubmit()
                }}>
                    <Icon name="pluscircleo" size={30} style={{color:"#dc143c", alignSelf:"center"}}/>
                    <Text> Add another education</Text>
                </TouchableOpacity>


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

