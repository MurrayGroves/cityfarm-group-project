import axios from './axiosConfig'
import { getConfig } from './getToken'
import { Event, EventInstance } from './events.ts'

export class CityFarm {
    events_cache: Event[];
    enclosures_cache: Enclosure[];
    animals_cache: Animal[];
    private token: {headers: {Authorization: string}};

    farms: string[];

    constructor() {
        this.events_cache = [];

        this.enclosures_cache = [];
        this.animals_cache = [];
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
            return new Event(response.data);
        }
    }
}