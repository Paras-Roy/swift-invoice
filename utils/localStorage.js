import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeFormData = async (data) => {
    
    const uniqueId = data.fileID;
    try {
        await AsyncStorage.setItem(uniqueId.toString(), JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

export const getAllFormData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
  
      const formDataList = await AsyncStorage.multiGet(keys);
  
      // Parse each JSON string to convert it back to an object
      const formDataObjects = formDataList.map(([key, jsonString]) => ({
        key,
        data: JSON.parse(jsonString),
      }));
  
      return formDataObjects;
    } catch (error) {
      console.error('Error retrieving form data:', error);
      return [];
    }
  }

export const deleteFormData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(error);
    }
}

export const updateFormData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}