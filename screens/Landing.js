import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LaunchCarousel from '../components/launch/LaunchCarousel';

export default function Landing({ navigation }) {
    const width = Dimensions.get('window').width;
    return (
        <SafeAreaView>
            <View style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <LaunchCarousel navigation={navigation} />
            </View>
        </SafeAreaView>
    )
}