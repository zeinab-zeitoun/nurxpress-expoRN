import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, Picker, ActivityIndicator, ImageBackground } from 'react-native';
import {Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';


// validating data
const reviewSchema = yup.object({
    school: yup.string().required(),
    degree: yup.string().required(),
    graduationYear: yup.string().required('graduation year is required')
})

export default function EditEducation(props) {

    const [token, setToken] = useState('');

    // get id of the education
    const [id, setId] = useState('');


    //get current year
    var currentYear = new Date().getFullYear();

    //years will be set to an array of all the years
    // since 70 years till the current year that app is being used
    const [years, setYears] = useState([]);
    
    //temporary array to store all the years
    // since 70 years till the current year the app is being used
    const array = [];
    
    // fetch nurse info
    const [nurseEducation, setNurseEducation]=useState(null)

    const showNurseEducation = async () => {
        await api.showNurseEducation(id, token)
        .then(res => {
            console.log(res.data)
            setNurseEducation(res.data)
        })
        .catch( err => console.log(err))
    }

    // get the token
    
    const getToken = async () => {
        await cookie.get('token')
        .then(value => setToken(value));
        console.log(token)
    }

    
    useEffect( () => {
        // get id of the education
        setId(props.route.params.id)
        //get all the years since 70 years till the current year that app is being used
        for(let i = currentYear ; i >= currentYear-70; i--)
            array.push(i)
        setYears(array)
        // get the token
        getToken()
        //fetch nurse education
        if (token)
            showNurseEducation()
    }, [token])

    // map the years to Picker.Item 
    // will be called in the views for the year input
    const yearOptions = years.map((year) => (
        <Picker.Item key={year} label={year+""} value={year.toString()} />
    ))

    // API to add edit nurseEducation
    const editNurseEducation = async (id, data) => {
        await api.editNurseEducation(id, data, token)
        .then( res => console.log(res.data))
        .catch (err => console.log(err))
    }

    //render Views
    const renderEditViews = () => {
        if (!nurseEducation)
            return <View style={{marginTop:100}}
            >
            <ActivityIndicator size="large" color="#00ced1" />
            </View>
        else
            return(
            <View>
                {/* user formik with yup to validate the form data */}
                <Formik
                    //initialize the values of the formik data
                    initialValues={{school: nurseEducation.school,
                                    degree: nurseEducation.degree, 
                                    graduationYear: nurseEducation.graduationYear,
                                }}

                    //validate input data
                    validationSchema={reviewSchema}

                    // will be executed if the the form data is validated, otherwise, the error messages will be shown
                    onSubmit={(values) => {
                            console.log(values)
                            editNurseEducation(id, values, token)
                            props.navigation.navigate("ShowEducation")
                        }
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

                        {/* cotsumized button, when pressed => calls handlesubmit, a props element, which checks for data validation
                        and then calss the onsubmit function*/}
                        <TouchableOpacity onPress={props.handleSubmit}>
                            <View style={styles.btn}>
                                <Text style={{color:"white"}}>
                                    Submit Changes
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                    
                    )}
                </Formik>
            </View>
            )
    }


    return (
        <View style={styles.container}>
        <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                {renderEditViews()} 
                </ScrollView> 
        </ImageBackground>
        </View>
    
  );
}

