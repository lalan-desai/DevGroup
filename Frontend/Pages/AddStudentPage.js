import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal, ToastAndroid, ActivityIndicator, Keyboard } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import GetServerURL from '../Controller/Server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as Contacts from 'expo-contacts';
import LottieView from 'lottie-react-native';
import { BASIC_AUTH } from "@env";

export default function AddStudentPage({ route, navigation }) {

    const selectedGenderTab = route.params.selectedTab;

    //parameters states
    const [imageSource, setImageSource] = useState(require('../assets/Man.png'));
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState(selectedGenderTab === "M" ? "Male" : "Female");
    const [fee, setFee] = useState('0');
    const [frequancy, setFrequancy] = useState('Yearly');
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [code, setCode] = useState('');
    const [registrationDate, setRegistrationDate] = useState(route.params.regDate === undefined ? new Date() : route.params.regDate);

    //ui states
    const [focusedElement, setFocusedElement] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [isAnimationVisible, setIsAnimationVisible] = useState(false);

    //helper states
    const [nextBatchCode, setNextBatchCode] = useState();
    const [isImageSet, setIsImageSet] = useState(false);
    const [monthlyFee, setMonthlyFee] = useState(200);
    const [yearlyFee, setYearlyFee] = useState(2000);
    const [isSubmitButtonPressed, setIsSubmitButtonPressed] = useState(false);
    const [isBatchCodeGenerated, setIsBatchCodeGenerated] = useState(false);


    //refs 

    const successAnimationRef = useRef();


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

    useEffect(() => {
        getNextBatchCode();
    }, [registrationDate, gender])

    useEffect(() => {


        getNextBatchCode();
        GetDataFromStorage('monthly_fee').then((data) => {
            if (data !== null) {
                setMonthlyFee(data);
            }
            else {
                StoreDataInStorage('monthly_fee', '200').then(() => {
                    GetDataFromStorage('monthly_fee').then((data) => {
                        setMonthlyFee(data);
                    });
                });
            }
        });

        GetDataFromStorage('yearly_fee').then((data) => {
            if (data !== null) {
                setYearlyFee(data);
            }
            else {
                StoreDataInStorage('yearly_fee', '2000').then(() => {
                    GetDataFromStorage('yearly_fee').then((data) => {
                        setYearlyFee(data);
                    });
                });
            }
        });

        

        



        
        Contacts.requestPermissionsAsync().then((data) => {

            if (data.status === 'granted') {
                
            }
            else {
                ToastAndroid.show('Permission denied.', ToastAndroid.SHORT);
            }
        })
    }, []);




    useEffect(() => {
        if (paymentStatus === 'Pending') {
            setFee('0');
        }
        else {
            if (frequancy === 'Monthly') {
                setFee(String(monthlyFee));
            }
            if (frequancy === 'Yearly') {
                setFee(String(yearlyFee));
            }
        }
    }, [frequancy, paymentStatus])

    useEffect(() => {
        setCode(nextBatchCode);
    }, [nextBatchCode])

    const filterYear = (date) => {
        let newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 2);
        let year = newDate.getFullYear();
        return year;
    }

    const getNextBatchCode = async () => {
        setIsBatchCodeGenerated(false);
        fetch(await GetServerURL() + '/Batchcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: JSON.stringify({
                'year': filterYear(registrationDate),
                'gender': gender[0]
            })
        }).then(response => response.json()).then(data => {
            setIsBatchCodeGenerated(true);
            setNextBatchCode(data.letter + data.batchcode);
        }).catch((error) => {
            alert(error);
        });
    }

    useEffect(() => {
        if (!isImageSet) {
            if (gender === 'Male')
                setImageSource(require('../assets/Man.png'));
            else
                setImageSource(require('../assets/Woman.png'));
        }
    }, [gender]);


    const getContactYear = (regDate) => {
        let regdateobj = new Date(regDate);

        //if regdateobj month is greater than aur equal to november then add 1 to year
        //return last two digits of year

        let year = ""
        if (regdateobj.getMonth() >= 10) {
            year = String(regdateobj.getFullYear() + 1);
        }
        else {
            year = String(regdateobj.getFullYear());
        }

        
        return year.substring(2, 4);


    }


    const AddStudent = async () => {
        Keyboard.dismiss();
        if (!isSubmitButtonPressed) {
            setIsSubmitButtonPressed(true);

            let regex = /^[A-Z][0-9]+$/;
            if (regex.test(code)) {


                //convert date to SQL fromat like YYYY-MM-DD
                let dd = registrationDate.getDate();
                let mm = registrationDate.getMonth() + 1;
                let yyyy = registrationDate.getFullYear();

                let formatedStringDate = yyyy + '-' + mm + '-' + dd;

                if (isImageSet) {
                    var compressImage = await manipulateAsync(imageSource.uri, [{ resize: { width: 480 } }], { compress: 0.15, format: SaveFormat.JPEG });
                    var base64 = await FileSystem.readAsStringAsync(compressImage.uri, { encoding: 'base64' });
                }

                let jsonBody = JSON.stringify({
                    image: isImageSet ? base64 : '',
                    name: name,
                    number: mobile,
                    gender: gender[0],
                    fee: fee,
                    frequancy: frequancy[0],
                    paymentStatus: paymentStatus[0],
                    batchCode: nextBatchCode === code ? nextBatchCode : code,
                    date: formatedStringDate,
                })




                fetch(await GetServerURL() + '/AddStudent.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${BASIC_AUTH}==`
                    },
                    body: jsonBody
                }).then(response => response.json()).then(data => {
                    if (data.status === '200') {
                        const contact = {
                            [Contacts.Fields.FirstName]: name + ' {' + getContactYear(registrationDate) + '}-' + gender[0],
                            [Contacts.Fields.PhoneNumbers]: [
                                {
                                    number: mobile,
                                    label: 'mobile',
                                },
                            ],
                        };
                        Contacts.addContactAsync(contact).then
                            (data => {
1
                            })
                            .catch(error => {
                                alert(error)
                            });

                        setIsSubmitButtonPressed(false);
                        setIsAnimationVisible(true);
                        successAnimationRef.current.play();
                    }
                    else {
                        alert('Error Occured');
                    }
                })
            }
            else {
                setIsSubmitButtonPressed(false);
                alert("Batch Code is not matching with the requirements.");
                setCode(nextBatchCode);
            }
        }
    }


    const selectPhoto = async (source) => {
        if (source === 'camera') {
            var result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 1,
            });
        }
        if (source === 'gallery') {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 1,
            });
        }

        if (!result.canceled) {
            let uri = result.assets[0].uri;
            setImageSource({ uri: uri });
            setIsImageSet(true);
        }
    }

    const AddAnimationFinish = () => {
        ToastAndroid.show('Student added successfully.', ToastAndroid.SHORT);
        route.params.updateData(filterYear(registrationDate), gender[0], "ALL");
        navigation.navigate('Dashboard');
    }

    const onRegistrationDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setRegistrationDate(currentDate);
        setShowDate(false);
    };


    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={imageSource} style={styles.profilePic} />
            </TouchableOpacity>



            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Choose an image</Text>
                        <View style={styles.buttonContainer}>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    selectPhoto('camera')
                                }}>
                                <Image style={{ height: 25, width: 25 }} source={require('../assets/Camera.png')} />
                                <Text style={styles.textStyle}>Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    selectPhoto('gallery')
                                }}>
                                <Image style={{ height: 25, width: 25 }} source={require('../assets/Gallery.png')} />

                                <Text style={styles.textStyle}>Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <Image style={{ height: 25, width: 25 }} source={require('../assets/Cancel.png')} />
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <TextInput onFocus={() => setFocusedElement('Name')} onBlur={() => setFocusedElement('')} onChangeText={e => setName(e)} placeholder='Name' style={[styles.textInput, { width: '96%', borderWidth: focusedElement === 'Name' ? 2 : 0 }]}></TextInput>

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TextInput onFocus={() => setFocusedElement('Mobile')} onBlur={() => setFocusedElement('')} keyboardType='number-pad' placeholder='Mobile No' onChangeText={e => setMobile(e)} maxLength={10} style={[styles.textInput, { width: '60%', borderWidth: focusedElement === 'Mobile' ? 2 : 0 }]}></TextInput>
                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setGender('Male')}>
                        <RadioButton
                            value="Male"
                            status={gender === 'Male' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('Male')}
                        />
                        <Image style={{ height: 25, width: 25, marginStart: -10 }} source={require('../assets/ManStanding.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setGender('Female')}>
                        <RadioButton
                            value="Female"
                            status={gender === 'Female' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('Female')}
                        />
                        <Image style={{ height: 25, width: 25, marginStart: -10 }} source={require('../assets/WomanStanding.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                <TextInput onFocus={() => setFocusedElement('Fee')} onBlur={() => setFocusedElement('')} value={fee} keyboardType='number-pad' placeholder='Fee' onChangeText={e => setFee(e)} maxLength={10} style={[styles.textInput, { width: '60%', borderWidth: focusedElement === 'Fee' ? 2 : 0 }]}></TextInput>
                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>


                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setFrequancy('Yearly')}>
                        <RadioButton
                            value="Yearly"
                            status={frequancy === 'Yearly' ? 'checked' : 'unchecked'}
                            onPress={() => setFrequancy('Yearly')}
                        />
                        <Text style={{ fontSize: 20 }}>Y</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setFrequancy('Monthly')}>
                        <RadioButton
                            value="Monthly"
                            status={frequancy === 'Monthly' ? 'checked' : 'unchecked'}
                            onPress={() => setFrequancy('Monthly')}
                        />
                        <Text style={{ fontSize: 20 }}>M</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                <View style={{ width: '60%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, fontSize: 20, height: 50, flexDirection: 'row', justifyContent: 'space-around' }} >
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('Pending')}>
                        <RadioButton
                            value="Pending"
                            status={paymentStatus === 'Pending' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('Pending')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Pending.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('Cash')}>
                        <RadioButton
                            value="Cash"
                            status={paymentStatus === 'Cash' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('Cash')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Cash.png')} />
                    </TouchableOpacity>


                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('Online')}>
                        <RadioButton
                            value="Online"
                            status={paymentStatus === 'Online' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('Online')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Online.png')} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ flexDirection: 'row', width: '30%' }} onPress={() => alert('The code shown is for reference purposes only. It may vary if multiple users are entering data at the same time!')}>
                    {
                        isBatchCodeGenerated ?
                            <TextInput editable={false} onFocus={() => setFocusedElement('Code')} onBlur={() => setFocusedElement('')} value={code} onChangeText={e => setCode(e)} placeholder='Code' style={[styles.textInput, { textAlign: 'center', width: '100%', borderWidth: focusedElement === 'Code' ? 2 : 0 }]} />
                            :
                            <ActivityIndicator style={{ position: 'absolute', top: 0, left: 20, right: 0, bottom: 0, alignItems: 'center', display: isBatchCodeGenerated ? 'none' : 'flex' }} size='large' />
                    }
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={[styles.textInput, { width: '95%', }]} onPress={() => { setShowDate(true) }} >
                <Text style={{ fontSize: 20, }} value={registrationDate}>{registrationDate.toDateString()}</Text>
            </TouchableOpacity>


            {showDate && (
                <DateTimePicker
                    testID="datePicker"
                    value={registrationDate}
                    mode='date'
                    onChange={onRegistrationDateChange}
                />
            )}


            <TouchableOpacity style={styles.submitButton} onPress={() => { AddStudent(), setFocusedElement('') }}>
                <Text style={[styles.submitButtonLabel, { display: isSubmitButtonPressed ? 'none' : 'flex' }]} >Submit</Text>
                <ActivityIndicator style={{ display: isSubmitButtonPressed ? 'flex' : 'none' }} size='large' />
            </TouchableOpacity>

            <LottieView

                loop={false}
                ref={successAnimationRef}
                duration={1000}
                onAnimationFinish={() => AddAnimationFinish()}
                style={{
                    display: isAnimationVisible ? 'flex' : 'none',
                    flex: isAnimationVisible ? 1 : 0,
                    backgroundColor: isAnimationVisible ? '#FFFFFF' : ''

                }}

                source={require('.././assets/Amimation/Success.json')}
            />


            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />

        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    profilePic: {
        width: 120,
        height: 120,
        margin: 15,
        borderRadius: 100,
    },
    textInput: {
        borderColor: 'blue',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        fontSize: 20,
    },

    centeredView: {
        bottom: 1,
        flex: 1,
        justifyContent: "flex-end",
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 10,
        backgroundColor: "white",
        width: 80,
        height: 80,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        color: "black",
    },

    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 12,
    },

    dateText: {
        width: '95%',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        fontSize: 20,
        color: '#000',
    },
    submitButton: {
        width: '95%',
        height: 50,
        backgroundColor: '#0d6efd',
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
        padding: 10,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
    },
    submitButtonLabel: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: '#fff',
    }
});