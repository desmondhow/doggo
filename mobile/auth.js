import {AsyncStorage} from "react-native";

export const USER_KEY = "auth";

export async function onSignIn(user_id) {
    try {
        return await AsyncStorage.setItem(USER_KEY, JSON.stringify(user_id));
    } catch (error) {
        console.log(error.message);
    }
}

export async function onSignOut() {
    try {
        return await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.log(error.message);

    }
}

export async function getUserID() {
    try {
        return await AsyncStorage.getItem(USER_KEY);
    } catch (error) {
        console.log(error.message);
    }
}

export async function isSignedIn() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USER_KEY)
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                console.error(err);
                reject(err)
            });
    });
}