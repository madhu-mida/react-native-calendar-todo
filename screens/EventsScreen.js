import { useEffect, useState } from "react";
import moment from 'moment';
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

const EventsScreen = ({ navigation, route }) => {

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
                    <Text>Events</Text>

                    {route.params.eventSource === 'day' && <Text>{moment().format('MM-DD-YYYY')}</Text>}

                    {(route.params.eventSource === 'week' || route.params.eventSource === 'month') && startDate && endDate && <Text>{startDate} - {endDate}</Text>}

                    {events && events.map((event) => {
                        return (
                            <View style={{ maxHeight: 200 }} key={`view-${event.id}`}>
                                <Card style={{
                                    borderRadius: 10,
                                    margin: 5,
                                    width: '100%'
                                }} key={`card-${event.id}`}>
                                    <CardTitle
                                        subtitle={event.title}
                                        key={`card-title-${event.id}`}
                                    />
                                    <CardContent text={event.description} key={`card-content-${event.id}`} />

                                    <CardAction
                                        separator={true}
                                        inColumn={false}
                                        key={`card-action-${event.id}`}>
                                        <CardButton
                                            onPress={() => { handleEdit(event) }}
                                            title="Edit"
                                            color="blue"
                                            key={`card-action-edit-${event.id}`}
                                        />
                                        <CardButton
                                            onPress={() => { }}
                                            title="Delete"
                                            color="blue"
                                            key={`card-action-delete-${event.id}`}
                                        />
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
});

export default EventsScreen;