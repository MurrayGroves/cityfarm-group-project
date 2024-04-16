import axios from './axiosConfig'
import { getConfig } from './getToken'
import { EventOnce, EventRecurring, Event, EventInstance } from './events.ts'
import { Animal, Schema } from './animals.ts';

export class CityFarm {
    events_cache: Event[];
    animals_cache: Animal[];
    schemas_cache: Schema[];
    private token: {headers: {Authorization: string}};

    farms: string[];

    constructor() {
        this.events_cache = [];
        this.animals_cache = [];
        this.schemas_cache = [];
        this.farms = ["Windmill Hill", "St Werburghs", "Hartcliffe"];
        this.token = getConfig();
    }

    async getEvents(use_cache: boolean, callback?: (events) => void) : Promise<Event[]> {
        const cached_events = this.events_cache;
        if (use_cache && cached_events.length > 0) {
            try {
                axios.get(`/events/non_instanced`, this.token).then((response) => {
                    const events = response.data.map((data) => new Event(data));
                    // If the events have changed, update the cache and call the callback
                    if (cached_events !== events) {
                        this.events_cache = events
                        if (callback) {
                            callback(events);
                        }
                    }
                });
                return cached_events;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/events/non_instanced`, this.token);
                this.events_cache = response.data.map((data) => new Event(data));
                console.log("New events cache", this.events_cache);
                return this.events_cache;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }


    async getEvent(id: string, use_cache: boolean, callback?: (event) => void) : Promise<Event | null> {
        if (!id) {
            return null;
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache) {
            // If the event isn't in the cache, can't return anything so wait to fetch it
            const cached_event = this.events_cache.find((event) => event.id === id);
            if (!cached_event) {
                try {
                    const response = await axios.get(`/events/by_id/${id}`, this.token);
                    this.events_cache.push(new Event(response.data));
                    return new Event(response.data);
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the event is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/events/by_id/${id}`, this.token).then((response) => {
                        // If the event has changed, update the cache and call the callback
                        if (this.events_cache !== response.data) {
                            this.events_cache = this.events_cache.map((event) => event.id !== id ? event : new Event(response.data));
                            if (callback) {
                                callback(new Event(response.data));
                            }
                        }
                    })
                    return cached_event;
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/events/by_id/${id}`, this.token);
            // Update cache
            this.events_cache.map((event) => event.id !== id ? event : new Event(response.data));
            if (this.events_cache.find((event) => event.id === id) === undefined) {
                this.events_cache.push(new Event(response.data));
            }
            return new Event(response.data);
        }
    }

    async getAnimal(id: string, use_cache: boolean, callback?: (animal) => void) : Promise<Animal | null> {
        if (!id) {
            return null;
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache) {
            // If the animal isn't in the cache, can't return anything so wait to fetch it
            const cached_animal = this.animals_cache.find((animal) => animal.id === id);
            if (!cached_animal) {
                try {
                    const response = await axios.get(`/animals/by_id/${id}`, this.token);
                    this.animals_cache.push(new Animal(response.data));
                    return new Animal(response.data);
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the animal is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/animals/by_id/${id}`, this.token).then((response) => {
                        // If the animal has changed, update the cache and call the callback
                        if (this.animals_cache !== response.data) {
                            this.animals_cache = this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data));
                            if (callback) {
                                callback(new Animal(response.data));
                            }
                        }
                    })
                    return cached_animal;
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/animals/by_id/${id}`, this.token);
            // Update cache
            this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data));
            if (this.animals_cache.find((animal) => animal.id === id) === undefined) {
                this.animals_cache.push(new Animal(response.data));
            }
            return new Animal(response.data);
        }
    }

    async getAnimals(use_cache: boolean, callback?: (animals) => void) : Promise<Animal[]> {
        const cached_animals = this.animals_cache;
        if (use_cache && cached_animals.length > 0) {
            try {
                axios.get(`/animals`, this.token).then((response) => {
                    const animals = response.data.map((data) => new Animal(data));
                    // If the animals have changed, update the cache and call the callback
                    if (cached_animals !== animals) {
                        this.animals_cache = animals
                        if (callback) {
                            callback(animals);
                        }
                    }
                });
                return cached_animals;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/animals`, this.token);
                this.animals_cache = response.data.map((data) => new Animal(data));
                return this.animals_cache;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getSchemas(use_cache: boolean, callback?: (schemas) => void) : Promise<Schema[]> {
        const cached_schemas = this.schemas_cache;
        if (use_cache && cached_schemas.length > 0) {
            try {
                axios.get(`/schemas`, this.token).then((response) => {
                    const schemas = response.data.map((data) => new Schema(data));
                    // If the schemas have changed, update the cache and call the callback
                    if (cached_schemas !== schemas) {
                        this.schemas_cache = schemas
                        if (callback) {
                            callback(schemas);
                        }
                    }
                });
                return cached_schemas;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/schemas`, this.token);
                this.schemas_cache = response.data.map((data) => new Schema(data));
                return this.schemas_cache;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getSchema(name: string, use_cache: boolean, callback?: (schema: Schema) => void) : Promise<Schema | null> {
        const cached_schema = this.schemas_cache.find((x) => x.name === name);
        if (use_cache && cached_schema) {
            try {
                axios.get(`/schemas/by_name/${name}`, this.token).then((response) => {
                    const schema = new Schema(response.data)
                    // If the schemas have changed, update the cache and call the callback
                    if (cached_schema !== schema) {
                        this.schemas_cache = this.schemas_cache.map((x) => x.name === schema.name ? schema : x);
                        if (callback) {
                            callback(schema);
                        }
                    }
                });
                return cached_schema;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return null;
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/schemas/by_name/${name}`, this.token);
                const schema = new Schema(response.data);
                if (cached_schema) {
                    this.schemas_cache = this.schemas_cache.map((x) => x.name === schema.name ? schema : x);
                } else {
                    this.schemas_cache.push(schema);
                }
                return schema;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return null;
                }
                throw error;
            }
        }
    }
}