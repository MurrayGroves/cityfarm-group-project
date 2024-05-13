import axios from './axiosConfig'
import { getConfig } from './getToken'
import { EventOnce, EventRecurring, Event, EventInstance } from './events.ts'
import { Animal, Schema } from './animals.ts';

import { useState } from 'react';
import { Enclosure } from './enclosures.ts';

import lodash from "lodash"

export enum CachePolicy {
    // Fetch from cache only, don't check network
    CACHE_ONLY = "CACHE_ONLY",
    // Fetch from cache if it exists, check network for updates and use callback if changed
    USE_CACHE = "USE_CACHE",
    // Fetch from network and update cache, don't return stale data
    NO_CACHE = "NO_CACHE",
    // Return result from cache (and don't update over network) if it exists, otherwise fetch from network and update cache
    PREFER_CACHE = "PREFER_CACHE",
}

export class CityFarm {
    events_cache: Event[];
    setEventsCache: (events: Event[]) => void;
    event_instance_cache: EventInstance[];
    setEventInstanceCache: (instances: EventInstance[]) => void;
    animals_cache: Animal[];
    setAnimalsCache: (animals: Animal[]) => void;
    enclosures_cache: Enclosure[];
    setEnclosuresCache: (enclosures: Enclosure[]) => void;
    schemas_cache: Schema[];
    setSchemasCache: (schemas: Schema[]) => void;
    private token: {headers: {Authorization: string}};

    farms: string[];

    constructor(){
        [this.events_cache, this.setEventsCache] = [[], (x) => this.events_cache = x];
        [this.animals_cache, this.setAnimalsCache] = [[], (x) => this.animals_cache = x];
        [this.enclosures_cache, this.setEnclosuresCache] = [[], (x) => this.enclosures_cache = x];
        [this.schemas_cache, this.setSchemasCache] = [[], (x) => this.schemas_cache = x];
        [this.event_instance_cache, this.setEventInstanceCache] = [[], (x) => this.event_instance_cache = x];
        this.farms = ["Windmill Hill", "St Werburghs", "Hartcliffe"];
        this.token = getConfig();
    }

