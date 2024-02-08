import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import GetServerURL from '../Controller/Server';
import User from '../Cards/User';
import { Dropdown } from 'react-native-element-dropdown';
import { ProgressBar, RadioButton } from 'react-native-paper';
import React from 'react';

import { BASIC_AUTH } from "@env";


const SearchPage = ({ navigation, route }) => {

    const updateData = route.params.updateData;
    const selectedYear = route.params.selectedYear;
    const selectedGender = route.params.selectedTab;


    //ui States
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [serverUrl, setServerUrl] = useState(GetServerURL());
    const [isLoading, setIsLoading] = useState(false);



    //filter states
    const [year, setYear] = useState('');
    const [batch, setBatch] = useState('ALL');
    const [PaymentStaus, setPaymentStaus] = useState('ALL');
    const [frequancy, setFrequancy] = useState()
    const [gender, setGender] = useState(selectedGender !== undefined ? selectedGender : 'M');

    //helper states
    const [yearData, setYearData] = useState([]);

    const PaymentStausData = [
        { "Label": "All", "Value": "ALL" },
        { "Label": "Pending", "Value": "P" },
        { "Label": "Cash", "Value": "C" },
        { "Label": "Online", "Value": "O" },

    ]

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

    const filterYear = (date) => {
        let newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 2);
        let year = newDate.getFullYear();
        return year;
    }

    useEffect(() => {

        GetServerURL().then((url) => {
            setServerUrl(url);
        })
        GetYears();

        setYear(selectedYear);

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image style={{ width: 30, height: 30, marginRight: 5 }} source={require('../assets/Filter.png')} />
                </TouchableOpacity>
            )
        })

    }, [])


    const GetYears = async () => {
        await fetch(await GetServerURL() + '/Year.php', {
            headers: {
                'Authorization': `Basic ${BASIC_AUTH}==`
            }
        }).then(response => response.json()).then(data => {
            let years = [];
            data.forEach(element => {
                years.push({ label: element.Year, value: element.Year });
            });

            if (years.length > 0)
                years.push({ label: 'All', value: 'ALL' });

            //put all in top

            years.sort((a, b) => {
                if (a.value == 'ALL') return -1;
                if (b.value == 'ALL') return 1;
                return 0;
            });

            setYearData(years);

        })
    }

    useEffect(() => {
        if (searchText.length > 0)
            search();
    }, [searchText])

    const search = async () => {
        setSearchResult([]);
        setIsLoading(true);
        let url = serverUrl + '/Search.php';
        let data = {};

        if (searchText.length > 0)
            data.name = searchText;

        //add new filter
        if (year != 'ALL')
            data.year = year;

        if (batch != 'ALL')
            data.batchcode = batch;

        if (PaymentStaus != 'ALL')
            data.paymentstatus = PaymentStaus;

        if (frequancy != null)
            data.fr = frequancy;

        if (gender != null)
            data.gender = gender;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                setIsLoading(false);
                setSearchResult(responseJson);
            })
    }


    return (
        <View style={styles.container}>
            <ProgressBar indeterminate={true} progress={0.2} visible={isLoading} />
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextInput style={styles.textInputSearch} placeholder="Search" value={searchText} onChangeText={e => setSearchText(e)}></TextInput>
                <Image source={require('../assets/Search.png')} style={{ width: 25, height: 25, position: 'absolute', right: 20 }} />
            </View>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity style={{ flex: 1, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} onPressOut={() => setModalVisible(false)} activeOpacity={1}>
                    <TouchableWithoutFeedback style={styles.centeredView}>

                        <View style={styles.modalView} >
                            <Text style={{ fontSize: 25, marginTop: -15, color: '#0d6efd' }}>Filters</Text>

                            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Dropdown
                                    data={yearData}
                                    labelField="label"
                                    valueField="value"
                                    value={year}
                                    placeholder="Year"
                                    selectedTextStyle={{ fontSize: 20 }}
                                    onChange={(item) => {
                                        setYear(item.value);
                                    }}
                                    style={{ width: '40%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, height: 'auto', borderColor: 'blue' }}
                                />
                                <Dropdown
                                    data={batchData}
                                    labelField="Label"
                                    valueField="Value"
                                    value={batch}
                                    placeholder="Batch"
                                    selectedTextStyle={{ fontSize: 20 }}
                                    onChange={(item) => {
                                        setBatch(item.Value);

                                    }}
                                    style={{ width: '30%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, height: 'auto', borderColor: 'blue' }}
                                />
                            </View>

                            <Text>PaymentStaus:</Text>
                            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Dropdown
                                    data={PaymentStausData}
                                    labelField="Label"
                                    valueField="Value"
                                    value={PaymentStaus}
                                    selectedTextStyle={{ fontSize: 20 }}
                                    onChange={(item) => {
                                        setPaymentStaus(item.Value);
                                    }}
                                    style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, height: 'auto', borderColor: 'blue' }}
                                />
                            </View>

                            <Text>Frequancy:</Text>

                            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>

                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, padding: 5, borderRadius: 5, margin: 5 }}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <RadioButton
                                            status={frequancy === "M" ? 'checked' : 'unchecked'}
                                            onPress={() => setFrequancy('M')}
                                        />
                                        <Text>M</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <RadioButton
                                            status={frequancy === "Y" ? 'checked' : 'unchecked'}
                                            onPress={() => setFrequancy('Y')}
                                        />
                                        <Text>Y</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, padding: 5, borderRadius: 5, margin: 5 }}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <RadioButton
                                            status={gender === "M" ? 'checked' : 'unchecked'}
                                            onPress={() => setGender('M')}
                                        />
                                        <Text>Boys</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <RadioButton
                                            status={gender === "F" ? 'checked' : 'unchecked'}
                                            onPress={() => setGender('F')}
                                        />
                                        <Text>Girls</Text>
                                    </View>
                                </View>




                            </View>



                            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#0d6efd', borderRadius: 10, margin: 5, padding: 5, height: 40, borderColor: 'blue', width: 100 }} onPress={() => {
                                    setModalVisible(false);
                                    setIsLoading(true);
                                    search();
                                }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: 'white' }}>Apply</Text>
                                </TouchableOpacity>
                            </View>



                        </View>
                    </TouchableWithoutFeedback>

                </TouchableOpacity>
            </Modal>

            <FlatList
                data={searchResult}
                renderItem={({ item, index }) => <User key={index} data={item} navigation={navigation} updateData={updateData} serverURL={serverUrl} />}

            />

        </View>
    )
}

export default SearchPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },
    textInputSearch: {
        height: 'auto',
        borderColor: 'gray',
        borderWidth: 1,
        width: '96%',
        padding: 10,
        margin: 10,
        fontSize: 20,
        borderRadius: 10,
        fontWeight: '300'
    },
    usersContainer:
    {
        flex: 1,
        margin: 10,
        marginTop: 0
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        height: 360,
        width: '90%',
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
    }
});