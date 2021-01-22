import React, {useState, useEffect} from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import {Formik } from 'formik';
import * as yup from 'yup';
import api from '../../../../services/api/nurse';
import styles from '../styles/forms';
import cookie from 'cross-cookie';

const reviewSchema = yup.object({
    pricePer8Hour: yup.string().required(),
    pricePer12Hour: yup.string().required(),
    pricePer24Hour: yup.string().required(),
})

export default function Price(props) {
 
    // get the token
    const [token, setToken] = useState('');
    useEffect( () => {
        cookie.get('token')
        .then(value => setToken(value));
    }, [])
    
    // api: Add Nurse info
    const addNurse =  async (data) => {
        console.log(token)
        await api.addNurse(data, token)
        .then( res => console.log(res.data))
        .catch( err => console.log(err))
    }

    //Views
    return (

        <View style={styles.container}>
        <ImageBackground source={require('../../../../images/background2.png')} style={styles.backImage}>
                <ScrollView keyboardShouldPersistTaps='handled'>

        {/* user formik with yup to validate the form data */}
        <Formik
            //initialize the values of the formik data
            initialValues={{pricePer8Hour: '',
                            pricePer12Hour: '',
                            pricePer24Hour: '',
                        }}

            //validate input data
            validationSchema={reviewSchema}

            // will be executed if the the form data is validated, otherwise, the error messages will be shown
            onSubmit={(values) => {
                // get previous data
                const previousData = props.route.params
                // merge the previous info with the new data            
                addNurse({...previousData,...values});

                props.navigation.navigate("Education")
                }
            }>

            {/* javascript: function that takes as a parameter props
             which are passed to the formik component */}
            {props => (
                
            <View>

                {/* text input for the Price per 8 hours, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Price per 8 hours in $'
                onChangeText={props.handleChange('pricePer8Hour')}
                value={props.values.pricePer8Hour}
                onBlur={props.handleBlur('pricePer8Hour')}
                />
                <Text style={styles.errorText}>{props.touched.pricePer8Hour && props.errors.pricePer8Hour}</Text>

                {/* text input for the Price per 12 hours, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Price per 12 hours in $'
                onChangeText={props.handleChange('pricePer12Hour')}
                value={props.values.pricePer12Hour}
                onBlur={props.handleBlur('pricePer12Hour')}
                />
                <Text style={styles.errorText}>{props.touched.pricePer12Hour && props.errors.pricePer12Hour}</Text>

                {/* text input for the Price per 24 hours, it:
                save its value each time it changes
                send error message directly after leaving the input text, if any, using onBlur */}
                <TextInput
                style={styles.input}
                placeholder='Price per 24 hours in $'
                onChangeText={props.handleChange('pricePer24Hour')}
                value={props.values.pricePer24Hour}
                onBlur={props.handleBlur('pricePer24Hour')}
                />
                <Text style={styles.errorText}>{props.touched.pricePer24Hour && props.errors.pricePer24Hour}</Text>

                                {/* cotsumized button, when pressed => calls handlesubmit, a props element, which checks for data validation
                and then calss the onsubmit function*/}
                <TouchableOpacity onPress={props.handleSubmit}>
                    <View style={styles.btn}>
                        <Text style={{color:"white"}}>
                            Done
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

