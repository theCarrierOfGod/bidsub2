const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log("Authorization status:", authStatus);
    }
};

// Set up the notification handler for the app
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Handle user clicking on a notification and open the screen
const handleNotificationClick = async (response) => {
    const screen = response?.notification?.request?.content?.data?.screen;
    if (screen !== null) {
        navigation.navigate(screen);
    }
};

// Listen for user clicking on a notification
const notificationClickSubscription =
    Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
    );

// Handle user opening the app from a notification (when the app is in the background)
messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
        "Notification caused app to open from background state:",
        remoteMessage.data.screen,
        navigation
    );
    if (remoteMessage?.data?.screen) {
        navigation.navigate(`${remoteMessage.data.screen}`);
    }
});

// Check if the app was opened from a notification (when the app was completely quit)
messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
        if (remoteMessage) {
            console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
            );
            if (remoteMessage?.data?.screen) {
                navigation.navigate(`${remoteMessage.data.screen}`);
            }
        }
    });

// Handle push notifications when the app is in the background
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
    };

    // Schedule the notification with a null trigger to show immediately
    await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
    });
});

// Handle push notifications when the app is in the foreground
const handlePushNotification = async (remoteMessage) => {
    const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
    };

    // Schedule the notification with a null trigger to show immediately
    await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
    });
};

// Listen for push notifications when the app is in the foreground
const unsubscribe = messaging().onMessage(handlePushNotification);



import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import App0 from './App0';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

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
                // response.data.notifications.forEach(notice => {
                //     schedulePushNotification(notice.title, notice.body);
                //     axios.get(`${query.baseUrl}upExpoNots/${notice.title}/${username}`);
                // });
            }
        } catch (error) {
            Alert.alert(error);
            console.log("This error")
        }
    }

    const getNotices = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        CallNot(value);
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    setTimeout(() => {
        getNotices();
    }, 10000);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => { setExpoPushToken(token); });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        getNotices();
        schedulePushNotification('Bidsub Communications', 'Welcome to bidsub');
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <App0 />
    );
}
