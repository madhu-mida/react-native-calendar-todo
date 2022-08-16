import { useEffect, useState } from "react";
import moment from 'moment';
import { Text } from "../components/Themed";
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

{/* <MaterialIcons name="edit" size={24} color="black" />
<MaterialIcons name="delete" size={24} color="black" /> */}

const EventsScreen = ({ navigation, route }) => {

    let colors = ['#D9D7F1', '#FFFDDE', '#E7FBBE', '#FFCBCB', '#B2C8DF']

    const [events, setEvents] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const URL = "https://ms-95-rn-calendar-todo.herokuapp.com/";

    const getEventsByDate = async () => {
        const data = await fetch(URL + "getEventByDate/" + moment().format('YYYY-MM-DD')).then(res => res.json());
        console.log("data", data);
        setEvents(data)
    }

    const getEventsByDateRange = async (indicator) => {
        let startDateMoment = moment().startOf('week');
        let endDateMoment = moment().endOf('week');

        if (indicator === 'month') {
            startDateMoment = moment().startOf('month');
            endDateMoment = moment().endOf('month');

        }
        setStartDate(startDateMoment.format('MM-DD-YYYY'));
        setEndDate(endDateMoment.format('MM-DD-YYYY'));
        const data = await fetch(`${URL}getEventByDateRange/${startDateMoment.format('YYYY-MM-DD')}/${endDateMoment.format('YYYY-MM-DD')}`).then(res => res.json());
        setEvents(data)
    }

    async function handleDelete(eventId) {

    }

    async function handleEdit(event) {
        console.log("edit event :: ", event);
        navigation.navigate('Create', { editEvent: event });
    }

    async function handleDelete(eventId) {
        console.log(eventId)
        let deletedEvent = await fetch((URL + "event/" + eventId), {
            method: "DELETE",
        }).then(res => res.json());
        console.log(deletedEvent)


        let tempEventArray = events.filter(function (element) {
            return element._id != eventId;
        })
        console.log("tempEventArray", tempEventArray)
        setEvents(tempEventArray)
    }


    function getRandomInt() {
        let r = Math.floor(Math.random() * colors.length);
        return colors[r];
    }


    useEffect(() => {
        if (route.params.eventSource === 'day') {
            getEventsByDate()
        }
        else if (route.params.eventSource === 'week') {
            getEventsByDateRange()
        }
        else if (route.params.eventSource === 'month') {
            getEventsByDateRange('month')
        }

    }, [])

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', width: '90%' }}>

                    <View style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        //justifyContent: 'space-around',
                        alignItems: 'center',
                        width: '100%'
                        // alignSelf: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Calendar')
                            }}>
                            <View style={{ flex: 0.5 }}>
                                <Ionicons name="ios-home" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                        <View style={{ alignSelf: 'center', flex: 1 }}>
                            <Text style={{ textAlign: 'center' }}>Events</Text>

                            {route.params.eventSource === 'day' && <Text style={{ textAlign: 'center' }}>{moment().format('MM-DD-YYYY')}</Text>}

                            {(route.params.eventSource === 'week' || route.params.eventSource === 'month') && startDate && endDate && <Text style={{ textAlign: 'center' }}>{startDate} - {endDate}</Text>}
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Create')
                            }}>
                            <View style={{ flex: 0.5, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <Ionicons name="ios-create" size={26} color="black" />
                            </View>
                        </TouchableOpacity>

                    </View>
                    {events && events.map((event) => {
                        return (
                            <View style={{ maxHeight: 200 }} key={`view-${event._id}`}>
                                <Card style={{
                                    borderRadius: 10,
                                    margin: 5,
                                    width: '100%',
                                    backgroundColor: getRandomInt(),

                                }} key={`card-${event._id}`}>
                                    <View style={{
                                        width: '100%', padding: 5,
                                        display: 'flex', flexDirection: 'row',
                                        marginTop: 5, marginLeft: 11
                                    }}>
                                        <View style={{ marginRight: 15 }}>
                                            <Text style={styles.labelTags}>{event.priority}</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.labelTags}>{event.type}</Text>
                                        </View>
                                    </View>
                                    <CardTitle
                                        title={event.title}
                                        subtitle={`${moment(event.dateString).format('MM-DD-YYYY')}   ${event.startTime}-${event.endTime}`}
                                        key={`card-title-${event._id}`}
                                        style={{ paddingTop: 5 }}
                                        titleStyle={{ margin: 0 }}
                                    //subtitleStyle={{ marginTop: 5 }}
                                    />

                                    <CardContent text={event.description}
                                        key={`card-content-${event._id}`}
                                        style={{ paddingBottom: 0, alignItems: 'center' }}
                                        textStyle={{ color: 'black' }}
                                    />

                                    <CardAction
                                        separator={true}
                                        inColumn={false}
                                        key={`card-action-${event._id}`}
                                        style={{
                                            display: 'flex',
                                            flex: 1, justifyContent: 'center'
                                        }}>

                                        <TouchableOpacity
                                            onPress={() => { handleEdit(event) }}
                                            style={{ flex: 0.5, alignItems: 'center' }}>
                                            <View>
                                                <MaterialIcons name="edit" size={26} color="#54524f" />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => { handleDelete(event._id) }}
                                            style={{ flex: 0.5, alignItems: 'center' }}>
                                            <View >
                                                <MaterialIcons name="delete" size={26} color="#54524f" />
                                            </View>
                                        </TouchableOpacity>
                                        {/* <CardButton
                                            onPress={() => { handleEdit(event) }}
                                            title="Edit"
                                            color="blue"
                                            key={`card-action-edit-${event._id}`}
                                        />
                                        <CardButton
                                            onPress={() => { handleDelete(event._id) }}
                                            title="Delete"
                                            color="blue"
                                            key={`card-action-delete-${event._id}`}
                                        /> */}
                                    </CardAction>
                                </Card>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    labelTags: {
        padding: 8,
        fontWeight: '500',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        fontFamily: 'Roboto_500Medium',
        textTransform: 'capitalize'
    }
});

export default EventsScreen;