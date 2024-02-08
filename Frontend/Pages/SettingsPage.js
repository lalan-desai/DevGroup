import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Animated, Linking, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { ProgressBar } from 'react-native-paper';
import {
    CodeField,
    Cursor,
    MaskSymbol,
    isLastFilledCell,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import React from 'react';

import { BASIC_AUTH } from "@env";

const SettingsPage = ({ navigation }) => {

    //data states
    const [isAuth, setIsAuth] = useState('unchecked');
    const [deleteOption, setDeleteOption] = useState('unchecked');
    const [MPIN, setMPIN] = useState('');

    const [monthlyFee, setMonthlyFee] = useState('');
    const [yearlyFee, setYearlyFee] = useState('');
    const [renewFee, setRenewFee] = useState('');
    const [serverURL, setServerURL] = useState('');
    const [whatsAppMessage, setWhatsAppMessage] = useState('🙋🏻‍♂Hello.. %name%\n\n💐Welcome to Dev Group Dandiya Raas classes💐\n\n👉🏻Your code is - %bcode%\n\n💸Fees - %fee% received💃\n\nક્લાસિસ ના 📢 Message મેળવવા માટે આ નંબર save📲 કરવો જરૂરી છે.. નંબર save📲 હશે તો જ ક્લાસિસ ની માહિતી મળશે..  9909281181\n\n🔴 ખાસ સૂચના 🔴\n👉 આપના સ્કૂટર ની અંદર .. પર્સ 👜 મોબાઈલ📱 કે કોઈપણ પ્રકાર નો કિંમતી સમાન રાખવો નહિ... ❌❌\n\nગરબા 💃ના સ્ટેપ જોવા માટે અમારા   instagram page ને📲 follow કરો \nhttps://instagram.com/devgarbaclasses\n\n🙏 Thank you 🙏\nDipak patel\n💃🕺Dev Group Dandiya Raas Classes💃🕺');

    const [whatsappModal, setWhatsappModal] = useState(false);
    const [isMPINModalVisible, setIsMPINModalVisible] = useState(false);
    const [authPinLoading, setAuthPinLoading] = useState(false);

    const [feeLoading, setFeeLoading] = useState(false);



    const WrongPinJerkAnimation = useRef(new Animated.Value(0)).current;

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        MPIN,
        setMPIN,
    });

    const renderCell = ({ index, symbol, isFocused }) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
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




    const GetSettignsData = async () => {
        GetDataFromStorage('FisAuth').then
            ((data) => {
                if (data !== null)
                    setIsAuth(data);
                else {

                }
            })

        GetDataFromStorage('delete_option').then
            ((data) => {
                if (data !== null)
                    setDeleteOption(data);
            })

        GetDataFromStorage('monthly_fee').then
            ((data) => {
                if (data !== null)
                    setMonthlyFee(data);
                else {
                    StoreDataInStorage('monthly_fee', '200');
                    setMonthlyFee('200');
                }
            })
        GetDataFromStorage('yearly_fee').then
            ((data) => {
                if (data !== null)
                    setYearlyFee(data);
                else {
                    StoreDataInStorage('yearly_fee', '2000');
                    setYearlyFee('2000');
                }
            })

        GetDataFromStorage('renew_fee').then
            ((data) => {
                if (data !== null)
                    setRenewFee(data);
                else {
                    StoreDataInStorage('renew_fee', '500');
                    setRenewFee('500');
                }
            })

        GetDataFromStorage('server_url').then
            ((data) => {
                if (data !== null)
                    setServerURL(data);
                else {
                    StoreDataInStorage('server_url', 'https://devgroupdandiyaraas.in/');
                    setServerURL('https://devgroupdandiyaraas.in/');
                }
            })

        GetDataFromStorage('whatsapp_message').then
            ((data) => {
                if (data !== null)
                    setWhatsAppMessage(data);
                else {
                    StoreDataInStorage('whatsapp_message', '🙋🏻‍♂Hello.. %name%\n\n💐Welcome to Dev Group Dandiya Raas classes💐\n\n👉🏻Your code is - %bcode%\n\n💸Fees - %fee% received💃\n\nક્લાસિસ ના 📢 Message મેળવવા માટે આ નંબર save📲 કરવો જરૂરી છે.. નંબર save📲 હશે તો જ ક્લાસિસ ની માહિતી મળશે..  9909281181\n\n🔴 ખાસ સૂચના 🔴\n👉 આપના સ્કૂટર ની અંદર .. પર્સ 👜 મોબાઈલ📱 કે કોઈપણ પ્રકાર નો કિંમતી સમાન રાખવો નહિ... ❌❌\n\nગરબા 💃ના સ્ટેપ જોવા માટે અમારા   instagram page ને📲 follow કરો \nhttps://instagram.com/devgarbaclasses\n\n🙏 Thank you 🙏\nDipak patel\n💃🕺Dev Group Dandiya Raas Classes💃🕺');
                    setWhatsAppMessage('🙋🏻‍♂Hello.. %name%\n\n💐Welcome to Dev Group Dandiya Raas classes💐\n\n👉🏻Your code is - %bcode%\n\n💸Fees - %fee% received💃\n\nક્લાસિસ ના 📢 Message મેળવવા માટે આ નંબર save📲 કરવો જરૂરી છે.. નંબર save📲 હશે તો જ ક્લાસિસ ની માહિતી મળશે..  9909281181\n\n🔴 ખાસ સૂચના 🔴\n👉 આપના સ્કૂટર ની અંદર .. પર્સ 👜 મોબાઈલ📱 કે કોઈપણ પ્રકાર નો કિંમતી સમાન રાખવો નહિ... ❌❌\n\nગરબા 💃ના સ્ટેપ જોવા માટે અમારા   instagram page ને📲 follow કરો \nhttps://instagram.com/devgarbaclasses\n\n🙏 Thank you 🙏\nDipak patel\n💃🕺Dev Group Dandiya Raas Classes💃🕺');
                }
            })
    }

    const updateFeeData = async (yf, mf, rf) => {

        console.log(serverURL)

        if (yf === '' || mf === '' || rf === '' || yf === '0' && mf === '0' && rf === '0' || typeof yf !== 'number' || typeof mf !== 'number' || typeof rf !== 'number') {
            alert('Please fill all the fields with valid data.');
            return;
        }

        setFeeLoading(true);
        fetch(serverURL + '/UpdateFee.php', {
            headers: {
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            method: 'POST',
            body: JSON.stringify({
                'yf': yf,
                'mf': mf,
                'rf': rf
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                alert('Fees Updated Successfully.');
                setFeeLoading(false);
            })
            .catch((error) => {
                console.error("Error while updating fees: ", error);
                setFeeLoading(false);
            });
    }


    useEffect(() => {
        GetSettignsData();
    }, [])

    const UpdatePIN = async () => {
        if (MPIN.length !== 4) {
            setMPIN('');
            Animated.timing(WrongPinJerkAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(WrongPinJerkAnimation, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            });
            return;
        }
        else {

            setAuthPinLoading(true);
            fetch(serverURL + '/UpdateMPIN.php', {
                headers: {
                    'Authorization': `Basic ${BASIC_AUTH}==`
                },
                method: 'POST',
                body: JSON.stringify({
                    'newmpin': String(MPIN),
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.updated === true) {
                        alert('MPIN Updated Successfully.');
                        setIsMPINModalVisible(false);
                        setMPIN('');
                    }
                    else {
                        alert('Something went wrong');
                    }
                })

            setAuthPinLoading(false);
        }
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

    const StoreDataInStorage = async (keyName, value) => {
        try {
            await AsyncStorage.setItem
                (keyName, value)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />

            <ScrollView>

                <View style={styles.widgets}>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10 }}>General</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Fingerprint Authentication</Text>
                        <View style={styles.checkbox}>
                            <Checkbox
                                value={isAuth === 'checked' ? true : false}
                                onValueChange={() => {
                                    setIsAuth(isAuth === 'checked' ? 'unchecked' : 'checked');
                                    StoreDataInStorage('FisAuth', isAuth === 'checked' ? 'unchecked' : 'checked');
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Delete Option</Text>
                        <View style={styles.checkbox}>
                            <Checkbox
                                value={deleteOption === 'checked' ? true : false}
                                onValueChange={() => {
                                    setDeleteOption(deleteOption === 'checked' ? 'unchecked' : 'checked');
                                    StoreDataInStorage('delete_option', deleteOption === 'checked' ? 'unchecked' : 'checked');
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>WhatsApp Message:</Text>
                        <TouchableOpacity onPress={e => setWhatsappModal(true)}>
                            <View style={styles.textInput}>
                                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Edit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.widgets}>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10 }}>Fees</Text>

                    {
                        feeLoading ?
                            <ActivityIndicator size='large' color='#000' style={{ height: 200 }} />
                            :
                            <>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.label}>Monthly Fee:</Text>
                                    <TextInput style={styles.textInput} keyboardType='numeric' value={monthlyFee} onChangeText={e => { setMonthlyFee(e); StoreDataInStorage('monthly_fee', e) }}></TextInput>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.label}>Yearly Fee:</Text>
                                    <TextInput style={styles.textInput} keyboardType='numeric' value={yearlyFee} onChangeText={e => { setYearlyFee(e); StoreDataInStorage('yearly_fee', e) }}></TextInput>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.label}>Renwal Fee:</Text>
                                    <TextInput style={styles.textInput} keyboardType='numeric' value={renewFee} onChangeText={e => { setRenewFee(e); StoreDataInStorage('renew_fee', e) }}></TextInput>
                                </View>
                            </>
                    }
                    <TouchableOpacity style={{ margin: 20, alignSelf: 'center' }} onPress={() => updateFeeData(Number(yearlyFee), Number(monthlyFee), Number(renewFee))}>
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Save.png')} />
                    </TouchableOpacity>

                </View>


                <View style={styles.widgets}>


                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10 }}>Server</Text>

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.label}>Server URL:</Text>
                        <TextInput style={[styles.textInput, { marginTop: -10, width: '95%' }]} value={serverURL} onChangeText={e => { setServerURL(e); StoreDataInStorage('server_url', e) }}></TextInput>
                    </View>



                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.label}>MPIN:</Text>
                        <TouchableOpacity onPress={e => setIsMPINModalVisible(true)}>
                            <View style={styles.textInput}>
                                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Reset</Text>
                            </View>
                        </TouchableOpacity>
                    </View>



                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Download Backup:</Text>
                        <TouchableOpacity onPress={e => Linking.openURL(serverURL + '/Backup.php')}>
                            <View style={styles.textInput}>
                                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Download</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={whatsappModal}
                onRequestClose={() => {
                    setWhatsappModal(!whatsappModal);
                }}>
                <View style={styles.modalContainer}>
                    <Text style={{ margin: 15, marginBottom: -40, fontSize: 20 }}>WhatsApp Message:</Text>
                    <TextInput style={styles.whatsappEditText} multiline={true} value={whatsAppMessage} onChangeText={e => { setWhatsAppMessage(e); StoreDataInStorage('whatsapp_message', e) }}>
                    </TextInput>
                    <TouchableOpacity style={styles.closeIcon} onPress={() => setWhatsappModal(false)}>
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Cancel.png')} />
                    </TouchableOpacity>
                    <Text style={styles.descriptionLabel}>{'Use below tags to put the respective values. \nName: %name% \nNumber %number% \nFee: %fee% \nFrequancy: %freq% \nPaymentStatus: %ps% \nBatchCode: %bcode% \nDate: %date%    '}</Text>
                </View>
            </Modal>

            <Modal
                onMagicTap={() => setIsMPINModalVisible(false)}
                transparent={true}
                visible={isMPINModalVisible}
                animationType="fade"
                onRequestClose={() => setIsMPINModalVisible(false)}
            >
                <TouchableOpacity style={{ flex: 1, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} onPressOut={() => setIsMPINModalVisible(false)} activeOpacity={1}>
                    <TouchableWithoutFeedback style={styles.centeredView}>
                        <View style={styles.authView} >
                            <Text style={{ fontSize: 25, fontWeight: '500' }}>Reset MPIN</Text>
                            <Text style={{ fontSize: 15, fontWeight: '100' }}>Enter a new MPIN</Text>
                            <ProgressBar indeterminate={true} progress={0.2} visible={authPinLoading} style={{ width: 100, margin: 5 }} />
                            <CodeField
                                value={MPIN}
                                onChangeText={setMPIN}
                                cellCount={4}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                renderCell={renderCell}
                            />
                            <TouchableOpacity style={{ margin: 20, alignSelf: 'center' }} onPress={() => UpdatePIN()}>
                                <Image style={{ height: 30, width: 30 }} source={require('../assets/Save.png')} />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

        </View >
    )
}