    async getEventsBetween(use_cache: CachePolicy, start: Date, end: Date, callback?: (events) => void) : Promise<EventInstance[]> {
        console.log("Getting events between", start, end);
        const cached_events = this.event_instance_cache.filter((instance) => {
            return instance.start > start || instance.end < end;
        });

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_events;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_events.length > 0) {
            try {
                axios.get(`/events`, {params: {from: start.toISOString(), to: end.toISOString()}, ...this.token}).then((response) => {
                    const events = response.data.map((data) => new EventInstance(data));
                    // If the events have changed, update the cache and call the callback
                    console.log("Checking if events have changed", cached_events, events);
                    if (!lodash.isEqual(cached_events, events)) {
                        let new_events = this.event_instance_cache.filter((instance) => {
                            // If instance should've been in the new response but isn't: delete it
                            return (!(instance.start > start || instance.end < end));
                        })

                        console.log("Remaining events", new_events);
    
                        // Add new instances
                        events.forEach((instance) => {
                            new_events.push(instance);
                        });
    
                        console.log("Returning new events", new_events);

                        // Update cache
                        this.setEventInstanceCache(new_events);

                        if (callback) {
                            callback(new_events);
                        }
                    }
                });
                return cached_events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/events`, {params: {from: start.toISOString(), to: end.toISOString()}, ...this.token});
                const events = response.data.map((data) => new EventInstance(data));
                if (!lodash.isEqual(cached_events, events)) {
                    let new_events = this.event_instance_cache.filter((instance) => {
                        // If instance should've been in the new response but isn't: delete it
                        return (!(instance.start > start && instance.end < end));
                    })

                    // Add new instances
                    events.forEach((instance) => {
                        new_events.push(instance);
                    })

                    console.log("Returning new events", new_events);

                    // Update cache
                    this.setEventInstanceCache(new_events);
                }
                return events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getEvents(use_cache: CachePolicy, callback?: (events) => void) : Promise<Event[]> {
        const cached_events = this.events_cache;

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_events;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_events.length > 0) {
            try {
                axios.get(`/events/non_instanced`, this.token).then((response) => {
                    const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                    // If the events have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_events, events)) {
                        this.setEventsCache(events);
                        if (callback) {
                            callback(events);
                        }
                    }
                });
                return cached_events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/events/non_instanced`, this.token);
                const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                if (!lodash.isEqual(cached_events, events)) {
                    this.setEventsCache(events);
                    if (callback) {
                        callback(events);
                    }
                }
                return events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getEventsByAnimal(animal: string, use_cache: CachePolicy, callback?: (events) => void) : Promise<Event[]> {
        const cached_events = this.events_cache.filter((event) => event.animals.includes(animal));

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_events;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_events.length > 0) {
            try {
                axios.get(`/events/by_animal/{${animal}}`, this.token).then((response) => {
                    const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                    if (callback) {
                        callback(events);
                    }
                });
                return cached_events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/events/by_animal/${animal}`, this.token);
                const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                if (!lodash.isEqual(cached_events, events)) {
                    this.setEventsCache(events);
                    if (callback) {
                        callback(events);
                    }
                }
                return events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getEventsByEnclosure(enclosure: string, use_cache: CachePolicy, callback?: (events) => void) : Promise<Event[]> {
        const cached_events = this.events_cache.filter((event) => event.enclosures.includes(enclosure));

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_events;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_events.length > 0) {
            try {
                axios.get(`/events/by_enclosure/{${enclosure}}`, this.token).then((response) => {
                    const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                    if (callback) {
                        callback(events);
                    }
                });
                return cached_events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/events/by_enclosure/${enclosure}`, this.token);
                const events = response.data.map((data) => data.type === "once" ? new EventOnce(data) : new EventRecurring(data));
                if (!lodash.isEqual(cached_events, events)) {
                    this.setEventsCache(events);
                    if (callback) {
                        callback(events);
                    }
                }
                return events;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }


    async getEvent(id: string, use_cache: CachePolicy, callback?: (event) => void) : Promise<Event | null> {
        if (!id) {
            return null;
        }

        if (use_cache === CachePolicy.CACHE_ONLY){
            return this.events_cache.find((event) => event.id === id) ?? null;
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache === CachePolicy.USE_CACHE) {
            // If the event isn't in the cache, can't return anything so wait to fetch it
            const cached_event = this.events_cache.find((event) => event.id === id);
            if (!cached_event) {
                try {
                    const response = await axios.get(`/events/by_id/${id}`, this.token);
                    this.setEventsCache([...this.events_cache, response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data)]);
                    return response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data);
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the event is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/events/by_id/${id}`, this.token).then((response) => {
                        // If the event has changed, update the cache and call the callback
                        if (!lodash.isEqual(this.events_cache, response.data)) {
                            this.setEventsCache(this.events_cache.map((event) => event.id !== id ? event : response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data)));
                            if (callback) {
                                callback(response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data));
                            }
                        }
                    })
                    return cached_event;
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/events/by_id/${id}`, this.token);
            // Update cache
            this.setEventsCache(this.events_cache.map((event) => event.id !== id ? event : new Event(response.data)));
            if (this.events_cache.find((event) => event.id === id) === undefined) {
                this.setEventsCache([...this.events_cache, response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data)]);
            }
            return response.data.type === "once" ? new EventOnce(response.data) : new EventRecurring(response.data);
        }
    }

    

    async getAnimal(id: string, use_cache: CachePolicy, callback?: (animal) => void) : Promise<Animal | null> {
        if (!id) {
            return null;
        }

        if (use_cache === CachePolicy.CACHE_ONLY){
            return this.animals_cache.find((animal) => animal.id === id) ?? null;
        }

        if (use_cache === CachePolicy.PREFER_CACHE) {
            const cached_animal = this.animals_cache.find((animal) => animal.id === id);
            if (cached_animal) {
                return cached_animal;
            }
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache === CachePolicy.USE_CACHE) {
            // If the animal isn't in the cache, can't return anything so wait to fetch it
            const cached_animal = this.animals_cache.find((animal) => animal.id === id);
            if (!cached_animal) {
                try {
                    const response = await axios.get(`/animals/by_id/${id}`, this.token);
                    this.setAnimalsCache([...this.animals_cache, new Animal(response.data)]);
                    return new Animal(response.data);
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the animal is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/animals/by_id/${id}`, this.token).then((response) => {
                        // If the animal has changed, update the cache and call the callback
                        if (!lodash.isEqual(this.animals_cache, response.data)) {
                            this.setAnimalsCache(this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data)));
                            if (callback) {
                                callback(new Animal(response.data));
                            }
                        }
                    })
                    return cached_animal;
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            try {
                const response = await axios.get(`/animals/by_id/${id}`, this.token);
                // Update cache
                this.setAnimalsCache(this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data)));
                if (this.animals_cache.find((animal) => animal.id === id) === undefined) {
                    this.setAnimalsCache([...this.animals_cache, new Animal(response.data)]);
                }
                return new Animal(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    throw new Error('Token expired');
                } else if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        }
    }

    async getAnimalsByIds(ids: string[], use_cache: CachePolicy, farm: string | null, callback?: (animals) => void) : Promise<Animal[]> {
        const cached_animals = this.animals_cache.filter((animal) => ids.includes(animal.id));

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_animals;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_animals.length > 0) {
            try {
                axios.get(`/animals/by_ids`, {params: {"ids": ids.join(",")}, ...this.token}, ).then((response) => {
                    const animals = response.data.map((data) => new Animal(data));
                    // If the animals have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_animals, animals)) {
                        this.setAnimalsCache([...this.animals_cache, animals]);
                        if (callback) {
                            callback(animals);
                        }
                    }
                });
                return cached_animals;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                console.log("Joined", ids);
                const response = await axios.get(`/animals/by_ids`, {params: {"ids": ids.join(",")}, ...this.token});
                const animals = response.data.map((data) => new Animal(data));
                this.setAnimalsCache([...this.animals_cache, animals]);
                return animals;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }


    async getAnimalsByMother(id: string, use_cache: CachePolicy, callback?: (animal) => void) : Promise<Animal[] | null> {
        if (!id) {
            return null;
        }

        if (use_cache === CachePolicy.CACHE_ONLY){
            return this.animals_cache.filter((animal) => animal.mother === id);
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache === CachePolicy.USE_CACHE) {
            // If the animal isn't in the cache, can't return anything so wait to fetch it
            const cached_animal = this.animals_cache.filter((animal) => animal.mother === id);
            if (!cached_animal) {
                try {
                    const response = await axios.get(`/animals/by_mother/${id}`, this.token);
                    this.setAnimalsCache([...this.animals_cache, new Animal(response.data)]);
                    return response.data.map((data) => new Animal(data));
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the animal is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/animals/by_mother/${id}`, this.token).then((response) => {
                        // If the animal has changed, update the cache and call the callback
                        if (!lodash.isEqual(this.animals_cache, response.data)) {
                            this.setAnimalsCache(this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data)));
                            if (callback) {
                                callback(response.data.map((data) => new Animal(data)));
                            }
                        }
                    })
                    return cached_animal;
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            try {
                const response = await axios.get(`/animals/by_mother/${id}`, this.token);
                // Update cache
                this.setAnimalsCache(this.animals_cache.map((animal) => animal.id !== id ? animal : new Animal(response.data)));
                if (this.animals_cache.find((animal) => animal.id === id) === undefined) {
                    this.setAnimalsCache([...this.animals_cache, ...response.data.map((data) => new Animal(data))]);
                }
                return response.data.map((data) => new Animal(data));
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    throw new Error('Token expired');
                } else if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        }
    }

    async getAnimalsByFather(id: string, use_cache: CachePolicy, callback?: (animal) => void) : Promise<Animal[] | null> {
        if (!id) {
            return null;
        }

        if (use_cache === CachePolicy.CACHE_ONLY){
            return this.animals_cache.filter((animal) => animal.father === id);
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache === CachePolicy.USE_CACHE) {
            // If the animal isn't in the cache, can't return anything so wait to fetch it
            const cached_animal = this.animals_cache.filter((animal) => animal.father === id);
            if (!cached_animal) {
                try {
                    const response = await axios.get(`/animals/by_father/${id}`, this.token);
                    return response.data.map((data) => new Animal(data));
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the animal is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/animals/by_father/${id}`, this.token).then((response) => {
                        // If the animal has changed, update the cache and call the callback
                        if (!lodash.isEqual(this.animals_cache, response.data)) {
                            if (callback) {
                                callback(response.data.map((data) => new Animal(data)));
                            }
                        }
                    })
                    return cached_animal;
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            try {
                const response = await axios.get(`/animals/by_father/${id}`, this.token);
                return response.data.map((data) => new Animal(data));
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    throw new Error('Token expired');
                } else if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        }
    }

    async getAnimals(use_cache: CachePolicy, farm: string | null, callback?: (animals) => void) : Promise<Animal[]> {
        const cached_animals = this.animals_cache;

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_animals;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_animals.length > 0) {
            try {
                axios.get(`/animals`, {params: {farm: farm}, ...this.token}).then((response) => {
                    const animals = response.data.map((data) => new Animal(data));
                    // If the animals have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_animals, animals)) {
                        this.setAnimalsCache(animals)
                        if (callback) {
                            callback(animals);
                        }
                    }
                });
                return cached_animals;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/animals`, {params: {farm: farm}, ...this.token});
                const animals = response.data.map((data) => new Animal(data));
                this.setAnimalsCache(animals);
                return animals;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getSchemas(use_cache: CachePolicy, callback?: (schemas) => void) : Promise<Schema[]> {
        const cached_schemas = this.schemas_cache;

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_schemas;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_schemas.length > 0) {
            try {
                axios.get(`/schemas`, this.token).then((response) => {
                    const schemas = response.data.map((data) => new Schema(data));
                    // If the schemas have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_schemas, schemas)) {
                        this.schemas_cache = schemas
                        if (callback) {
                            callback(schemas);
                        }
                    }
                });
                return cached_schemas;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/schemas`, this.token);
                const schemas = response.data.map((data) => new Schema(data));
                this.schemas_cache = schemas
                return schemas;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getSchema(name: string, use_cache: CachePolicy, callback?: (schema: Schema) => void) : Promise<Schema | null> {
        const cached_schema = this.schemas_cache.find((x) => x.name === name);

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_schema ?? null;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_schema) {
            try {
                axios.get(`/schemas/by_name/${name}`, this.token).then((response) => {
                    const schema = new Schema(response.data)
                    // If the schemas have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_schema, schema)) {
                        this.schemas_cache = this.schemas_cache.map((x) => x.name === schema.name ? schema : x);
                        if (callback) {
                            callback(schema);
                        }
                    }
                });
                return cached_schema;
            } catch (error) {
                if (error.response?.status === 401) {
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

    async getEnclosure(id: string, use_cache: CachePolicy, callback?: (enclosure: Enclosure) => void): Promise<Enclosure | null> {
        if (!id) {
            return null;
        }

        if (use_cache === CachePolicy.CACHE_ONLY){
            return this.enclosures_cache.find((enclosure) => enclosure.id === id) ?? null;
        }

        if (use_cache === CachePolicy.PREFER_CACHE && this.enclosures_cache.find((enclosure) => enclosure.id === id) !== undefined) {
            return this.enclosures_cache.find((enclosure) => enclosure.id === id) ?? null;
        }

        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache === CachePolicy.USE_CACHE) {
            // If the enclosure isn't in the cache, can't return anything so wait to fetch it
            const cached_enclosure = this.enclosures_cache.find((enclosure) => enclosure.id === id);
            if (!cached_enclosure) {
                try {
                    const response = await axios.get(`/enclosures/by_id/${id}`, this.token);
                    this.setEnclosuresCache([...this.enclosures_cache, new Enclosure(response.data)]);
                    return new Enclosure(response.data);
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            } else { // If the enclosure is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/enclosures/by_id/${id}`, this.token).then((response) => {
                        // If the enclosure has changed, update the cache and call the callback
                        if (!lodash.isEqual(this.enclosures_cache, response.data)) {
                            this.setEnclosuresCache(this.enclosures_cache.map((enclosure) => enclosure.id !== id ? enclosure : new Enclosure(response.data)));
                            if (callback) {
                                callback(new Enclosure(response.data));
                            }
                        }
                    })
                    return cached_enclosure;
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        throw new Error('Token expired');
                    } else if (error.response?.status === 404) {
                        return null;
                    }
                    throw error;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/enclosures/by_id/${id}`, this.token);
            // Update cache
            this.setEnclosuresCache(this.enclosures_cache.map((enclosure) => enclosure.id !== id ? enclosure : new Enclosure(response.data)));
            if (this.enclosures_cache.find((enclosure) => enclosure.id === id) === undefined) {
                this.setEnclosuresCache([...this.enclosures_cache, new Enclosure(response.data)]);
            }
            return new Enclosure(response.data);
        }
    }

    async getEnclosures(use_cache: CachePolicy, farm: string | null, callback?: (enclosures) => void) : Promise<Enclosure[]> {
        const cached_enclosures = this.enclosures_cache;

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_enclosures;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_enclosures.length > 0) {
            try {
                axios.get(`/enclosures`, {params: {farm: farm}, ...this.token}).then((response) => {
                    const enclosures = response.data.map((data) => new Enclosure(data));
                    // If the enclosures have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_enclosures, enclosures)) {
                        this.setEnclosuresCache(enclosures)
                        if (callback) {
                            callback(enclosures);
                        }
                    }
                });
                return cached_enclosures;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                const response = await axios.get(`/enclosures`, {params: {farm: farm}, ...this.token});
                const enclosures = response.data.map((data) => new Enclosure(data));
                this.setEnclosuresCache(enclosures);
                return enclosures;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }

    async getEnclosuresByIds(ids: string[], use_cache: CachePolicy, farm: string | null, callback?: (enclosures) => void) : Promise<Enclosure[]> {
        const cached_enclosures = this.enclosures_cache.filter((enclosure) => ids.includes(enclosure.id));

        if (use_cache === CachePolicy.CACHE_ONLY){
            return cached_enclosures;
        }

        if (use_cache === CachePolicy.USE_CACHE && cached_enclosures.length > 0) {
            try {
                axios.get(`/enclosures/by_ids`, {params: {"ids": ids.join(",")}, ...this.token}, ).then((response) => {
                    const enclosures = response.data.map((data) => new Enclosure(data));
                    // If the enclosures have changed, update the cache and call the callback
                    if (!lodash.isEqual(cached_enclosures, enclosures)) {
                        if (callback) {
                            callback(enclosures);
                        }
                    }
                });
                return cached_enclosures;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }

        } else {
            try {
                console.log("Joined", ids);
                const response = await axios.get(`/enclosures/by_ids`, {params: {"ids": ids.join(",")}, ...this.token});
                const enclosures = response.data.map((data) => new Enclosure(data));
                return enclosures;
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return [];
                }
                throw error;
            }
        }
    }
}