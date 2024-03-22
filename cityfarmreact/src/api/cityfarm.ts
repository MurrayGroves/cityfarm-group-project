import axios from './axiosConfig'
import { getConfig } from './getToken'
import { Event } from './events'

class CityFarm {
    private events_cache: Event[];
    private enclosures_cache: Enclosure[];
    private animals_cache: Animal[];
    private token: {headers: {Authorization: string}};

    farms: string[];

    constructor() {
        this.events_cache = [];
        this.enclosures_cache = [];
        this.animals_cache = [];
        this.farms = ["Windmill Hill", "St Werburghs", "Hartcliffe"];
        this.token = getConfig();
    }

    async getEvents(from: Date, to: Date, use_cache: boolean, callback?: (events) => void) {
        const cached_events = this.events_cache.filter((event) => event.start >= from && event.end <= to);
        if (use_cache) {
            try {
                axios.get(`/events`, {params: {from: from.toISOString(), to: to.toISOString()}, ...this.token}).then((response) => {
                    // Convert our list of events into a dictionary for easy lookup
                    const resp_dict = response.data.reduce((dict, event) => {
                        dict[event.id] = event;
                    }, {});

                    // If the events have changed, update the cache and call the callback
                    if (cached_events !== response.data) {
                        if (callback) {
                            callback(response.data);
                        }
                        // If an event was in the cached list but not in the new list, it has been deleted (or modified to a different date, but we can't tell that)
                        const deleted_events = cached_events.filter((event) => !(event.id in resp_dict));
                        // Update cache by removing the deleted events
                        this.events_cache = this.events_cache.filter((event) => !deleted_events.includes(event));
                        // Update cache by replacing the old events with the new ones
                        this.events_cache = this.events_cache.map((event) => resp_dict[event.id] ? resp_dict[event.id] : event);
                        this.events_cache = this.events_cache.concat(response.data.filter((event) => !this.events_cache.includes(event)));
                    }
                })
                return cached_events;
            } catch (error) {
                if (error.response.status === 401) {
                    console.log('Token expired');
                    window.location.href = "/login";
                    return;
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/events`, {params: {from: from.toISOString(), to: to.toISOString()}, ...this.token})
            // Convert our list of events into a dictionary for easy lookup
            const resp_dict = response.data.reduce((dict, event) => {
                dict[event.id] = event;
            }, {});
            // If an event was in the cached list but not in the new list, it has been deleted (or modified to a different date, but we can't tell that)
            const deleted_events = cached_events.filter((event) => !(event.id in resp_dict));
            // Update cache by removing the deleted events
            this.events_cache = this.events_cache.filter((event) => !deleted_events.includes(event));
            // Update cache by replacing the old events with the new ones
            this.events_cache = this.events_cache.map((event) => resp_dict[event.id] ? resp_dict[event.id] : event);
            this.events_cache = this.events_cache.concat(response.data.filter((event) => !this.events_cache.includes(event)));
            return response.data;
        }
    }

    async getEvent(id: string, use_cache: boolean, callback?: (event) => void) {
        // If the user wants to utilise the cache: return stale data and then call the callback when the new data has arrived
        if (use_cache) {
            // If the event isn't in the cache, can't return anything so wait to fetch it
            const cached_event = this.events_cache.find((event) => event.id === id);
            if (!cached_event) {
                try {
                    const response = await axios.get(`/events/by_id/${id}`, this.token);
                    this.events_cache.push(response.data);
                    return response.data;
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                    }
                }
            } else { // If the event is in the cache, return it and then fetch the new data
                try {
                    axios.get(`/events/by_id/${id}`, this.token).then((response) => {
                        // If the event has changed, update the cache and call the callback
                        if (this.events_cache !== response.data) {
                            this.events_cache = this.events_cache.map((event) => event.id !== id ? event : response.data);
                            if (callback) {
                                callback(response.data);
                            }
                        }
                    })
                    return cached_event;
                } catch (error) {
                    if (error.response.status === 401) {
                        console.log('Token expired');
                        window.location.href = "/login";
                        return;
                    }
                }
            }
        } else { // The user needs the most up-to-date data so wait to fetch and return it
            const response = await axios.get(`/events/by_id/${id}`, this.token);
            // Update cache
            this.events_cache.map((event) => event.id !== id ? event : response.data);
            return response.data;
        }
    }
}