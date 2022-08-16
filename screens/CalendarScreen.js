import { View, Text } from "../components/Themed";
import CalendarStrip from 'react-native-slideable-calendar-strip';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SimpleLineIcons, Fontisto, Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import moment from 'moment';

import * as Location from "expo-location";

const CalendarScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [activeIndex, setActiveIndex] = useState(0);

    const SLIDER_WIDTH = Dimensions.get('window').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.5);
    const ITEM_HEIGHT = Math.round(SLIDER_WIDTH * 0.4);

    const currentDate = new Date();

    //console.log(currentDate)

    const carouselRef = useRef(null);

    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    const date = currentDate.toLocaleDateString('en-us', options);

    let currentDateElements = date.split(',');

    let API_KEY = "a015ab34c13dab2b0522affa8d4ab3ce";

    let NEWS_API_KEY = "6201d35dbc8f4b23a8344dd6823efaad"

    const [weatherState, setWeatherState] = useState(null);

    const [newsDataState, setNewsDataState] = useState(null);

    let today = new Date();
    // let day = today.getDay();
    //let date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();

    const [events, setEvents] = useState(null);

    const URL = "https://ms-95-rn-calendar-todo.herokuapp.com/";

    const getTodayEvents = async () => {
        const data = await fetch(URL + "getEventByDate/" + moment().format('YYYY-MM-DD')).then(res => res.json());
        //console.log("data", data);
        setEvents(data)
    }

    async function getWeatherData(lat, long) {
        // let lat = lat;
        // let long = long;
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`;

        const weatherData = await fetch((weatherURL)).then(
            res => res.json()
        );
        //console.log(weatherData)
        setWeatherState(weatherData)
        //console.log("WEATHERSTATE", weatherState)
    }

    async function getNewsData() {
        const newsURL = `https://newsapi.org/v2/top-headlines?pageSize=10&country=us&apiKey=${NEWS_API_KEY}`;

        const newsData = await fetch((newsURL)).then(
            res => res.json()
        );

        //console.log("NEWSDATA", newsData)
        setNewsDataState(newsData.articles);
    }


    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            //console.log(location);
            getWeatherData(location.coords.latitude, location.coords.longitude);
            getNewsData();
            getTodayEvents();
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const arr = ['pink']

    function renderItem({ item, index }) {
        let color = arr[0];
        return (
            <>
                <Card style={{
                    borderRadius: 10,
                    margin: 5
                }} >
                    <CardImage source={{ uri: item.urlToImage }} />
                    <CardTitle
                        subtitle={item.source.name}
                    />
                    <CardContent text={item.title.split('-')[0]} />
                </Card>
            </>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <LinearGradient colors={['rgb(242, 112, 156)', 'rgb(255, 148, 114)']} style={styles.today}>
                    <View style={{ backgroundColor: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                        <SimpleLineIcons name="notebook" size={100} color="black" />
                    </View>
                    <View style={{ backgroundColor: 'transparent', marginBottom: 10 }}>
                        <Text style={styles.topNoteDate}>
                            {date}
                        </Text>
                        {weatherState && <Text>
                            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>{weatherState.name},{weatherState.main.temp}&deg;F</Text>
                        </Text>}
                        {weatherState && <Text>

                            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>{weatherState.weather[0].main}</Text>
                        </Text>}
                    </View>
                </LinearGradient>

                {/* <View style={styles.planner}>
                    <Text style={styles.plannerNote}>Preview of your day
                    </Text>
                </View> */}

                <TouchableOpacity
                    onPress={() => {
                        if (events) {
                            navigation.navigate('Events', { eventSource: 'day' })
                        }
                    }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={['rgb(82,82,166)', 'rgb(120,123,200)']} style={styles.preview}>
                        <View style={styles.preview}>
                            {events ? <Text style={styles.previewNote}>{events.length} event(s) waiting for you today!!</Text> : <Text style={styles.previewNote}> Nothing planned for today. Lucky you!
                            </Text>}
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.planner}>
                    <Text style={styles.plannerNote}>Explore your planner
                    </Text>
                </View>

                {/* <View style={styles.calenders}> */}
                <View style={styles.calendarStyles}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Events', { eventSource: 'day' })}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <FontAwesome5 name="calendar-day" size={65} color="rgb(120,123,180)" />
                            <Text style={{ textAlign: 'center', margin: 5, color: 'black', fontWeight: '600' }}>Today</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Events', { eventSource: 'week' })}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <FontAwesome5 name="calendar-week" size={65} color="rgb(120,123,180)" />
                            <Text style={{ textAlign: 'center', margin: 5, color: 'black', fontWeight: '600' }}>Week</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Events', { eventSource: 'month' })}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <FontAwesome5 name="calendar-alt" size={65} color="rgb(120,123,180)" />
                            <Text style={{ textAlign: 'center', margin: 5, color: 'black', fontWeight: '600' }}>Month</Text>
                        </View>
                    </TouchableOpacity>


                </View >
                {/* </View> */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Create')}>
                    < View style={styles.mode} >
                        <Text style={styles.modeText}>New Event</Text>
                    </View >
                </TouchableOpacity>

                {weatherState && <View style={{
                    margin: 10,
                    borderRadius: 8, height: 100, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'
                }}>
                    <View style={{ margin: 5 }}>
                        <Text style={{ fontSize: 28 }}>{weatherState.main.temp}&deg;F</Text>
                        <Text style={{ textAlign: 'center' }}>Feels Like:</Text>
                        <Text style={{ textAlign: 'center' }}>{weatherState.main.feels_like}</Text>
                    </View>
                    <View style={{ margin: 5 }}>
                        {weatherState.weather[0].description && weatherState.weather[0].description.includes("cloud") && <Fontisto name="day-cloudy" size={60} color="black" />}
                        {weatherState.weather[0].description && weatherState.weather[0].description.includes("rain") && <Ionicons name="rainy" size={60} color="black" />}
                        {weatherState.weather[0].description && weatherState.weather[0].description.includes("sun") && <Ionicons name="sunny" size={60} color="black" />}
                    </View>
                    <View style={{ margin: 5 }}>
                        <Text style={{ fontSize: 25 }}>{weatherState.weather[0].description}</Text>
                        <Text style={{ textAlign: 'center' }}>Humidity: {weatherState.main.humidity}&deg;F</Text>
                        {/* <Text>Temperature-Max: {weatherState.main.temp_max}&deg;F</Text>
                    <Text>Temperature-Min: {weatherState.main.temp_min}&deg;F</Text> */}
                    </View>


                </View>}

                {/* <CalendarStrip style={styles.calender}
                // isChinese
                showWeekNumber
                // showChineseLunar
                selectedDate={selectedDate}
                onPressDate={(date) => {
                    setSelectedDate(date);
                }}
                onPressGoToday={(today) => {
                    setSelectedDate(today);
                }}
                onSwipeDown={() => {
                    alert('onSwipeDown');
                }}
                markedDate={['2018-05-04', '2018-05-15', '2018-06-04', '2018-05-01']}
                weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
            /> */}

                {
                    newsDataState && <Carousel
                        layout={"default"}
                        ref={carouselRef}
                        data={newsDataState}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        renderItem={renderItem}
                        activeSlideAlignment={'start'}
                        onSnapToItem={index => setActiveIndex(index)} />
                }
            </ScrollView >
        </SafeAreaView >
    );
}

export default CalendarScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        padding: 5,
        backgroundColor: 'rgb(237,240,247)',
    },
    topNoteDate: {
        fontSize: 22,
        color: 'white',
        marginTop: 30,
    },
    today: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        //height: 150,
        borderRadius: 8,
        display: 'flex',
        //flex: 1,
        flexDirection: 'row',
        margin: 10
    },
    planner: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: 60,
        backgroundColor: 'transparent',
    },
    preview: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: 60,
        backgroundColor: 'transparent',
        //borderWidth: 1,
        //borderColor: 'black',
        color: 'white',
        margin: 5,
        borderRadius: 8
    },
    plannerNote: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: 'black'
    },
    previewNote: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: 'white'
    },
    calendars: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    mode: {
        backgroundColor: 'rgb(82,82,166)',
        width: '94 %',
        margin: 'auto',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        alignSelf: 'center',
    },
    calender: {
        // marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarStyles: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-around",
        margin: 17,
        backgroundColor: 'transparent',
    },
    modeText: {
        fontSize: 16,
        color: 'white'
    }
});