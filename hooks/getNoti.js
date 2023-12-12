import { useState, useEffect } from "react";
import axios from "axios";
import { useHook } from "./Hook";
import { useAuth } from "./Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const getNoti = (endpoint, query) => {
    const hook = useHook();
    const auth = useAuth()
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function schedulePushNotification(title, body) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { data: 'Add here' },
            },
            trigger: { seconds: 2 },
        });
    }

    const CallNot = async (username) => {
        try {
            const response = await axios.get(`${query.baseUrl}expoNots/${username}`);
            if (response.data.notifications.length > 0) {
                Alert.alert("There are " + response.data.notifications.length + " notifications");
                response.data.notifications.forEach(notice => {
                    schedulePushNotification(notice.title, notice.body);
                    axios.get(`${query.baseUrl}upExpoNots/${notice.title}/${username}`);
                });
            }
        } catch (error) {
            Alert.alert(error);
            console.log("This error")
        }
    }

    async function getNotices() {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        CallNot(value);
                    } else {
                        alert('No user logged in')
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getNotices();
        alert("called")
    }, []);

    const refetch = () => {
        fetchData();
    };

    return { data, isLoading, error, refetch };
};

export default getNoti;