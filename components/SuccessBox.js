import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient'

const SuccessBox = ({ message }) => {

    return (
        <LinearGradient
            colors={['#004aad', '#020024']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
        >
            <Text
                style={styles.buttonText}
            >{message}</Text>
        </LinearGradient>
    )
}

export default SuccessBox

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 30,
    },
    box: {
        width: '100%',
        height: 200,
    },
    button: {
        marginTop: 50,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 24
    }
});