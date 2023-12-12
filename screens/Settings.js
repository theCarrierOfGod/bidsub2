import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Password from '../components/settings/Password'
const Settings = ({ navigation }) => {
    return (
        <ScrollView
            style={
                styles.container
            }
        >
            <Password style={styles.menu} />
            <Pressable
                style={styles.menu}
                onPress={() => {
                    navigation.navigate('ChangePassword')
                }}
            >
                <Text>
                    Change Password
                </Text>
            </Pressable>
            <Pressable
                style={styles.menu}
                onPress={() => {
                    navigation.navigate('CreatePin')
                }}
            >
                <Text>
                    Change Transaction Pin
                </Text>
            </Pressable>
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    menu: {
        width: '100%',
        paddingVertical: 10,
        marginVertical: 5,
    }
})