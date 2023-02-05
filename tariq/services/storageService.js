import AsyncStorage from "@react-native-async-storage/async-storage";

export const setDataToStorage = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const getDataFromStorage = async (key) => {
  return await AsyncStorage.getItem(key);
};

export const deleteDataFromStorage = async (key) => {
  return await AsyncStorage.removeItem(key);
};

export const getAllStorageKeys = async () => {
  return await AsyncStorage.getAllKeys();
};

export const checkAllStorageKeys = async () => {
  return await AsyncStorage.getAllKeys();
};
export const deleteAllStorageKeys = async () => {
  return await AsyncStorage.clear();
};
