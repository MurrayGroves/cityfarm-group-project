import { Animal } from "./animals.ts";
import { Enclosure } from "./enclosures.ts";

export class Event {
    enclosures: Enclosure[];
    animals: Animal[];
    title: string;
    description: string;
    allDay: boolean;
    farms: string[];
    start: Date;
    end: Date;
    id: string

    constructor(data: any) {
        this.enclosures = data.enclosures?.map((enclosure: any) => new Enclosure(enclosure)) ?? [];
        this.animals = data.animals?.map((animal: any) => new Animal(animal)) ?? []
        this.title = data.title;
        this.description = data.description;
        this.allDay = data.allDay;
        this.farms = data.farms ?? [];
        this.start = new Date(data.start);
        this.end = new Date(data.end);
        this.id = data._id ?? data.id;
    }
}

export class EventRecurring extends Event {
    firstStart: Date;
    firstEnd: Date;
    finalEnd: Date;
    delay: string;

    constructor(data: any) {
        if (data instanceof EventRecurring) {
            return data;
        }

        super(data);
        this.firstStart = new Date(data.firstStart);
        this.firstEnd = new Date(data.firstEnd);
        this.finalEnd = new Date(data.finalEnd);
        this.delay = data.delay;
    }
}

export class EventOnce extends Event {
    start: Date;
    end: Date;

    constructor(data: any) {
        if (data instanceof EventOnce) {
            return data;
        }
        super(data);
        this.start = new Date(data.start);
        this.end = new Date(data.end);
    }
}

export class EventInstance {
    start: Date;
    end: Date;
    event: Event;

    constructor(data) {
        if (data instanceof EventInstance) {
            return data;
        }

        this.start = new Date(data.start);
        this.end = new Date(data.end);
        this.event = data.event.type === "once" ? new EventOnce(data.event) : new EventRecurring(data.event);
    }
}