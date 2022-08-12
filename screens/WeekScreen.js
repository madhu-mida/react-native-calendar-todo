import { View } from "../components/Themed";
import CalendarStrip from 'react-native-slideable-calendar-strip';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Dimensions, ScrollView, SafeAreaView } from 'react-native';

import DateTime from 'react-native-customize-selected-date'

const WeekScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');

    function renderChildDay() {
        return <View></View>
    }

    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <DateTime
                    date={selectedDate}
                    changeDate={(date) => setSelectedDate(date)}
                    format='YYYY-MM-DD'
                    renderChildDay={(day) => renderChildDay(day)}
                />
            </View>
        </SafeAreaView>
    );
}

export default WeekScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});