import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { deleteInvoiceByFileID } from '../utils/cloudStorage';

const CloudFileItem = ({ item, navigation }) => {
  const onDelete =async (key) => {
    await deleteInvoiceByFileID(key);
  };
  return (
    <View style={styles.fileItem}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={styles.fileName}>{item.fileName} </Text>
        <Text style={styles.fileDate}>{item.dateModified}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewOnly', { fileData: item, key: item.fileID })}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('File', { fileData: item, key: item.fileID })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.fileID)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CloudFileItem.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
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
});

export default CloudFileItem;
