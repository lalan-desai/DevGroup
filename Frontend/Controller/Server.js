import AsyncStorage from '@react-native-async-storage/async-storage';

const GetServerURL = async () => {
    try {
        const value = await AsyncStorage.getItem('server_url')
        if (value !== null) {
            return value;
        }
        else {
            return '';
        }
    } catch (e) {
        console.log(e);
    }
}

export default GetServerURL;
