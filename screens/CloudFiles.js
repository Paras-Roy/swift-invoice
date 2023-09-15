import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import useAuth from '../utils/useAuth';
import { getInvoicesForAuthor } from '../utils/cloudStorage';
import { useIsFocused } from '@react-navigation/native';
import { deleteInvoiceByFileID } from '../utils/cloudStorage';
import sharePDF from '../utils/Share'
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../config/firebase';

export default function CloudFiles({ navigation }) {

  const [formDataObjects, setFormDataObjects] = useState([]);
  const { user } = useAuth();
  const defaultData1 = {
    //file id is random 8 digit string
    fileID: Math.floor(Math.random() * 100000000),
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
  const [selectedFile, setSelectedFile] = useState(null); // Track the file selected for the dropdown
  const [modalVisible, setModalVisible] = useState(false); // Control the visibility of the dropdown modal

  useEffect(() => {
    async function fetchData() {
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
  const openDropdown = (file) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const closeDropdown = () => {
    setSelectedFile(null);
    setModalVisible(false);
  };

  const fetchData = async () => {
    const formData = await getInvoicesForAuthor(user?.uid);
    setFormDataObjects(formData);
  };

  const dropdownOptions = [
    {
      label: 'View',
      action: () => navigation.navigate('ViewOnly', { fileData: selectedFile, key: selectedFile.fileID }),
    },
    {
      label: 'Edit',
      action: () => navigation.navigate('File', { fileData: selectedFile, key: selectedFile.fileID }),
    },
    {
      label: 'Delete',
      action: () => {
        closeDropdown();
        deleteInvoiceByFileID(selectedFile.fileID);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.title}>Cloud Files of {user?.email}</Text>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'lightgray' : 'white',
            },
            styles.optionButton,
          ]}
          onPress={() => fetchData()}
        >
          <FontAwesome name="refresh" size={28} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={formDataObjects}
        keyExtractor={(item) => item.fileID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDropdown(item)}>
            <View style={styles.fileItem}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.fileName}>{item.fileName} </Text>
                <Text style={styles.fileDate}>{item.dateModified}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDropdown}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeDropdown}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {dropdownOptions.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    option.action();
                    closeDropdown();
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? 'lightgray' : 'white',
                    },
                    styles.optionButton,
                  ]}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              ))}
              <Pressable onPress={closeDropdown} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  optionText: {
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  cancelText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
