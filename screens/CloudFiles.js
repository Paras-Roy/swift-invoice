import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import useAuth from '../utils/useAuth';
import { getInvoicesForAuthor} from '../utils/cloudStorage';
import { useIsFocused } from '@react-navigation/native';
import CloudFileItem from '../components/CloudFileItem';

import { auth } from '../config/firebase';

export default function CloudFiles({ navigation }) {

  const [formDataObjects, setFormDataObjects] = useState([]);
  const { user } = useAuth();
  const defaultData1 = {
    //file id is random 8 digit string
    fileID: Math.floor(Math.random() * 10000000),
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

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      if(user) 
      {
        const formData = await getInvoicesForAuthor(user?.uid);
      setFormDataObjects(formData);
    }
  }
    fetchData();
  }, [isFocused]);

  const handleLogout = () => {
    auth.signOut(); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Cloud Files of {user?.email}</Text>
      <FlatList
        data={formDataObjects}
        keyExtractor={(item) => item.fileID.toString()}
        renderItem={({ item }) => (
          <CloudFileItem
            item={item}
            navigation={navigation}
          />
        )}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('File', { fileData: defaultData1, key: 0 })}
      >
        <Text style={styles.buttonText}>Create New File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      </View>

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
