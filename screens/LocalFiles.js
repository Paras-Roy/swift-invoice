import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAllFormData, deleteFormData } from '../utils/localStorage';
import useAuth from '../utils/useAuth';

export default function LocalFiles({ navigation }) {
  const {user} = useAuth();
  const defaultData1 = {
    fileID:Math.floor(Math.random() * 10000000),

    authorID: user?.uid,
    fileName: 'Untitled',
    fileType: 'Format 1',
    dateModified: new Date().toLocaleDateString(),
    invoiceNumber: 0,
    invoiceDate: new Date().toLocaleDateString(),
    toName: '',
    toAddressLine1: '',
    toAddressLine2: '',
    toPhone: '',
    fromName: '',
    fromAddressLine1: '',
    fromAddressLine2: '',
    fromPhone: '',
    items: [],
    totalAmount: 0,
  };

  const [formDataObjects, setFormDataObjects] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      const formData = await getAllFormData();
      setFormDataObjects(formData);
    }
    isFocused && fetchData();
  }, [isFocused]);

  async function deleteFile(key) {
    await deleteFormData(key);
    const formData = await getAllFormData();
    setFormDataObjects(formData);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Local Files of {user?.email}</Text>

      <FlatList
        data={formDataObjects}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap:10 }}>
            <Text style={styles.fileName}>{item.data.fileName} </Text>
            <Text style={styles.fileDate}>{item.data.dateModified}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style = {styles.viewButton}
                onPress={() => navigation.navigate('ViewOnly', { fileData: item.data, key: item.key })}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('File', { fileData: item.data, key: item.key })}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFile(item.key)}
              >
                <Text style={styles.buttonText}>Delete</Text>

              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('File', { fileData: defaultData1, key: 0 })}
    >
      <Text style={styles.buttonText}>Create New File</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 20,
    backgroundColor: 'lightblue',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 10,
  },
  fileName: {
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',

  },
  fileDate: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'normal',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },

});
