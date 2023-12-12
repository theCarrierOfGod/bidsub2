import { ScrollView, ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import query from '../constants/query';
import Notice from '../components/Notice';

const Notifications = () => {
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [error, setError] = useState('')

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}notifications/${user}`);
            if (response.data.activities) {
                setData(response.data.activities)
            } else {
                setError(response.data.error)
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const isOnline = async () => {
        setSpinning(true);
        setError('')
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            isOnline();
        }
    }, [isFocused]);

    let screen = null;

    if (spinning) {
        screen = <ActivityIndicator
            animation='fade'
            size="large"
            color="#0882C5"
            style={{ margin: 35 }}
        />
    } else if (data.length === 0) {
        screen = <View style={{ alignItems: 'center', justifyContent: 'center', height: 200, width: '100' }}>
            <Image source={require('../assets/images/nodata.png')} style={{ width: 150, height: 150 }} />
        </View>
    } else {
        screen = <View style={styles.sectionBody}>
            {data.map((item, index) => (
                <Notice data={item} key={index} />
            ))}
        </View>
    }

    if (error.length > 0) {
        screen = <Text style={styles.link}>
            {error}
        </Text>
    }
    return (
        <ScrollView style={{
            backgroundColor: '#ffffff'
        }}>
            {screen}
        </ScrollView>
    )
}

export default Notifications

const styles = StyleSheet.create({
    billSection: {
        marginVertical: 30,
        marginHorizontal: 10,
        flex: 1,
    },
    sectionBody: {
        flex: 0,
        justifyContent: 'center',
        marginVertical: 20,
        paddingHorizontal: 7,
        width: '100%',
        color: 'black',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap'
    },
    link: {
        color: 'orangered',
        fontFamily: 'monospace',
        fontSize: 22,
        textAlign: 'center',
        marginVertical: 26,
        fontWeight: 'bold'
    },
    rightHeadText: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold'
    },
})