import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Notice({ data }) {
    return (
        <View style={styles.body}>
            <View
                style={[styles.jCenter,]}
            >
                <Text style={styles.title}>
                    {data.detail}
                </Text>
            </View>
            <View
                style={[styles.jCenter,]}
            >
                <Text>
                    {data.date}
                </Text>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        marginVertical: 3,
        paddingHorizontal: 7,
        paddingVertical: 30,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    jCenter: {
        justifyContent: 'center',
        color: '#fff'
    },
    title: {
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 4
    },
    itemIcom: {
        marginVertical: 12,
    },
    itemTitle: {
        color: 'white',
        fontFamily: 'Ubuntu-Medium'
    }
})