import { StyleSheet, Text, View, TouchableOpacity, Modal, Linking } from 'react-native';
import { useState } from 'react';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { BASIC_AUTH } from "@env";


const User =  ({ data, navigation, updateData, serverURL }) => {


    const [imageUrl, setImageUrl] = useState(data.ImageURI !== null ? serverURL + "images/" + data.ImageURI + ".png" : null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isImageHadErrors, setIsImageHadErrors] = useState(false);


    const ContactPerson = () => {
        let url = 'https://wa.me/+91' + data.MobileNumber;
        Linking.openURL(url);
    }


    return (
        <>
            {data.ImageURI !== null ?
                <Modal onMagicTap={() => setIsModalVisible(false)}
                    transparent={true}
                    visible={isModalVisible}
                    animationType="fade"
                    onRequestClose={() => setIsModalVisible(false)}>

                    <TouchableOpacity style={styles.modalContainer} onPressOut={() => setIsModalVisible(false)} activeOpacity={1}>
                        <TouchableWithoutFeedback>
                            <View style={styles.imageContainer}>
                                <Image onError={(e) => console.log(e)} style={{ height: '100%', width: '100%' }} source={{ uri: imageUrl, headers: { 'Authorization': `Basic ${BASIC_AUTH}==` } }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>

                </Modal>
                : null
            }


            <TouchableOpacity onPress={() => navigation.navigate('User', { updateData: updateData, userData: data, serverURL: serverURL })}>
                <View style={[styles.container, { backgroundColor: data.PaymentStatus === "P" ? '#6d8ac9' : data.Frequancy === 'M' ? '#d09cfa' : data.Gender === 'M' ? '#e6a8a8' : '#de99b2' }]}>
                    <TouchableOpacity onPress={e => setIsModalVisible(true)}>
                        {
                            imageUrl !== null && !isImageHadErrors
                                ?
                                <Image style={styles.profilePic} source={{ uri: imageUrl, headers: { 'Authorization': `Basic ${BASIC_AUTH}==` } }} onError={() => setIsImageHadErrors(true)} />
                                :
                                <Image resizeMethod='resize' resizeMode='cover' style={styles.profilePic} source={data.Gender === 'M' ? require('../assets/Man.png') : require('../assets/Woman.png')} />
                        }
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.nameLabel}>{data.Name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.mobileNumberLabel}>{data.MobileNumber}</Text>
                        </View>
                    </View>
                    <Text style={{ position: 'absolute', right: 10, top: 0, margin: 9 }}>{data.BatchCode}</Text>
                    <TouchableOpacity style={{ height: 30, width: 30, marginLeft: 10, marginTop: 10, position: 'absolute', right: 0, margin: 15 }} onPress={ContactPerson}>
                        <Image style={{ height: 30, width: 30, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }} source={require('../assets/Call.png')} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 75,
        width: '95%',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        alignSelf: 'center',
        
    },
    profilePic: {
        height: 55,
        width: 55,
        borderRadius: 50,
        margin: 10,
    },
    nameLabel: {
        fontSize: 18,
        color: 'black',
        marginLeft: 5,
        marginTop: 10,
    },
    mobileNumberLabel: {
        fontSize: 15,
        color: 'black',
        marginLeft: 5,
        margin: 10,
        marginTop: 0,
        fontWeight : '400'
    },
    modalContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },
    imageContainer: {
        height: 270,
        width: 250,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 10,

    }
});


export default React.memo(User);