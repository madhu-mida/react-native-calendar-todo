import { View } from "../components/Themed";
import CalendarStrip from 'react-native-slideable-calendar-strip';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Dimensions, ScrollView, SafeAreaView, TextInput } from 'react-native';

import DateTime from 'react-native-customize-selected-date';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const CreateEventScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const [text, onChangeText] = React.useState(null);

    const [title, setTitle] = React.useState('');

    const [description, setDescription] = React.useState('');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [typeItems, setTypeItems] = useState([
        { label: 'Personal', value: 'personal' },
        { label: 'Work', value: 'work' }
    ]);

    const [openPriority, setOpenPriority] = useState(false);
    const [priority, setPriority] = useState(null);
    const [priorityItems, setPriorityItems] = useState([
        { label: 'High', value: 'high' },
        { label: 'Low', value: 'low' }
    ]);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setSelectedTime(moment(date).format('hh:mm A'));
        hideDatePicker();
    };

    function renderChildDay() {
        return <View></View>
    }

    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
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
                    />
                </View>

                <View style={{
                    zIndex: 1000, elevation: 1000,
                    display: "flex",
                    width: '95%'
                }}>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        placeholder="Select Priority"
                        style={{ margin: 12, width: '100%' }}
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
                    />
                </View>

                <View style={{ zIndex: 1000, elevation: 1000 }}>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        placeholder="Select Type"
                        style={{ margin: 5 }}
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
                        onTouchStart={showDatePicker}
                        value={selectedTime}
                        placeholder="Time Slot"
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="time"
                        date={selectedDate ? new Date(selectedDate) : new Date()}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
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
    },
});