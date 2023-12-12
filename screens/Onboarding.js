import React from 'react'
import { StyleSheet, Text, Pressable, View, Image } from 'react-native';

const OnBoarding = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20
            }}
        >
            <Image
                source={require('../assets/images/logo.jpg')}
                style={{
                    width: 150,
                    height: 150,
                    marginVertical: 20,
                }}
            />
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 'bold'
                }}
            >
                Welcome to Bidsub!
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.3)',
                    marginVertical: 20
                }}
            >
                Join the Bidsub community today and simplify your bills, subscriptions, and betting payments. To get started please sign in to your account or create a new one.
            </Text>
            <View
                style={{
                    flex: 0,
                    width: '100%',
                    height: 70
                }}
            >
                <Pressable
                    onPress={() => navigation.navigate('SignUp')}
                    style={styles.upbutton}
                >
                    <Text
                        style={{ color: 'white', fontSize: 16, fontWeight: 700 }}
                    >
                        Sign Up
                    </Text>
                </Pressable>
            </View>

            <Pressable
                style={styles.button}
                onPress={() => navigation.replace('SignIn')}
            >
                <Text style={{ color: '#004aad', fontSize: 16, fontWeight: 700 }}>Sign In</Text>
            </Pressable>
            <Text
                style={{
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.3)',
                    marginTop: 10,
                }}
            >
                By tapping <Text style={styles.stress}>"Create account"</Text> or <Text style={styles.stress}>Sign in</Text>, you agree to our terms. Learn more about how we process your data in our privacy policy and cookies policy.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#004aad',
        borderWidth: 2,
        borderRadius: 10,
        color: '#004aad',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 0
    },
    upbutton: {
        width: '100%',
        height: 50,
        backgroundColor: '#004aad',
        borderRadius: 10,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 10
    },
    stress: {
        color: '#004aad',
        fontWeight: 'bold'
    }
})

export default OnBoarding

