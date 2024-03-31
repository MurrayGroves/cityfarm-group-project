export class Event {
    enclosures: any[];
    animals: any[];
    title: string;
    description: string;
    allDay: boolean;
    start: Date;
    end: Date;
    id: string

    constructor(data: any) {
        this.enclosures = data.enclosures;
        this.animals = data.animals;
        this.title = data.title;
        this.description = data.description;
        this.allDay = data.allDay;
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