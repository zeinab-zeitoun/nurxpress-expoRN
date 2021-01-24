import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground, 
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import api from '../../services/api/details';

import DeleteDetail from './DeleteDetail';

export default function Details(props) {

    const [details, setDetails] = useState([]);
    const [detail, setDetail] = useState(null)
    const [render, setRender] = useState(false)

    const addDetail = async () => {
        await api.addDetail({detail}, props.token)
        .then( (res) => setRender(!render))
        .catch( err => console.log(err))
        setDetail("")
    }

    // get all details
    const getDetails = async () => {
        await api.getDetails(props.token)
        .then( (res) => setDetails(res.data))
        .catch( err => console.log(err))
    }

    useEffect ( () => {
        getDetails()
    }, [render])
    
    return(
        <View>
            <View style={styles.input}>
                <TextInput 
                    placeholder="share more details about your shifts"
                    multiline
                    value={detail}
                    onChangeText={setDetail}
                    style={{width:"90%"}}
                />
                <TouchableOpacity onPress={addDetail}>
                    <Icon name="caretright" size={30} color="#00ced1" />
                </TouchableOpacity>
            </View>
            
            {   details && details.length !== 0 && 
                details.map((detail, i) => (
                    <View key={i} style={styles.detailCtr}>
                        {/* { (i+1)%2==0? 
                            <Icon name="star" size={30} color="#00ced1" />:
                            <Icon name="star" size={30} color="orange" />
                        } */}
                        <DeleteDetail token={props.token} id={detail.id} render={render} setRender={setRender}/>
                        <Text style={styles.detail}>{detail.detail}</Text>
                        
                    </View>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
        height: "100%",
        backgroundColor: '#dddddd',
        // marginTop: Platform.OS === 'android' ? 25 : 0
    },
    input:{
        alignItems:"center",
        borderWidth:2,
        padding:10,
        height: 50,
        borderColor:"#00ced1",
        borderRadius:23,
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    row:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        justifyContent: "space-between"
    },
    detailCtr: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        margin: 10,
    },
    detail: {
        fontSize: 15,
        marginLeft: 5,
        paddingRight: 10
    }

})