import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from '@react-navigation/native';


export default function TransactionTable({ data, navigation }) {
    const [links, setLinks] = useState('');

    const checkLink = () => {
        if (data.type === "data") {
            setLinks('/DataReceipt');
        }
        if (data.type === "airtime") {
            setLinks('/AirtimeReceipt');
        }
        if (data.type === "cable") {
            setLinks('/CableReceipt');
        }
        if (data.type === "education") {
            setLinks('/EduReceipt');
        }
        if (data.type === "electricity") {
            setLinks('/ElectricityReceipt');
        }
        if (data.type === "wallet_funding") {
            setLinks(null)
        }
    }

    useEffect(() => {
        checkLink();
    }, [])
    return (
        <View style={[styles.body]}>
            <View style={[styles.jCenter, styles.f1, styles.mr2]}>
                <Text style={styles.title}>
                    {data.type}
                </Text>
                <Text style={styles.normaltitle}>
                    {data.created_at}
                </Text>
            </View>
            <View style={[styles.center, styles.f1]}>
                <Text style={styles.title}>
                    {data.status}
                </Text>
                <Text style={styles.normaltitle}>
                    <MaterialCommunityIcons name="currency-ngn" size={15} color="black" />
                    {data.amount}
                </Text>
            </View>
            {links === null ? null : (
                <Link
                    to={links}
                    onPress={() => {
                        AsyncStorage.setItem('tid', data.uid);
                    }}
                    style={[styles.viewButton, styles.f0]}
                >
                    <Text
                        style={styles.viewButton}
                    >
                        View
                    </Text>
                </Link>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        marginVertical: 7,
        padding: 10,
        flexDirection: "row",
        flexWrap: 'wrap',
    },
    jCenter: {
        flex: 1,
        justifyContent: 'center',
        marginRight: '50'
    },
    title: {
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 4,
    },
    itemIcom: {
        marginVertical: 12,
    },
    itemTitle: {
        color: 'black',
        fontFamily: 'Ubuntu-Medium'
    },
    normaltitle: {
        // color: 'white'
    },
    center: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    viewButton: {
        backgroundColor: 'darkslateblue',
        padding: 5,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 22,
        borderRadius: 15,
        color: 'white',
        // width: 100,
        marginTop: 15,
        textAlign: 'center'
    },
    f0: {
        flexGrow: 0
    },
    f1: {
        flexGrow: 1
    },
    mr2: {
        marginRight: 20
    }
})