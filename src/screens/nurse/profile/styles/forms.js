import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({

    container: {
        backgroundColor: "white",
        height: "100%",
    },
    backImage: {
        flex: 1,
        resizeMode: 'cover',
        padding: 20,
    },
    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        backgroundColor: "white",
        width: "100%",
    },

    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 18,
        borderRadius: 6,
       backgroundColor: "white",
    },

    errorText: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 0,
        textAlign: 'center'
    },
    btn: {
        marginHorizontal:40,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        backgroundColor:"#00ced1",
        paddingVertical:10,
        borderRadius:23,
        marginBottom: 50
    },
    row:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingBottom: 20
    },

    text: {
		marginTop: 20,
		fontSize: 17,
		textAlign: "center"
    },
    skipBtn:{
        borderWidth:1, 
        borderColor:"#dddddd", 
        borderRadius:25, 
        fontSize:16, 
        color:"black", 
        padding:2, 
        width:50, 
        textAlign:"center", 
        backgroundColor:"#dddddd", 
        margin:10}

});