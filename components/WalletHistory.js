import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import query from '../constants/query';
import TableStructure from './TableStructure';
import { useIsFocused } from '@react-navigation/native';

const WalletHistory = ({ navigation, refreshing }) => {
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [error, setError] = useState('')

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}wallet/fund/history?username=${user}`);
            if (response.data.wallet) {
                setData(response.data.wallet)
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
    }, [isFocused])

    useEffect(() => {
        if (refreshing) {
            isOnline();
        }
    }, [refreshing]);

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
                <TableStructure data={item} key={index} />
            ))}
        </View>
    }
    if (error.length > 0) {
        screen = <View style={{ alignItems: 'center', justifyContent: 'center', height: 200, width: '100' }}>
        <Image source={require('../assets/images/nodata.png')} style={{ width: 150, height: 150 }} />
    </View>
    }

    return (
        <View>
            <View
                style={styles.billSection}
            >
                <View
                    style={styles.sectionHeader}
                >
                    <Text style={styles.rightHeadText}> Wallet history </Text>
                </View>
                {screen}
                {/* {spinning ? (
                    <ActivityIndicator
                        animation='fade'
                        size="large"
                        color="#0882C5"
                        style={{ margin: 35 }}
                    />
                ) : (
                    <>
                        <View style={styles.sectionBody}>
                            {data.map((item, index) => (
                                <TableStructure data={item} key={index} />
                            ))}
                        </View>
                    </>
                )}
                {error.length > 0 ? (
                    <Text style={styles.link}>
                        {error}
                    </Text>
                ) : null} */}
            </View>
        </View>
    )
}

export default WalletHistory

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
        color: 'grey',
        fontFamily: 'monospace',
        fontSize: 15,
        textAlign: 'center'
    },
    rightHeadText: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold'
    },
})