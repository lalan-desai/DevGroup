import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ToastAndroid, Linking, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import GetServerURL from '../Controller/Server';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import { Buffer } from 'buffer';

import { BASIC_AUTH } from "@env";
import { Image } from 'expo-image';



const UserPage = ({ route, navigation }) => {


    //parameters states
    const [userData, setUserData] = useState(route.params.userData);
    const [serverURL, setServerURL] = useState(route.params.serverURL);

    const [imageSource, setImageSource] = useState({ uri: serverURL + "images/" + userData.ImageURI + ".png" });


    const [name, setName] = useState(userData.Name);
    const [mobile, setMobile] = useState(userData.MobileNumber);
    const [gender, setGender] = useState(userData.Gender);
    const [fee, setFee] = useState(userData.Fee);
    const [frequancy, setFrequancy] = useState(userData.Frequancy);
    const [paymentStatus, setPaymentStatus] = useState(userData.PaymentStatus);
    const [code, setCode] = useState(userData.BatchCode);
    const [registrationDate, setRegistrationDate] = useState(new Date(userData.Date));
    const [ImageURI, setImageURI] = useState(userData.ImageURI);
    const [whatsappMessage, setWhatsappMessage] = useState('')
    const [renewalFee, setRenewalFee] = useState(0);

    const [renewalDate, setRenewalDate] = useState(renewDateWork(userData.Date));


    const [renewalBatchCode, setRenewalBatchCode] = useState();
    const [renewalPaymentStatus, setRenewalPaymentStatus] = useState('P');

    const [renewalFeeFromStorage, setRenewalFeeFromStorage] = useState();


    //ui states
    const [focusedElement, setFocusedElement] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showRenewDate, setShowRenewDate] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [isRenewalCodeLoading, setIsRenewalCodeLoading] = useState(false);
    const [isRenewalLoading, setIsRenewalLoading] = useState(false);
    const [isRegistrationCodeLoading, setIsRegistrationCodeLoading] = useState(false);


    //helper states
    const [nextBatchCode, setNextBatchCode] = useState();
    const [isImageSet, setIsImageSet] = useState(false);
    const [monthlyFee, setMonthlyFee] = useState('');
    const [yearlyFee, setYearlyFee] = useState('');

    const [imageLoading, setImageLoading] = useState(true);
    const [imageHadErrors, setImageHadErrors] = useState(false);




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



    const SendMessage = async () => {
        Linking.openURL(`whatsapp://send?text=${whatsappMessage}&phone=+91${mobile}`);
    }

    useEffect(() => {

        if (paymentStatus === 'P') {
            setFee('0');
        }
        else {
            if (frequancy === 'M') {
                if (userData.Fee !== monthlyFee) {
                    setFee(monthlyFee);
                }
                else {
                    setFee(userData.Fee);
                }
            }
            else {
                if (userData.Fee !== yearlyFee) {
                    setFee(yearlyFee);
                }
                else {
                    setFee(userData.Fee);
                }
            }
        }

    }, [paymentStatus, frequancy])

    function renewDateWork(regdate) {
        // Convert the registration date to a Date object
        let regdateObj = new Date(regdate);

        // Get the current date
        let todayObj = new Date();

        // Check if the registration month is between October (10) and November (11) of the current year
        if (regdateObj.getMonth() >= 10 && regdateObj.getMonth() <= 11 && regdateObj.getFullYear() === todayObj.getFullYear()) {
            // If true, calculate a new date by adding one year and setting the month to October 1st
            let newDate = new Date(todayObj.getFullYear() + 1, 10, 1, 0, 0, 0, 0);
            return newDate;
        }
        else if (regdateObj.getMonth() >= 10 && regdateObj.getMonth() <= 11 && regdateObj.getFullYear() === todayObj.getFullYear() - 1) {
            let newDate = new Date(todayObj.getFullYear(), 10, 1, 0, 0, 0, 0);
            return newDate;
        }
        else if ((regdateObj.getMonth() >= 0 && regdateObj.getMonth() <= 9 && regdateObj.getFullYear() === todayObj.getFullYear())) {
            let newDate = new Date(todayObj.getFullYear(), 10, 1, 0, 0, 0, 0);
            return newDate;
        }
        else {
            return todayObj;
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
        if (renewalPaymentStatus === 'P') {
            setRenewalFee('0');
        }
        else {
            setRenewalFee(renewalFeeFromStorage);
        }
    }, [renewalPaymentStatus])


    useEffect(() => {

        setFee(userData.Fee);

        GetDataFromStorage('delete_option').then((value) => {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => DeleteStudent('')}>
                        <Image style={{ width: 30, height: 30, marginRight: 5, display: value === 'checked' ? 'flex' : 'none' }} source={require('../assets/Delete.png')} />
                    </TouchableOpacity>
                )
            })
        })

        GetDataFromStorage('renew_fee').then((value) => {
            if (value !== null)
                setRenewalFeeFromStorage(value);
            else {
                StoreDataInStorage('renew_fee', '500').then(() => {
                    GetDataFromStorage('renew_fee').then((value) => {
                        setRenewalFeeFromStorage(value);
                    })
                })
            }
        });

        GetDataFromStorage('monthly_fee').then((value) => {
            if (value !== null) {
                setMonthlyFee(value);
            }
        })

        GetDataFromStorage('yearly_fee').then((value) => {
            if (value !== null) {
                setYearlyFee(value);
            }
        })


        GetDataFromStorage('whatsapp_message').then((value) => {
            if (value === null) {
                value = "Welcome! to DevGroup (Dandiya Raas Classes Rajkot). Thank you for registering with us. ☺\nPlease verify your details below...\nName: %name% \nNumber: %number% \nFee: %fee% \nFrequency: %freq% \nPayment Status: %ps% \nBatchcode: %bcode% \nDate: %date%"
            }
            let message = value.replace('%name%', name);
            message = message.replace('%number%', mobile);
            message = message.replace('%fee%', fee);
            message = message.replace('%freq%', frequancy);
            message = message.replace('%ps%', paymentStatus);
            message = message.replace('%bcode%', code);
            message = message.replace('%date%', registrationDate.toDateString());
            setWhatsappMessage(message);
        })
    }, [])


    useEffect(() => {
        getNextBatchCode('renewal', renewalDate);
    }, [renewalDate])

    useEffect(() => {
        if (filterYear(new Date(userData.Date)) !== filterYear(registrationDate) || userData.Gender !== gender)
            getNextBatchCode('registration', registrationDate);

        if (filterYear(new Date(userData.Date)) !== filterYear(registrationDate) || userData.Gender === gender)
            setCode(userData.BatchCode);

    }, [registrationDate, gender])


    async function getImageBase64(url, authkey) {
        // Create basic authentication headers
        const headers = new Headers();
        headers.set(
            'Authorization',
            `Basic ${BASIC_AUTH}==`
        );

        try {
            // Fetch image data using basic authentication
            const response = await fetch(url, {
                headers: headers,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            // Convert image data to base64 string
            const blob = await response.blob();
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });

            // Strip the metadata part from the base64 string
            const base64WithoutHeader = base64.split(',')[1];

            return base64WithoutHeader;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    }

    const RenewStudent = async () => {

        setIsRenewalLoading(true);


        //convert date to SQL fromat like YYYY-MM-DD
        let dd = renewalDate.getDate();
        let mm = renewalDate.getMonth() + 1;
        let yyyy = renewalDate.getFullYear();

        let formatedStringDate = yyyy + '-' + mm + '-' + dd;

        if (userData.ImageURI !== null) {
            // var compressImage = await manipulateAsync(imageSource.uri.replace('://', '://dipak:Devgroup28@'), [{ resize: { width: 480 } }], { compress: 0.5, format: SaveFormat.JPEG });
            // var newbase64 = await FileSystem.readAsStringAsync(compressImage.uri, { encoding: 'base64' });
            var newbase64 = await getImageBase64(imageSource.uri, BASIC_AUTH);
        }

        let jsonBody = JSON.stringify({
            image: userData.ImageURI !== null ? newbase64 : '',
            name: name,
            number: mobile,
            gender: gender[0],
            fee: renewalFee,
            frequancy: frequancy[0],
            paymentStatus: renewalPaymentStatus[0],
            batchCode: renewalBatchCode,
            date: formatedStringDate,
            isRenew: true,
        })

        


        fetch(await GetServerURL() + '/AddStudent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: jsonBody
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === '200') {
                    setIsRenewalLoading(false);
                    setRenewModalVisible(false);
                    ToastAndroid.show('Student Renewed Successfully', ToastAndroid.SHORT);
                    route.params.updateData(filterYear(registrationDate), gender[0], "ALL");
                    navigation.navigate('Dashboard');
                }
                else {
                    setIsRenewalLoading(false);
                    alert('Error Occured. Please try again later.');
                }
            }).catch((error) => {
                setIsRenewalLoading(false);
                alert(error);
            })

    }


    const UpdateStudent = async () => {
        let formatedStringDate = registrationDate.toISOString().split('T')[0];

        if (isImageSet) {
            var compressImage = await manipulateAsync(imageSource.uri, [{ resize: { width: 480 } }], { compress: 0.5, format: SaveFormat.JPEG });
            var base64 = await FileSystem.readAsStringAsync(compressImage.uri, { encoding: 'base64' });
        }

        let jsonBody = JSON.stringify({
            id: userData.ID,
            image: isImageSet ? base64 : '',
            name: name,
            number: mobile,
            gender: gender[0],
            fee: fee,
            frequancy: frequancy[0],
            paymentStatus: paymentStatus[0],
            batchCode: code,
            date: formatedStringDate,
            oldImageURI: userData.ImageURI === undefined ? '' : userData.ImageURI
        })


        fetch(await GetServerURL() + '/UpdateStudent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: jsonBody
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === '200') {
                    ToastAndroid.show('Student Updated Successfully', ToastAndroid.SHORT);
                    route.params.updateData(filterYear(registrationDate), gender[0], "ALL", false);
                    navigation.navigate('Dashboard');
                }
                else {
                    alert('Error Occured');
                }
            })
    }

    const filterYear = (date) => {
        let newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 2);
        let year = newDate.getFullYear();
        return year;
    }

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
        console.log(year.substring(2, 4))
        return year.substring(2, 4);


    }


    const SaveStudent = () => {
        Contacts.requestPermissionsAsync().then((data) => {
            if (data.status === 'granted') {
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
                        alert('Contact Saved Successfully.');
                    })
                    .catch(error => {
                        alert('Error saving the contact. Make sure you have provided the permission to save contacts.');

                    });
            }
            else {
                ToastAndroid.show('Please provide contact permission to save contacts.', ToastAndroid.SHORT);
            }
        })
    }

    const DeleteStudentFromServer = async () => {

        fetch(await GetServerURL() + '/DeleteStudent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: JSON.stringify({
                StudentID: userData.ID,
                'ImageURI': ImageURI === null ? '' : ImageURI
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status === '200') {
                    ToastAndroid.show('Student Deleted Successfully', ToastAndroid.SHORT);
                    route.params.updateData(filterYear(registrationDate), gender[0], code[0]);
                    navigation.navigate('Dashboard');
                }
                else {
                    ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }


    const DeleteStudent = async () => {

        //ask for confirmation
        Alert.alert(
            'Delete Student',
            'Are you sure you want to delete this student?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Delete', onPress: () => {
                        DeleteStudentFromServer();
                    }
                },
            ],
            { cancelable: false },
        );



    }

    const selectPhoto = async (source) => {
        if (source === 'camera') {
            var result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 0.7,
            });
        }
        if (source === 'gallery') {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 0.7,
            });
        }

        if (!result.canceled) {
            let uri = result.assets[0].uri;
            setImageSource({ uri: uri });
            setIsImageSet(true);
            setImageURI('null');
        }
    }



    const onRegistrationDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowDate(false);
        setRegistrationDate(currentDate);
    };

    const getNextBatchCode = async (type, date) => {
        if (type === 'renewal')
            setIsRenewalCodeLoading(true);
        else
            setIsRegistrationCodeLoading(true);

        fetch(await GetServerURL() + '/Batchcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${BASIC_AUTH}==`
            },
            body: JSON.stringify({
                'year': filterYear(date),
                'gender': gender[0]
            })
        }).then(response => response.json()).then(data => {
            if (type === 'renewal') {
                setIsRenewalCodeLoading(false);
                setRenewalBatchCode(data.letter + data.batchcode)
            }
            else {
                setIsRegistrationCodeLoading(false);
                setCode(data.letter + data.batchcode)
            }
        }).catch((error) => {
            setIsRenewalCodeLoading(false);
            alert(error);
        });
    }




    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />




            <TouchableOpacity onPress={() => setModalVisible(true)}>


                {
                    ImageURI !== null && !imageHadErrors
                        ?
                        <Image style={styles.profilePic} source={imageSource} onError={() => setImageHadErrors(true)} />
                        :
                        <Image style={styles.profilePic} source={gender === 'M' ? require('../assets/Man.png') : require('../assets/Woman.png')} />
                }
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={renewModalVisible}
                onRequestClose={() => {
                    setRenewModalVisible(!renewModalVisible);
                }}>
                <TouchableOpacity style={{ flex: 1, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} onPressOut={() => setRenewModalVisible(false)} activeOpacity={1}>

                    <TouchableWithoutFeedback style={styles.centeredView}>
                        <View style={styles.renewView} >
                            {
                                isRenewalLoading ?
                                    <>
                                        <Text>Renewing Student...</Text>
                                        <ActivityIndicator style={{ alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flex: 1 }} size="large" color="#0000ff" />
                                    </>
                                    :
                                    <>
                                        <Text style={{ fontSize: 20 }}>Renew Student</Text>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>

                                            <View style={{ flexDirection: 'column', width: '60%' }}>
                                                <Text style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, width: '100%' }}>Renewal Fee:</Text>
                                                <TextInput keyboardType='numeric' value={renewalFee} onFocus={() => setFocusedElement('RenewFee')} onBlur={() => setFocusedElement('')} onChangeText={e => setRenewalFee(e)} placeholder='Fee' style={[styles.textInput, { width: '80%', borderWidth: focusedElement === 'RenewFee' ? 2 : 0, marginTop: 5, margin: 0 }]}></TextInput>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ alignSelf: 'flex-start', marginTop: 10 }}>Renewal Code:</Text>
                                                {
                                                    isRenewalCodeLoading ?
                                                        <ActivityIndicator style={{ alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flex: 1 }} size="small" color="#0000ff" />
                                                        :
                                                        <TextInput editable={false} value={renewalBatchCode} onFocus={() => setFocusedElement('RenewCode')} onBlur={() => setFocusedElement('')} onChangeText={e => setRenewalBatchCode(e)} placeholder='Renewal Fee' style={[styles.textInput, { width: '80%', borderWidth: focusedElement === 'RenewCode' ? 2 : 0, marginTop: 5, margin: 0 }]}></TextInput>
                                                }
                                            </View>


                                        </View>

                                        <Text style={{ alignSelf: 'flex-start', marginTop: 10 }}>Renewal fee status:</Text>


                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                                            <View style={{ width: '100%', backgroundColor: '#f2f2f2', borderRadius: 10, marginTop: 10, padding: 10, fontSize: 20, height: 50, flexDirection: 'row', justifyContent: 'space-around' }} >
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRenewalPaymentStatus('P')}>
                                                    <RadioButton
                                                        value="P"
                                                        status={renewalPaymentStatus === 'P' ? 'checked' : 'unchecked'}
                                                        onPress={() => setRenewalPaymentStatus('P')}
                                                    />
                                                    <Image style={{ height: 30, width: 30 }} source={require('../assets/Pending.png')} />
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRenewalPaymentStatus('C')}>
                                                    <RadioButton
                                                        value="C"
                                                        status={renewalPaymentStatus === 'C' ? 'checked' : 'unchecked'}
                                                        onPress={() => setRenewalPaymentStatus('C')}
                                                    />
                                                    <Image style={{ height: 30, width: 30 }} source={require('../assets/Cash.png')} />
                                                </TouchableOpacity>


                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRenewalPaymentStatus('O')}>
                                                    <RadioButton
                                                        value="O"
                                                        status={renewalPaymentStatus === 'O' ? 'checked' : 'unchecked'}
                                                        onPress={() => setRenewalPaymentStatus('O')}
                                                    />
                                                    <Image style={{ height: 30, width: 30 }} source={require('../assets/Online.png')} />
                                                </TouchableOpacity>
                                            </View>

                                        </View>




                                        <Text style={{ alignSelf: 'flex-start', marginTop: 10 }}>Registration Date:</Text>

                                        <TouchableOpacity style={[styles.textInput, { width: '100%', marginTop: 5 }]} onPress={() => { setShowRenewDate(true) }} >
                                            {
                                                showRenewDate &&
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={renewalDate}
                                                    mode={'date'}
                                                    is24Hour={true}
                                                    display="default"
                                                    onChange={e => { setShowRenewDate(false); setRenewalDate(new Date(e.nativeEvent.timestamp)) }}
                                                />
                                            }
                                            <Text style={{ fontSize: 20 }} >{renewalDate.toDateString()}</Text>
                                        </TouchableOpacity>

                                        {
                                            isRenewalCodeLoading ?
                                                <ActivityIndicator size="small" color="#0000ff" />
                                                :
                                                <>
                                                    <TouchableOpacity onPress={() => RenewStudent()} style={{ backgroundColor: '#0d6efd', padding: 7, borderRadius: 5, marginTop: 5 }}>
                                                        <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
                                                    </TouchableOpacity>
                                                </>
                                        }

                                    </>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            <TextInput value={name} onFocus={() => setFocusedElement('Name')} onBlur={() => setFocusedElement('')} onChangeText={e => setName(e)} placeholder='Name' style={[styles.textInput, { width: '96%', borderWidth: focusedElement === 'Name' ? 2 : 0 }]}></TextInput>

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TextInput value={mobile} onFocus={() => setFocusedElement('Mobile')} onBlur={() => setFocusedElement('')} keyboardType='number-pad' placeholder='Mobile No' onChangeText={e => setMobile(e)} maxLength={10} style={[styles.textInput, { width: '60%', borderWidth: focusedElement === 'Mobile' ? 2 : 0 }]}></TextInput>
                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setGender('M')}>
                        <RadioButton
                            value="Male"
                            status={gender === 'M' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('M')}
                        />
                        <Image style={{ height: 25, width: 25, marginStart: -10 }} source={require('../assets/ManStanding.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setGender('F')}>
                        <RadioButton
                            value="Female"
                            status={gender === 'F' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('F')}
                        />
                        <Image style={{ height: 25, width: 25, marginStart: -10 }} source={require('../assets/WomanStanding.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                <TextInput onFocus={() => setFocusedElement('Fee')} onBlur={() => setFocusedElement('')} value={fee} keyboardType='number-pad' placeholder='Fee' onChangeText={e => setFee(e)} maxLength={10} style={[styles.textInput, { width: '60%', borderWidth: focusedElement === 'Fee' ? 2 : 0 }]}></TextInput>
                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setFrequancy('Y')}>
                        <RadioButton
                            value="Y"
                            status={frequancy === 'Y' ? 'checked' : 'unchecked'}
                            onPress={() => setFrequancy('Y')}
                        />
                        <Text style={{ fontSize: 20 }}>Y</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setFrequancy('M')}>
                        <RadioButton
                            value="M"
                            status={frequancy === 'M' ? 'checked' : 'unchecked'}
                            onPress={() => setFrequancy('M')}
                        />
                        <Text style={{ fontSize: 20 }}>M</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                <View style={{ width: '60%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, fontSize: 20, height: 50, flexDirection: 'row', justifyContent: 'space-around' }} >
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('P')}>
                        <RadioButton
                            value="P"
                            status={paymentStatus === 'P' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('P')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Pending.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('C')}>
                        <RadioButton
                            value="C"
                            status={paymentStatus === 'C' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('C')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Cash.png')} />
                    </TouchableOpacity>


                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPaymentStatus('O')}>
                        <RadioButton
                            value="O"
                            status={paymentStatus === 'O' ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentStatus('O')}
                        />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/Online.png')} />
                    </TouchableOpacity>
                </View>

                {
                    isRegistrationCodeLoading ? <ActivityIndicator style={{ width: '30%' }} size="small" color="#0000ff" /> :
                        <TouchableOpacity style={{ width: '100%' }} >
                            <TextInput value={code} onFocus={() => { alert("This code is automatically generated, so modifying it may impact the application's functionality!"); setFocusedElement('Code') }} onBlur={() => setFocusedElement('')} defaultValue={nextBatchCode} onChangeText={e => setCode(e)} placeholder='Code' style={[styles.textInput, { width: '30%', borderWidth: focusedElement === 'Code' ? 2 : 0 }]}></TextInput>
                        </TouchableOpacity>
                }
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                <TouchableOpacity style={[styles.textInput, { width: '60%' }]} onPress={() => { setShowDate(true) }} >
                    <Text style={{ fontSize: 20 }} value={registrationDate}>{registrationDate.toDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '40%', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => SendMessage()}>
                    <Image style={{ height: 40, width: 40 }} source={require('../assets/Message.png')}></Image>
                </TouchableOpacity>
            </View>



            {showDate && (
                <DateTimePicker
                    testID="datePicker"
                    value={registrationDate}
                    mode='date'
                    onChange={onRegistrationDateChange}
                />
            )}


            <TouchableOpacity style={styles.updateButton} onPress={() => { UpdateStudent(), setFocusedElement('') }}>
                <Text style={styles.updateButtonLabel}>Update</Text>
            </TouchableOpacity>



            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.updateButton, { flex: frequancy === 'M' ? 1 : 0, backgroundColor: '#D09CFA' }]} onPress={() => { SaveStudent(), setFocusedElement('') }}>
                    <Text style={styles.updateButtonLabel}>Save Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.updateButton, { display: frequancy === 'Y' ? 'flex' : 'none', backgroundColor: '#227C70' }]} onPress={() => { setRenewModalVisible(true), setFocusedElement('') }}>
                    <Text style={styles.updateButtonLabel}>Renew</Text>
                </TouchableOpacity>

            </View>



        </View>
    );
}

export default UserPage


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
        height: "100%",
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
    updateButton: {
        width: '45%',
        height: 50,
        backgroundColor: '#C85C8E',
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
        padding: 10,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
    },
    updateButtonLabel: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: '#fff',
    },
    renewView: {
        height: 380,
        width: 300,
        margin: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 30,
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

});