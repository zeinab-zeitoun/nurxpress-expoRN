import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, Picker, ActivityIndicator, ImageBackground } from 'react-native';
import {Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';


// validating data
const reviewSchema = yup.object({
    position: yup.string().required(),
    employmentType: yup.string().required(),
    company: yup.string().required(),
    startYear: yup.string().required('You should include your start Year'),
    endYear: yup.string().nullable(true)
})

export default function EditExperience(props) {

    const [token, setToken] = useState('');

    // get id of the experience
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
    const [nurseExperience, setNurseExperience]=useState(null)

    const showNurseExperience = async () => {
        await api.showNurseExperience(id, token)
        .then(res => {

            setNurseExperience(res.data)
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
        // get id of the experience
        setId(props.route.params.id)
        //get all the years since 70 years till the current year that app is being used
        for(let i = currentYear ; i >= currentYear-70; i--)
            array.push(i)
        setYears(array)
        // get the token
        getToken()
        //fetch nurse experience
        if (token)
            showNurseExperience()
        
    }, [token])

    // map the years to Picker.Item 
    // will be called in the views for the year input
    const yearOptions = years.map((year) => (
        <Picker.Item key={year} label={year+""} value={year.toString()} />
    ))

    // API to add edit nurseExperience
    const editNurseExperience = async (id, data) => {
        await api.editNurseExperience(id, data, token)
        .then( res => console.log(res.data))
        .catch (err => console.log(err))
    }

    //render Views
    const renderEditViews = () => {
        if (!nurseExperience)
            return <View style={{marginTop:100}}
            >
                <ActivityIndicator size="large" color="#00ced1" />
            </View>
        else
            return(
            <View keyboardShouldPersistTaps={'handled'}>
                {/* user formik with yup to validate the form data */}
                <Formik
                    //initialize the values of the formik data
                    initialValues={{position: nurseExperience.position,
                                    employmentType: nurseExperience.employmentType, 
                                    company: nurseExperience.company,
                                    startYear: nurseExperience.startYear,
                                    endYear: nurseExperience.endYear
                                }}

                    //validate input data
                    validationSchema={reviewSchema}

                    // will be executed if the the form data is validated, otherwise, the error messages will be shown
                    onSubmit={(values) => {
                            console.log(values)
                            editNurseExperience(id, values, token)
                            props.navigation.navigate("ShowExperience")
                        }
                    }>

                    {/* javascript: function that takes as a parameter props
                    which are passed to the formik component */}
                    {props => (
                        
                        <View>

                        <TextInput
                        style={styles.input}
                        placeholder='Position'
                        onChangeText={props.handleChange('position')}
                        value={props.values.position}
                        onBlur={props.handleBlur('position')}
                        />
                        <Text style={styles.errorText}>{props.touched.position && props.errors.position}</Text>

                        <TextInput
                        style={styles.input}
                        placeholder='Employment Type'
                        onChangeText={props.handleChange('employmentType')}
                        value={props.values.employmentType}
                        onBlur={props.handleBlur('employmentType')}
                        />
                        <Text style={styles.errorText}>{props.touched.employmentType && props.errors.employmentType}</Text>

                        <TextInput
                        style={styles.input}
                        placeholder='Company'
                        onChangeText={props.handleChange('company')}
                        value={props.values.company}
                        onBlur={props.handleBlur('company')}
                        />
                        <Text style={styles.errorText}>{props.touched.company && props.errors.company}</Text>

                        <View style={styles.picker}>
                            <Picker selectedValue={props.values.startYear}
                                onValueChange={(value) => props.setFieldValue('startYear', value.toString())}
                            >
                                <Picker.Item label="Start Year" value="" color="gray"/>
                                {yearOptions}
                            </Picker>
                        </View>
                        <Text style={styles.errorText}>{props.touched.startYear && props.errors.startYear}</Text>

                        <View style={[styles.picker,{marginBottom:30}]}>
                            <Picker selectedValue={props.values.endYear}
                                onValueChange={(value) => props.setFieldValue('endYear', value.toString())}
                            >
                                <Picker.Item label="End Year" value="" color="gray"/>
                                {yearOptions}
                            </Picker>
                        </View>

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

