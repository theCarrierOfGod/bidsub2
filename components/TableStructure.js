import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function TableStructure({ data }) {
    return (
        <View style={styles.body}>
            <View
                style={[styles.jCenter,]}
            >
                <Text style={styles.title}>
                    {data.transaction_id}
                </Text>
                <Text>
                    {data.created_at}
                </Text>
            </View>
            {/* <View
                style={[styles.jCenter,]}
            >
                <Text style={styles.title}>
                    STATUS
                </Text>
                <Text>
                    {data.status}
                </Text>
            </View> */}
            <View
                style={[styles.jCenter,]}
            >
                <Text style={styles.title}>
                {data.status}
                </Text>
                <Text style={styles.title}>
                    <MaterialCommunityIcons name="currency-ngn" size={15} color="black" />
                    {data.amount}
                </Text>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginVertical: 3,
        padding: 7,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    jCenter: {
        justifyContent: 'center',
        color: '#000022'
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
        color: 'black',
        fontFamily: 'Ubuntu-Medium'
    }
})