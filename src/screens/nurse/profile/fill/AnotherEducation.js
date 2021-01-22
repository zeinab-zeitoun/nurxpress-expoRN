import React, {useState, useEffect} from 'react';
import { Picker, TextInput, View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

const reviewSchema = yup.object({
    school: yup.string().required(),
    degree: yup.string().required(),
    graduationYear: yup.string().required('graduation year is required')
})

export default function AnotherEducation({navigation}) {

    const [token, setToken] = useState('');
    
    //get current year
    var currentYear = new Date().getFullYear();

    //years will be set to an array of all the years
    // since 70 years till the current year that app is being used
    const [years, setYears] = useState([]);
    
    //temporary array to store all the years
    // since 70 years till the current year that app is being used
    const array = [];
    
    //get all the years since 70 years till the current year that app is being used
    useEffect( () => {
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
  return (
    
    <View style={styles.container}>
        <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>
            
        <Formik
            initialValues={{school: '',
                            degree: '', 
                            graduationYear: ''
                             }}
            validationSchema={reviewSchema}

            onSubmit={(values) => {
                addNurseEducation(values)
                navigation.goBack();
            }}
        >
            {props => (
                
            <View>

                <TextInput
                style={styles.input}
                placeholder='School'
                onChangeText={props.handleChange('school')}
                value={props.values.school}
                onBlur={props.handleBlur('school')}
                />
                <Text style={styles.errorText}>{props.touched.school && props.errors.school}</Text>
                <TextInput
                style={styles.input}
                placeholder='Degree'
                onChangeText={props.handleChange('degree')}
                value={props.values.degree}
                onBlur={props.handleBlur('degree')}
                />
                <Text style={styles.errorText}>{props.touched.degree && props.errors.degree}</Text>

                {/* Graduation year: options from 70 years till teh current year of using the app
                with additional 2 options:
                graduation year which will be shown as a title for the picker and holds value of empty string
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

                <TouchableOpacity onPress={props.handleSubmit}>
                    <View style={styles.btn}>
                        <Text style={{color:"white"}}>
                            Add
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


