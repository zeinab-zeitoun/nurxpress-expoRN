import React, {useState, useEffect} from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, Picker, ImageBackground } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import Icon from '@expo/vector-icons/AntDesign';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';

const reviewSchema = yup.object({
    position: yup.string().required(),
    employmentType: yup.string().required(),
    company: yup.string().required(),
    startYear: yup.string().required('you should include your start year'),
    endYear: yup.string().nullable(true)
})

export default function Fill({navigation}) {

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

    // API to add nurseExperience
    const addNurseExperience = async (data) => {
        await api.addNurseExperience(data, token)
        .then( res => console.log(res.data))
        .catch (err => console.log(err))
    }

  return (
    <View style={styles.container}>
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>

        <Formik
            initialValues={{position: '', 
                            employmentType: '', 
                            company: '',
                            startYear: '',
                            endYear: ''
                             }}
            validationSchema={reviewSchema}
            onSubmit={(values) => {
                console.log(values);
                addNurseExperience(values)
                navigation.goBack();
            }}
        >
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

                <View style={styles.picker}>
                    <Picker selectedValue={props.values.endYear}
                        onValueChange={(value) => props.setFieldValue('endYear', value.toString())}
                    >
                        <Picker.Item label="End Year" value="" color="gray"/>
                        {yearOptions}
                    </Picker>
                </View>
               
                <TouchableOpacity onPress={props.handleSubmit}>
                    <View style={styles.btn}>
                        <Text style={{color:"white"}}>
                            Add Experience
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
