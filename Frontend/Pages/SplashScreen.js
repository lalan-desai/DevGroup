import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

import GetServerURL from '../Controller/Server';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASIC_AUTH } from "@env";


export default function App({ navigation }) {

    const zoomAnimation = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        GetServerURL().then((data) => {
            fetch(data + '/Fees.php',
                {
                    headers: {
                        'Authorization': `Basic ${BASIC_AUTH}==`
                    }
                }
            )
                .then((response) => response.json())
                .then((responseJson) => {
                    AsyncStorage.setItem('yearly_fee', responseJson.Yearly_fee);
                    AsyncStorage.setItem('monthly_fee', responseJson.Monthly_fee);
                    AsyncStorage.setItem('renew_fee', responseJson.Renew_fee);
                })
                .catch((error) => {
                    alert("Error while fetching config fee data. Error: " + error);
                });
        });
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            Animated.timing(zoomAnimation,
                {
                    toValue: 450,
                    duration: 1000,
                    useNativeDriver: false
                }).start();
            setTimeout(() => {
                navigation.navigate('Dashboard');
            }, 1000);

        }, [])
    );

    return (
        <View style={styles.container}>
            <Animated.Image style={[styles.imageLogo, { height: zoomAnimation }]} source={require('../assets/logo.png')} alt="logo" />
            <StatusBar style="dark" translucent={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageLogo: {
        width: 300,
    }
});