export default SettingsPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    label: {
        fontSize: 18,
        color: 'black',
        height: 50,
        marginLeft: 20,
        marginTop: 15,
        fontWeight: '400',
    },
    checkbox: {
        alignContent: 'center',
        justifyContent: 'center',
        marginRight: 30,
    },
    textInput: {
        fontSize: 18,
        color: 'black',
        height: 'auto',
        width: 100,
        borderRadius: 5,
        margin: 10,
        backgroundColor: '#EEEEEE',
        padding: 10,
        textAlign: 'center',
    },
    modalContainer: {
        backgroundColor: '#E1D7C6',
        flex: 1,
        margin: 5,
        borderRadius: 20,
        flexDirection: 'column',
    },
    whatsappEditText: {
        backgroundColor: 'white',
        flex: 0.8,
        margin: 10,
        fontSize: 13,
        padding: 10,
        textAlignVertical: 'top',
        borderRadius: 5,
        flexWrap: 'wrap',
        marginTop: 50
    },
    descriptionLabel: {
        fontSize: 15,
        color: 'black',
        margin: 10,
        backgroundColor: '#EAE0DA',
        flex: 0.2,
        padding: 10,
        borderRadius: 5,

    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
    },
    authView: {
        height: 250,
        width: 300,
        margin: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#323232",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },


    root: { flex: 1, padding: 20 },

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
        fontWeight: '300',

    },
    focusCell: {
        borderColor: 'blue',
    },

    widgets: {
        flexDirection: 'column',
        margin: 10,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,

    }
});