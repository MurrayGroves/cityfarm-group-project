import { Animal } from './animals.ts'

export class Event {
    enclosures: any[];
    animals: Animal[];
    title: string;
    description: string;
    allDay: boolean;
    farms: string[];
    start: Date;
    end: Date;
    id: string

    constructor(data: any) {
        this.enclosures = data.enclosures;
        this.animals = data.animals.map((animal: any) => new Animal(animal))
        this.title = data.title;
        this.description = data.description;
        this.allDay = data.allDay;
        this.farms = data.farms;
        this.start = new Date(data.start);
        this.end = new Date(data.end);
        this.id = data._id;
    }
}

export interface EventInstance {
    start: Date,
    end: Date,
    event: Event
}