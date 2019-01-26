import {AsyncStorage} from "react-native";
import {RESET_STATE} from "@redux-offline/redux-offline/src/constants";

export const USER_KEY = "auth_v3.1";

export async function onSignIn(user_id) {
    try {
        return await AsyncStorage.setItem(USER_KEY, JSON.stringify(user_id));
    } catch (error) {
        console.log(error.message);
    }
}

export async function onSignOut() {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.log(error.message);

    }
}

export async function getUserID() {
  return new Promise((res, rej) => {
    AsyncStorage.getItem(USER_KEY)
    .then(id => res(id.split('"').join('')))
    .catch(err => rej(err))
  })
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