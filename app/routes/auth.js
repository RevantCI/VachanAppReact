import { AsyncStorage } from "react-native";

export const USER_KEY = "user";
// await AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
export const onSignIn = (data) => AsyncStorage.setItem(USER_KEY, JSON.stringify(data));

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail)
      .then(res => {
        let user = JSON.parse(res);
        console.log("user TYPE "+user)
        if (res !== null) {
          resolve(user.user_type);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  })
};