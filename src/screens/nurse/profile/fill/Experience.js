import React, {useState, useEffect} from 'react';
import { TextInput, View, Text, TouchableOpacity, ImageBackground, Picker, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/forms';
import Icon from '@expo/vector-icons/AntDesign';
import api from '../../../../services/api/nurse';
import cookie from 'cross-cookie';
import { ScrollView } from 'react-native-gesture-handler';

//schema used for validtaio of the user input
const reviewSchema = yup.object({
    position: yup.string().required(),
    employmentType: yup.string().required(),
    company: yup.string().required(),
    startYear: yup.string().required('You should include your start Year'),
    endYear: yup.string().nullable(true)
})

export default function Fill(props) {

    const [token, setToken] = useState('');

    //get current year
    var currentYear = new Date().getFullYear();
    
    //if the user wants to add another experience, add will be set to true.
    //if set is true => naviagte to add experience page
    const [add, setAdd] = useState(false)

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
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : null}
    style={styles.container}
    >
    <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
            <ScrollView keyboardShouldPersistTaps='handled'>

        <TouchableOpacity onPress={() => props.navigation.navigate("NurseTabNavigation")} style={{ alignSelf:"flex-end"}}>
                    <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>

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
                // API: Add to DB

                //if add is set to true, navigate to AnotherExperience page
                if (add){
                    // setting it to false again so that 
                    //when the user adds an experience and
                    //navuagte back to this page
                    //it'll be false again
                    setAdd(false)
                    props.navigation.navigate("AnotherExperience")
                } 
                //if add is false, navigate to Experience
                else 
                {
                    // ad experience to DB
                    console.log(values)
                    addNurseExperience(values)
                    props.navigation.navigate("NurseTabNavigation")
                }
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

                <View style={[styles.picker,{marginBottom:30}]}>
                    <Picker selectedValue={props.values.endYear}
                        onValueChange={(value) => props.setFieldValue('endYear', value.toString())}
                    >
                        <Picker.Item label="End Year" value="" color="gray"/>
                        {yearOptions}
                    </Picker>
                </View>

                {/* customized button to add another experience, when pressed, set add to true and calls the handlesubmit function
                which's available by the formik props */}
                <TouchableOpacity style={styles.row} onPress={() => {
                    setAdd(true)
                    props.handleSubmit()
                }}>
                    <Icon name="pluscircleo" size={30} style={{color:"#dc143c", alignSelf:"center"}}/>
                    <Text> add another experience</Text>
                </TouchableOpacity>
                
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
    </KeyboardAvoidingView>
  );
}
