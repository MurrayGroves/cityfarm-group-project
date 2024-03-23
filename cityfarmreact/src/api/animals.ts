export enum Sex {
    Male,
    Female,
    Castrated
}

export class Animal {
    id: string;
    name: string;
    type: string;
    fields: {
        [key: string]: any
    };
    mother: string;
    father: string;
    breed: string;
    alive: boolean;
    sex: Sex | null;
    dateOfBirth: Date;
    notes: string;
    farm: string;

    constructor(data: any) {
        this.id = data._id;
        this.name = data.name;
        this.type = data.type;
        this.fields = data.fields;
        this.mother = data.mother;
        this.father = data.father;
        this.breed = data.breed;
        this.alive = data.alive;
        switch (data.sex) {
            case 'm':
                this.sex = Sex.Male;
                break;
            case 'f':
                this.sex = Sex.Female;
                break;
            case 'c':
                this.sex = Sex.Castrated;
                break;
            default:
                this.sex = null;
        }
        this.dateOfBirth = new Date(data.dateOfBirth);
        this.notes = data.notes;
        this.farm = data.farm;
    }
}

export class Schema {
    fields: {
        [key: string]: {
            type: string,
            required: boolean
        }
    };
    hidden: boolean;
    name: string;

    constructor(data: any) {
        this.fields = Object.keys(data._fields).reduce((dict, field) => {
            return {...dict,
                [field]: {
                    type: data._fields[field]._type,
                    required: data._fields[field]._required
                }
            }
        }, {})
        this.hidden = data.hidden;
        this.name = data._name;
    }
}