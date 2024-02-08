import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, NativeModules, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, FlatList, BackHandler, TextInput } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
const { StatusBarManager } = NativeModules;
import { LogBox } from 'react-native';
import GetServerURL from '../Controller/Server';
import { useFocusEffect } from '@react-navigation/native';
import {
    CodeField,
    Cursor,
    MaskSymbol,
    isLastFilledCell,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Dropdown } from 'react-native-element-dropdown';
import { ProgressBar } from 'react-native-paper';
import { Linking } from 'react-native';

import User from '../Cards/User';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASIC_AUTH } from "@env";


LogBox.ignoreAllLogs();


export default function DashboardScreen({ route, navigation }) {

    const batchData = [
        { "Label": "ALL", "Value": "ALL" },
        { "Label": "A", "Value": "A" },
        { "Label": "B", "Value": "B" },
        { "Label": "C", "Value": "C" },
        { "Label": "D", "Value": "D" },
        { "Label": "E", "Value": "E" },
        { "Label": "F", "Value": "F" },
        { "Label": "G", "Value": "G" },
        { "Label": "H", "Value": "H" },
        { "Label": "I", "Value": "I" },
        { "Label": "J", "Value": "J" },
        { "Label": "K", "Value": "K" },
        { "Label": "L", "Value": "L" },
        { "Label": "M", "Value": "M" },
        { "Label": "N", "Value": "N" },
        { "Label": "O", "Value": "O" },
        { "Label": "P", "Value": "P" },
        { "Label": "Q", "Value": "Q" },
        { "Label": "R", "Value": "R" },
        { "Label": "S", "Value": "S" },
        { "Label": "T", "Value": "T" },
        { "Label": "U", "Value": "U" },
        { "Label": "V", "Value": "V" },
        { "Label": "W", "Value": "W" },
        { "Label": "X", "Value": "X" },
        { "Label": "Y", "Value": "Y" },
        { "Label": "Z", "Value": "Z" },
    ];

    //ui states
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('M');
    const [isLoading, setIsLoading] = useState(false);
    const [pageToOpen, setPageToOpen] = useState('');
    const [dataToPass, setDataToPass] = useState([]);
    const [authPinLoading, setAuthPinLoading] = useState(false);

    //animation refs
    const WrongPinJerkAnimation = useRef(new Animated.Value(0)).current;

    //data states
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [userData, setUserData] = useState([]);
    const [YearDropdownList, setYearDropdownList] = useState([]);
    const [serverURL, setServerURL] = useState(null);
    const [MPIN, setMPIN] = useState('');


    const [newServerURLClicked, setNewServerURLClicked] = useState(false);

    const [newServerURL, setNewServerURL] = useState('');

    const yearWork = (year) => {
        let selectedYear = Number(year);

        let startDate = new Date(selectedYear + '-11-01');
        let endDate = new Date((selectedYear + 1) + '-10-31');

        let currentDate = new Date();
        //add 2 months to current date
        currentDate.setMonth(currentDate.getMonth() + 2);

        if (startDate <= currentDate && endDate >= currentDate) {
            startDate.setDate(startDate.getDate() - 1);
            return startDate;
        }

        if (selectedYear > currentDate.getFullYear()) {
            let nextYear = Number(selectedYear) - 1;
            // setRegistrationDate(new Date(String(nextYear) + '-11-01'));
            return new Date(String(nextYear) + '-11-01');
        }

        if (selectedYear < currentDate.getFullYear()) {
            // setRegistrationDate(new Date(selectedYear - 1 + '-11-01'));
            return new Date(selectedYear - 1 + '-11-01');
        }
        else {
            // setRegistrationDate(new Date());
            return new Date();
        }

    }






    const GetDataFromStorage = async (keyName) => {
        try {
            const value = await AsyncStorage.getItem(keyName)
            if (value !== null) {
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

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        MPIN,
        setMPIN,
    });

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

    const GetYears = async (url) => {
        setIsLoading(true);
        await fetch(url + '/Year.php', {
            headers: {
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
        }).then(response => response.json()).then(data => {
            setIsLoading(false);
            let years = [];
            data.forEach(element => {
                years.push({ label: element.Year, value: element.Year });
            });
            setYearDropdownList(years);
        }).catch((error) => {
            setIsLoading(false);
            alert(error);
        });
    }


    useEffect(() => {
        GetInitialData();
    }, []);

    const GetInitialData = async () => {
        await GetServerURL().then((data) => {
            setServerURL(data);
            GetYears(data);
        });


        await GetDataFromStorage('lastyear').then((data) => {
            if (data !== null)
                setSelectedYear(String(data));
            else {
                StoreDataInStorage('lastyear', String(new Date().getFullYear())).then(() => {
                    GetDataFromStorage('lastyear').then((data) => {
                        setSelectedYear(String(data));
                    }
                    );
                });

            }
        });
        await GetDataFromStorage('lastbatch').then((data) => {
            if (data !== null)
                setSelectedBatch(String(data));
            else {
                StoreDataInStorage('lastbatch', String('A')).then(() => {
                    GetDataFromStorage('lastbatch').then((data) => {
                        setSelectedBatch(String(data));
                    }
                    );
                });
            }
        });
    }

    useFocusEffect(
        React.useCallback(() => {

            const backAction = () => {
                if (route.name === 'Dashboard') {
                    navigation.navigate('Authentication');
                    BackHandler.exitApp();
                    return true;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction);
            };
        }, [])
    );

    useEffect(() => {
        if (MPIN.length === 4) {
            AuthenticateMPIN();
        }
    }, [MPIN])

    useEffect(() => {
        getUsersData(selectedYear, selectedTab, selectedBatch);
    }, [selectedYear, selectedTab, selectedBatch]);


    const updateData = async (year, gender, batchcode, shouldRoute = true) => {

        if (!shouldRoute) {
            GetYears(serverURL).then(() => {
                getUsersData(selectedYear, selectedTab, selectedBatch);
            });
        }
        else {
            StoreDataInStorage('lastyear', String(year));
            StoreDataInStorage('lastbatch', batchcode);
            GetYears(serverURL).then(() => {
                setSelectedYear(String(year));
                setSelectedTab(gender);
                setSelectedBatch(batchcode);
            });
            getUsersData(year, gender, batchcode);
        }
    }


    const getUsersData = async (year, gender, batch) => {
        if (year !== undefined && gender !== undefined && batch !== undefined && year !== '' && batch !== '') {
            setUserData([]);
            setIsLoading(true);
            fetch(await GetServerURL() + '/Users.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${BASIC_AUTH}==`
                },
                body: JSON.stringify({
                    'gender': gender,
                    'year': year,
                    'batchcode': batch === 'ALL' ? '' : batch
                })

            }).then(response => response.json()).then(data => {
                setUserData(data);
                setIsLoading(false);
            }).catch((error) => { console.log(error); })
        }
    }


    const AuthenticateMPIN = async () => {
        setAuthPinLoading(true);
        if (MPIN.length === 4) {
            const response = await fetch(serverURL + '/Authenticate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${BASIC_AUTH}==`
                },
                body: JSON.stringify({
                    mpin: String(MPIN)
                })
            }).then((data) => data.json()).then((data) => {
                setAuthPinLoading(false);
                if (data.status === 200) {
                    setMPIN('');
                    setIsAuthModalVisible(false);
                    navigation.navigate(pageToOpen, dataToPass);
                }
                else {

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
            });
        }

    }


    const renderItem = useCallback(({ item, index }) => (
        <>
            <User serverURL={serverURL} data={item} navigation={navigation} updateData={updateData} imageURL={item.ImageURI} />
        </>
    ));


    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />
            <Modal
                statusBarTranslucent={true}
                transparent={true}
                visible={isMenuModalVisible}
                onRequestClose={() => setIsMenuModalVisible(false)}>
                <TouchableOpacity style={{ flex: 1 }} onPressOut={() => setIsMenuModalVisible(false)} activeOpacity={1}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView} >
                            <TouchableOpacity style={{ backgroundColor: '#EEEEEE', borderRadius: 5, padding: 5 }} onPress={() => { setIsMenuModalVisible(false); setIsAuthModalVisible(true); setDataToPass({}); setPageToOpen('Settings') }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, }}>
                                    <Text style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>Settings</Text>
                                    <Image style={styles.settingsImage} source={require('../assets/Settings.png')} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: '#EEEEEE', borderRadius: 5, padding: 5, marginTop: 5 }} onPress={() => { setIsMenuModalVisible(false); setIsAuthModalVisible(true); setDataToPass({}); setPageToOpen('Statistics') }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                                    <Text style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>Statistics</Text>
                                    <Image style={styles.settingsImage} source={require('../assets/Statistics.png')} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: '#EEEEEE', borderRadius: 5, padding: 5, marginTop: 5 }} onPress={() => { setIsMenuModalVisible(false); Linking.openURL('https://lalandesai.dev'); }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                                    <Text style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>About</Text>
                                    <Image style={styles.settingsImage} source={require('../assets/About.png')} />
                                </View>
                            </TouchableOpacity>


                            <View style={{ flexDirection: 'column', backgroundColor: '#EEEEEE', borderRadius: 5, padding: 5, marginTop: 5 }}>
                                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>Filters</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 5, alignItems: 'center' }}>
                                    <Text style={{ alignSelf: 'center' }}>Year:</Text>
                                    <Dropdown
                                        data={YearDropdownList}
                                        labelField="label"
                                        valueField="value"
                                        value={selectedYear}
                                        placeholder="Year"
                                        onChange={(item) => {
                                            setSelectedYear(item.value);
                                            StoreDataInStorage('lastyear', String(item.value));
                                        }}
                                        style={{ width: '68%', backgroundColor: '#FFFFFF', borderRadius: 10, margin: 10, padding: 10, fontSize: 20, height: 50, borderColor: 'blue', alignContent: 'flex-end' }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 5, alignItems: 'center' }}>
                                    <Text style={{ alignSelf: 'center' }}>Code:</Text>
                                    <Dropdown
                                        data={batchData}
                                        labelField="Label"
                                        valueField="Value"
                                        value={selectedBatch}
                                        placeholder="Batch"
                                        onChange={(item) => {
                                            setSelectedBatch(item.Value);
                                            StoreDataInStorage('lastbatch', item.Value);
                                        }}
                                        style={{ width: '68%', backgroundColor: '#FFFFFF', borderRadius: 10, margin: 10, padding: 10, fontSize: 18, height: 50, borderColor: 'blue', alignContent: 'flex-end' }}
                                    />
                                </View>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>

                </TouchableOpacity>
            </Modal>

            <Modal
                onMagicTap={() => setIsAuthModalVisible(false)}
                transparent={true}
                visible={isAuthModalVisible}
                animationType="fade"

                onRequestClose={() => setIsAuthModalVisible(false)}>
                <TouchableOpacity style={{ flex: 1, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} onPressOut={() => setIsAuthModalVisible(false)} activeOpacity={1}>
                    <TouchableWithoutFeedback style={styles.centeredView}>
                        <View style={styles.authView} >

                            {
                                newServerURLClicked ?
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, fontWeight: '200' }}>Enter New Server URL</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TextInput
                                                style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 250, margin: 15, padding: 5, fontSize: 15, borderRadius: 10 }}
                                                onChangeText={text => setNewServerURL(text)}
                                                value={newServerURL}
                                                placeholder="http://"
                                            />

                                            <TouchableOpacity onPress={() => { setNewServerURLClicked(false); AsyncStorage.setItem('server_url', newServerURL); alert("Please restart the application for new changes to work."); }} style={{ marginTop: 10 }}>
                                                <Image style={{ width: 20, height: 20 }} source={require('../assets/Save.png')} />
                                            </TouchableOpacity>

                                        </View>
                                        <TouchableOpacity onPress={() => { setNewServerURLClicked(false); }} >
                                            <Text style={{ fontSize: 15, fontWeight: '200', margin: 15, textDecorationLine: 'underline', color: '#1703fc' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :

                                    <>
                                        <Text style={{ fontSize: 25, fontWeight: '200' }}>Authenticate</Text>
                                        <ProgressBar indeterminate={true} progress={0.5} visible={authPinLoading} style={{ width: 150 }} />
                                        <CodeField
                                            value={MPIN}
                                            onChangeText={setMPIN}
                                            cellCount={4}
                                            rootStyle={styles.codeFieldRoot}
                                            keyboardType="number-pad"
                                            renderCell={renderCell}
                                        />

                                        <TouchableOpacity onPress={() => { setNewServerURLClicked(true); }} >
                                            <Text style={{ fontSize: 15, fontWeight: '200', margin: 15, textDecorationLine: 'underline', color: '#1703fc' }}>Chnage Server URL?</Text>
                                        </TouchableOpacity>
                                    </>

                            }


                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal >

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.SearchIconTouchable} onPress={() => { navigation.navigate('Search', { updateData: updateData, serverURL: serverURL, selectedYear: selectedYear, selectedTab: selectedTab }) }}>
                    <Image style={styles.searchImage} source={require('../assets/Search.png')} />
                </TouchableOpacity>

                <View style={{ position: 'absolute', right: 100, top: 12, justifyContent: 'center', alignItems: 'flex-end', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: '300' }}>{selectedYear}</Text>
                </View>
                <TouchableOpacity style={styles.settingSIconTouchable} onPress={() => setIsMenuModalVisible(true)}>
                    <Image style={styles.settingsImage} source={require('../assets/Menu.png')} />
                </TouchableOpacity>

                <Image style={styles.logoImage} source={require('../assets/Logo2.png')} />
                <View style={styles.genderDepartment}>

                    <TouchableOpacity style={[styles.genderButton, { alignContent: 'center', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }]} onPress={() => setSelectedTab('M')}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[styles.genderLabel, { color: selectedTab === 'M' ? 'blue' : 'black' }]}>Boys</Text>
                            <Image style={{ height: 25, width: 25 }} source={require('../assets/ManStanding.png')} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.verticalLine}></View>


                    <TouchableOpacity style={[styles.genderButton, { alignContent: 'center', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }]} onPress={() => setSelectedTab('F')}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[styles.genderLabel, { color: selectedTab === 'F' ? 'blue' : 'black' }]}>Girls</Text>
                            <Image style={{ height: 25, width: 25 }} source={require('../assets/WomanStanding.png')} />
                        </View>

                    </TouchableOpacity>
                </View>
            </View>

            <ProgressBar indeterminate={true} progress={0.2} visible={isLoading} />



            {
                userData.length > 0 && !isLoading ?
                    <FlatList
                        data={userData}
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                        windowSize={10}
                        renderToHardwareTextureAndroid={true}
                        removeClippedSubviews={true}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            isLoading ?
                                <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading...</Text>
                                :
                                <Text style={{ fontSize: 20, fontWeight: '200' }}>No students for batch {selectedBatch}-{selectedYear}</Text>
                        }
                    </View>

            }



            <TouchableOpacity style={styles.addButton} onPress={e => navigation.navigate('AddStudent', { 'updateData': updateData, selectedTab: selectedTab, regDate: yearWork(selectedYear) })}>
                <Text style={styles.addLabel}>+</Text>
            </TouchableOpacity>

        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: StatusBarManager.HEIGHT,
    },
    navBar: {
        height: 100,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        marginBottom: 5
    }, genderDepartment: {
        flex: 1,
        flexDirection: 'row',
    }, genderButton: {
        height: 30,
        width: '50%',
        textAlign: 'center',
        fontSize: 20,
    },
    logoImage: {
        height: 70,
        width: 100,
        resizeMode: 'contain',
        marginTop: -10,
        margin: 10,
    },
    addButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#EEEEEE',
        right: 0,
        position: 'absolute',
        bottom: 0,
        margin: 20,
    },
    addLabel: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 3
    },
    verticalLine: {
        borderLeftWidth: 1,
        borderLeftColor: '#000',
        height: 35,
    },
    usersContainer:
    {
        flex: 1,
        margin: 10,
        marginTop: 0
    },
    searchImage: {
        height: 30,
        width: 30
    },
    SearchIconTouchable: {
        position: 'absolute',
        right: 45,
        margin: 15
    },
    settingSIconTouchable: {
        position: 'absolute',
        right: 0,
        margin: 18
    },

    genderLabel: {
        fontSize: 20,
        textAlign: 'center',
    },
    settingsImage: {
        height: 25,
        width: 25
    },
    modalView: {
        flex: 1,
        position: 'absolute',
        right: 0,
        height: 'auto',
        width: '55%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        margin: 10,
        marginTop: 55,
        flexDirection: 'column',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
    },
    authView: {
        height: 200,
        width: 320,
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

});