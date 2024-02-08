import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, TouchableOpacity, NativeModules, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    CodeField,
    Cursor,
    MaskSymbol,
    isLastFilledCell,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
const { StatusBarManager } = NativeModules;

import { BASIC_AUTH } from "@env";

export default function Authentication({ navigation, route }) {

    const [serverURL, setServerURL] = useState(null);
    const [MPIN, setMPIN] = useState('');
    const WrongPinJerkAnimation = useRef(new Animated.Value(0)).current;
    const [isLoading, setLoading] = useState(false);
    const [isFingerPrintEnabled, setFingerPrintEnabled] = useState(false);
    const [defaultFingerprintEnabled, setDefaultFingerprintEnabled] = useState(false);
    const [newServerURL, setNewServerURL] = useState('');
    const [changeServerURL, setChangeServerURL] = useState(false);



    const AuthenticateMPIN = async () => {
        if (MPIN.length === 4) {
            setLoading(true);
            const response = await fetch(serverURL + '/Authenticate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${BASIC_AUTH}==`
                },
                body: JSON.stringify({
                    mpin: String(MPIN)
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                setLoading(false);
                setMPIN('');
                navigation.navigate('SplashScreen');
            }
            else {
                setLoading(false);
                Animated.timing(WrongPinJerkAnimation,
                    {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: false
                    }).start();

                setTimeout(() => {
                    Animated.timing(WrongPinJerkAnimation,
                        {
                            toValue: 0,
                            duration: 150,
                            useNativeDriver: false
                        }).start();
                }, 100);
                setMPIN('');
            }
        }
    }


    useEffect(() => {
        if (MPIN.length === 4)
            AuthenticateMPIN();
    }, [MPIN])


    const AuthenticateUser = async (isAuth) => {
        LocalAuthentication.hasHardwareAsync().then((hasHardware) => {
            if (hasHardware) {
                LocalAuthentication.supportedAuthenticationTypesAsync().then((supportedAuthenticationTypes) => {
                    if (supportedAuthenticationTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                        LocalAuthentication.authenticateAsync().then((result) => {
                            if (result.success) {
                                try {
                                    navigation.navigate(route.params.destinationPage, route.params.data);
                                } catch (error) {
                                    navigation.navigate('SplashScreen');
                                }
                            }
                        });
                    } else {
                        console.log('Fingerprint authentication not supported.');
                    }
                });
            } else {
                console.log('No hardware support for fingerprint authentication.');
            }
        });


    }

    const GetDataFromStorage = async (keyName) => {
        try {
            const value = await AsyncStorage.getItem(keyName)
            if (value !== undefined) {
                return value;
            }
            else {
                return null;
            }
        } catch (e) {
            console.log(e)
        }
    }

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        MPIN,
        setMPIN,
    });

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                GetDataFromStorage('FisAuth').then
                    ((data) => {
                        if (data !== undefined) {
                            let isAuth = data === 'checked' ? true : false;
                            setFingerPrintEnabled(isAuth);
                            setDefaultFingerprintEnabled(isAuth);
                        }
                    })
                GetDataFromStorage('server_url').then
                    ((data) => {
                        if (data !== undefined || data !== null || data !== 'null' || data !== '') {
                            setServerURL(data);
                        }
                        else {
                            Alert.alert('Warning', 'Server URL is not set. Please set using the given option at the bottom of the screen.');
                        }
                    })
            }, 100);

        }, [])
    );

    const renderCell = ({ index, symbol, isFocused }) => {
        let textChild = null;
        if (symbol) {
            textChild = (
                <MaskSymbol
                    delay={100}
                    maskSymbol="●"
                    isLastFilledCell={isLastFilledCell({ index, MPIN })}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <Animated.Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell, { transform: [{ translateX: WrongPinJerkAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }] }]}
                onLayout={getCellOnLayoutHandler(index)} >
                {textChild}
            </Animated.Text >
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />
            <Text style={{ margin: 20, fontSize: 30, alignSelf: 'flex-start', fontWeight: '200' }}>Authenticate</Text>


            <Text style={{ fontSize: 20, fontWeight: '200', marginTop: 20 }}>Enter MPIN</Text>


            {isLoading && <ActivityIndicator style={{ margin: 25 }} size="large" color="#0000ff" />}

            {
                !isLoading &&
                <CodeField
                    value={MPIN}
                    onChangeText={setMPIN}
                    cellCount={4}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    renderCell={renderCell}
                />

            }



            <Text style={{ color: 'blue', position: 'absolute', bottom: 0, margin: 20 }} onPress={() => { setChangeServerURL(true); setFingerPrintEnabled(false) }}>Change Server URL?</Text>

            <>
                {
                    isFingerPrintEnabled ?
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: '200', marginTop: 50, marginBottom: -10 }}>or</Text>
                            <Text style={{ fontSize: 20, fontWeight: '200', marginTop: 50, marginBottom: 15 }}>Use Biometrics</Text>
                            <TouchableOpacity style={{ borderWidth: 2, padding: 20, borderRadius: 25, borderColor: 'gray' }} onPress={() => AuthenticateUser(true)}>
                                <Image source={require('../assets/Fingerprint.png')} style={{ width: 70, height: 70, }} />
                            </TouchableOpacity>
                        </View>
                        :
                        <></>
                }
            </>

            {
                changeServerURL ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 250, margin: 15, padding: 5, fontSize: 15, borderRadius: 10 }}
                            onChangeText={text => setNewServerURL(text)}
                            value={newServerURL}
                            placeholder="https://api.endpoint.com/api"
                        />
                        <TouchableOpacity onPress={() => { AsyncStorage.setItem('server_url', newServerURL); alert("Please restart the application for new changes to work."); }} style={{ marginTop: 10, marginRight: 10 }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../assets/Save.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setChangeServerURL(false); setFingerPrintEnabled(defaultFingerprintEnabled) }} style={{ marginTop: 10 }}>
                            <Image style={{ width: 25, height: 25 }} source={require('../assets/Close.png')} />
                        </TouchableOpacity>
                    </View>
                    :
                    <></>
            }

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: StatusBarManager.HEIGHT,
        alignItems: 'center',
    },
    mpinTextInput: {
        height: 40,
        width: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 5,

    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 45,
        height: 45,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        textAlign: 'center',
        margin: 5,
        borderRadius: 5,
        textAlignVertical: 'center',
        fontWeight: '300'
    },
    focusCell: {
        borderColor: 'blue',
    },
});

