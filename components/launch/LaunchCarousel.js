import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native';
import data from './data';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LaunchCarousel = ({ navigation }) => {
    const isCarousel = useRef(null)
    const [index, setIndex] = useState(0);

    const isFocused = useIsFocused();
    const [existing, setExisting] = useState(false);
    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('existing')
                .then(value => {
                    if (value != null) {
                        setExisting(true);
                    } else {
                        setExisting(false);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isOnline();
    }, [isFocused]);

    const checkNext = () => {
        if (data.length === index + 1) {
            if (existing) {
                navigation.replace('Welcome')
            } else {
                navigation.replace('OnBoarding')
            }
        } else {
            setIndex(index + 1)
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: '#fff',
                alignItems: 'center',
            }}
        >
            <View
                style={styles.body}
            >
                <Carousel
                    layout="default"
                    layoutCardOffset={9}
                    ref={isCarousel}
                    data={data}
                    renderItem={CarouselCardItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    inactiveSlideShift={0}
                    useScrollView={true}
                    onSnapToItem={(index) => setIndex(index)}
                    enableSnap={true}
                    style={{
                        color: 'white'
                    }}
                />

                <Pagination
                    dotsLength={data.length}
                    activeDotIndex={index}
                    carouselRef={isCarousel}
                    dotStyle={{
                        width: 18,
                        height: 7,
                        borderRadius: 5,
                        margin: 0,
                        backgroundColor: '#004aad'
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    inactiveDotStyle={{
                        backgroundColor: '#004aad',
                        width: 15,
                        height: 7
                    }}
                    tappableDots={true}
                />

                {data.length === index + 1 ? (
                    <Pressable
                        style={styles.button}
                        onPress={() => checkNext()}
                    >
                        <Ionicons name="arrow-forward-outline" size={40} style={{ padding: 10 }} color="#fff" />
                    </Pressable>
                ) : (
                    <View style={{ height: 60, marginBottom: 70 }}></View>
                )}
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 0,
        width: '100%',
        alignItems: 'center',
        height: 700,
        justifyContent: 'center'
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: '#004aad',
        borderRadius: 200,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginBottom: 70
    }
})

export default LaunchCarousel