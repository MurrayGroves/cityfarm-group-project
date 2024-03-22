interface Enclosure {
    capacities: {
        [key: string]: number
    },
    holding: string[],
    id: string,
    name: string,
    farm: string,
    notes: string
}