export function getConfig() {
    // If authorisation is disabled return an empty object
    if (process.env.REACT_APP_AUTH !== "true") {
        return {headers: {'Authorization': ''}};
    }

    let msal_key = JSON.parse(localStorage.getItem("msal.token.keys.5668872b-7957-4c09-a995-56cd915cb4a9"))["idToken"][0];
    let token = JSON.parse(localStorage.getItem(msal_key))["secret"];

    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
}