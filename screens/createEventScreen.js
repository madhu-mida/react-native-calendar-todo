import { View, Text, useThemeColor } from "../components/Themed";
import CalendarStrip from 'react-native-slideable-calendar-strip';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';

import DateTime from 'react-native-customize-selected-date';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';


const CreateEventScreen = ({ navigation, route }) => {

    const URL = "https://ms-95-rn-calendar-todo.herokuapp.com/";

    const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');


    const [selectedDate, setSelectedDate] = useState(route.params?.editEvent?.dateString ? route.params.editEvent.dateString : moment(new Date()).format('YYYY-MM-DD'));

    const [text, onChangeText] = React.useState(null);

    const [title, setTitle] = React.useState(route.params?.editEvent?.title ? route.params.editEvent.title : '');

    const [description, setDescription] = React.useState(route.params?.editEvent?.description ? route.params.editEvent.description : '');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(route.params?.editEvent?.type ? route.params.editEvent.type : null);
    const [typeItems, setTypeItems] = useState([
        { label: 'Personal', value: 'personal' },
        { label: 'Work', value: 'work' }
    ]);

    const [openPriority, setOpenPriority] = useState(false);
    const [priority, setPriority] = useState(route.params?.editEvent?.priority ? route.params.editEvent.priority : null);
    const [priorityItems, setPriorityItems] = useState([
        { label: 'High', value: 'high' },
        { label: 'Low', value: 'low' }
    ]);

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [selectedStartTime, setSelectedStartTime] = useState(route.params?.editEvent?.startTime ? route.params.editEvent.startTime : '');

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleStartConfirm = (date) => {
        setSelectedStartTime(moment(date).format('hh:mm A'));
        hideStartDatePicker();
    };


    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState(route.params?.editEvent?.endTime ? route.params.editEvent.endTime : '');

    const showEndDatePicker = () => {
        if (selectedStartTime) {
            setEndDatePickerVisibility(true);
        } else {
            Alert.alert(
                "Warning",
                "Please Select a Start Time",
                [
                    { text: "OK" }
                ]
            );
        }
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    const handleEndConfirm = (date) => {
        let startDate = moment(selectedDate + ' ' + selectedStartTime, "YYYY-MM-DD hh:mm A");
        let endTime = moment(date).format('hh:mm A');
        let endDate = moment(selectedDate + ' ' + endTime, "YYYY-MM-DD hh:mm A");
        //console.log("startDate :: ", startDate, endDate, endDate.isSameOrBefore(startDate));
        if (endDate.isSameOrBefore(startDate)) {
            Alert.alert(
                "Error",
                "End Time must be after Start Time",
                [
                    { text: "OK" }
                ]
            );
        } else {
            setSelectedEndTime(endTime);
            hideEndDatePicker();
        }
    };

    function renderChildDay() {
        return <View></View>
    }

    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])

    async function handleClick() {

        let newEvent = {
            date: new Date(selectedDate),
            dateString: selectedDate,
            title: title,
            description: description,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            type: value,
            priority: priority
        }

        let actionEvent = null;
        console.log("new event", newEvent);
        if (route.params?.editEvent) {
            //edit
            console.log("edit id", route.params?.editEvent._id);
            actionEvent = await fetch(URL + "event/" + route.params.editEvent._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(newEvent),
            }).then(res => res.json());
        } else {
            actionEvent = await fetch(URL + "event", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(newEvent),
            }).then(res => res.json());
        }
        console.log("actionEvent", actionEvent)

        if (actionEvent) {
            clearStates();
            Alert.alert(
                "Success",
                "Event Saved Successfully",
                [
                    { text: "OK", onPress: () => navigation.navigate("Calendar") }
                ]
            );
        }
    }

    function clearStates() {
        setSelectedDate('');
        setTitle('');
        setDescription('');
        setValue(null);
        setPriority(null);
        setSelectedStartTime('');
        setSelectedEndTime('');
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
                <View style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{ flex: 0.4, justifyContent: 'left', flexDirection: 'row', marginLeft: 8 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Calendar')}>
                            <Ionicons name="arrow-back-circle-sharp" size={26} color={color} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', fontWeight: 'bold' }}>New Event</Text>
                    </View>
                </View>
                <View style={styles.container}>

                    <DateTime
                        date={selectedDate}
                        changeDate={(date) => setSelectedDate(date)}
                        format='YYYY-MM-DD'
                        renderChildDay={(day) => renderChildDay(day)}
                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => setTitle(val)}
                        value={title}
                        placeholder="Title"
                        color={color}
                    />
                </View>

                <View style={{
                    zIndex: 1000, elevation: 1000,
                    // display: "flex",
                    // width: '95%'
                }}>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        placeholder="Select Priority"
                        style={{
                            margin: 5, borderColor: 'darkgrey', width: '94%',
                            alignSelf: 'center', borderRadius: 4,
                        }}
                        open={openPriority}
                        value={priority}
                        items={priorityItems}
                        setOpen={setOpenPriority}
                        setValue={setPriority}
                        setItems={setPriorityItems}
                        dropDownDirection="BOTTOM"
                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => setDescription(val)}
                        value={description}
                        placeholder="Description"
                        color={color}
                    />
                </View>

                <View style={{
                    zIndex: 1000, elevation: 1000,
                }}>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        placeholder="Select Type"
                        style={{
                            margin: 5, borderColor: 'darkgrey', width: '94%',
                            alignSelf: 'center', borderRadius: 4,
                        }}
                        open={open}
                        value={value}
                        items={typeItems}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setTypeItems}
                        dropDownDirection="BOTTOM"
                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        onTouchStart={showStartDatePicker}
                        value={selectedStartTime}
                        placeholder="Start Time"
                        color={color}
                        editable={false}
                    />
                    <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="time"
                        date={selectedDate ? new Date(selectedDate) : new Date()}
                        onConfirm={handleStartConfirm}
                        onCancel={hideStartDatePicker}
                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        onTouchStart={showEndDatePicker}
                        value={selectedEndTime}
                        placeholder="End Time"
                        color={color}
                        editable={false}
                    />
                    <DateTimePickerModal
                        isVisible={isEndDatePickerVisible}
                        mode="time"
                        date={selectedDate ? new Date(selectedDate) : new Date()}
                        onConfirm={handleEndConfirm}
                        onCancel={hideEndDatePicker}
                    />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <TouchableOpacity
                        onPress={() => handleClick()}
                        style={{
                            backgroundColor: '#b81a29', height: 35,
                            margin: 12,
                            // borderWidth: 1,
                            padding: 10,
                            width: '20%',
                            borderRadius: 4,
                            margin: 'auto',
                            textAlign: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginBottom: 10
                        }}>

                        <Text style={{ fontSize: 14, color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.eventForm}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Date</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={onChangeText}
                        value={selectedDate}
                        placeholder="useless placeholder"
                    />
                </View>

                <Text>Title</Text>
                <Text>Description</Text>
                <Text>Type</Text>
                <Text>Priority</Text>
                <Text>Time Slot</Text>


                <View>

                </View>
            </View> */}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CreateEventScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        borderColor: 'darkgrey'
    },
});