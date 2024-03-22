import axios from './axiosConfig'

export interface Event {
    enclosures: any[],
    animals: any[],
    title: string,
    description: string,
    allDay: boolean,
    start: Date,
    end: Date,
    id: string
}

export interface EventInstance {
    start: Date,
    end: Date,
    event: Event
}