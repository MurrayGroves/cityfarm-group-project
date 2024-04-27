import { Animal } from "./animals.ts";

export class Enclosure {
    capacities: {
        [key: string]: number
    };
    holding: Animal[];
    id: string;
    name: string;
    farm: string;
    notes: string

    constructor(data: any) {
        this.id = data._id ?? data.id;
        this.capacities = data.capacities;
        this.holding = data.holding?.map((animal) => new Animal(animal)) ?? [];
        this.name = data.name;
        this.farm = data.farm;
        this.notes = data.notes;
    }
}