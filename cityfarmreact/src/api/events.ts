import axios from './axiosConfig'

interface Event {
    enclosures: any[],
    animals: any[],
    title: string,
    description: string,
    allDay: boolean,
    start: Date,
    end: Date,
    id: string
}

interface EventInstance {
    start: Date,
    end: Date,
    event: Event
}