import {View, Text} from 'react-native';
import React from 'react';
var currentYear = new Date().getFullYear();

export default function YearOptions() {

    var years = []
    for(let i = currentYear-70 ; i < currentYear; i++){
        years.push(i)
    }
    return years

}
