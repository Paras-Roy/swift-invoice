import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Modal, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAllFormData, deleteFormData } from '../utils/localStorage';
import useAuth from '../utils/useAuth';
import sharePDF from '../utils/Share';

export default function LocalFiles({ navigation }) {
  const { user } = useAuth();
  const defaultData1 = {
    fileID: Math.floor(Math.random() * 100000000), //better way to generate id can be used

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
  const [selectedFile, setSelectedFile] = useState(null); // Track the file selected for the dropdown
  const [modalVisible, setModalVisible] = useState(false); // Control the visibility of the dropdown modal
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

  const openDropdown = (file) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const closeDropdown = () => {
    setSelectedFile(null);
    setModalVisible(false);
  };

  const dropdownOptions = [
    {
      label: 'Share',
      action: () => sharePDF(selectedFile.data),
    },
    {
      label: 'View',
      action: () => navigation.navigate('ViewOnly', { fileData: selectedFile.data, key: selectedFile.key }),
    },
    {
      label: 'Edit',
      action: () => navigation.navigate('File', { fileData: selectedFile.data, key: selectedFile.key }),
    },
    {
      label: 'Delete',
      action: () => {
        closeDropdown();
        deleteFile(selectedFile.key);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Local Files of {user?.email}</Text>

      <FlatList
        data={formDataObjects}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDropdown(item)}>
            <View style={styles.fileItem}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.fileName}>{item.data.fileName} </Text>
                <Text style={styles.fileDate}>{item.data.dateModified}</Text>
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
