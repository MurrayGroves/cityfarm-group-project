enum Sex {
    Male,
    Female,
    Castrated
}

interface Animal {
    id: string,
    name: string,
    type: string,
    fields: {
        [key: string]: any
    },
    mother: string,
    father: string,
    breed: string,
    alive: boolean,
    sex: Sex,
    dateOfBirth: Date,
    notes: string,
    farm: string,
}