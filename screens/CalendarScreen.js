import { View } from "../components/Themed";
import CalendarStrip from 'react-native-slideable-calendar-strip';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SimpleLineIcons, Fontisto, Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'


import * as Location from "expo-location";

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [activeIndex, setActiveIndex] = useState(0);

    const SLIDER_WIDTH = Dimensions.get('window').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.5);
    const ITEM_HEIGHT = Math.round(SLIDER_WIDTH * 0.4);

    const carouselItems = [
        {
            title: "Item 1",
            text: "Text 1",
        },
        {
            title: "Item 2",
            text: "Text 2",
        },
        {
            title: "Item 3",
            text: "Text 3",
        },
        {
            title: "Item 4",
            text: "Text 4",
        },
        {
            title: "Item 5",
            text: "Text 5",
        },
    ];

    const currentDate = new Date();

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


    async function getWeatherData(lat, long) {
        // let lat = lat;
        // let long = long;
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`;

        const weatherData = await fetch((weatherURL)).then(
            res => res.json()
        );
        console.log(weatherData)
        setWeatherState(weatherData)
        console.log("WEATHERSTATE", weatherState)
    }

    async function getNewsData() {
        const newsURL = `https://newsapi.org/v2/top-headlines?pageSize=10&country=us&apiKey=${NEWS_API_KEY}`;

        const newsData = await fetch((newsURL)).then(
            res => res.json()
        );

        console.log("NEWSDATA", newsData)
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
            console.log(location);
            getWeatherData(location.coords.latitude, location.coords.longitude);
            getNewsData();
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

                <View style={styles.planner}>
                    <Text style={styles.plannerNote}>Preview of your day
                    </Text>
                </View>

                <View style={styles.preview}>
                    <Text style={styles.plannerNote}> Nothing planned for today. Lucky you!
                    </Text>
                </View>


                <View style={styles.planner}>
                    <Text style={styles.plannerNote}>Explore your planner
                    </Text>
                </View>
                {/* <View style={styles.calenders}> */}
                <View style={styles.calendarStyles}>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <FontAwesome5 name="calendar-day" size={65} color="rgb(120,123,180)" />
                        <Text style={{ textAlign: 'center', margin: 5 }}>Today</Text>
                    </View>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <FontAwesome5 name="calendar-week" size={65} color="rgb(120,123,180)" />
                        <Text style={{ textAlign: 'center', margin: 5 }}>Week</Text>
                    </View>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <FontAwesome5 name="calendar-alt" size={65} color="rgb(120,123,180)" />
                        <Text style={{ textAlign: 'center', margin: 5 }}>Month</Text>
                    </View>


                </View>
                {/* </View> */}
                <View style={styles.mode}>
                    <Text style={styles.modeText}>Focus Mode</Text>
                </View>

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

                {newsDataState && <Carousel
                    layout={"default"}
                    ref={carouselRef}
                    data={newsDataState}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    renderItem={renderItem}
                    activeSlideAlignment={'start'}
                    onSnapToItem={index => setActiveIndex(index)} />}
            </ScrollView>
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
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'black',
        margin: 5,
        borderRadius: 8
    },
    plannerNote: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold'
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