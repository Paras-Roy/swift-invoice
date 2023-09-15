import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { storeFormData } from '../utils/localStorage';
import uploadInvoice1 from '../utils/cloudStorage';
import { AntDesign, Ionicons} from '@expo/vector-icons';

export default function File({ route }) {
    // Get the navigation prop
    const navigation = useNavigation(); // Get the navigation prop
    const { fileData, key} = route.params; // Get the fileData prop


    // State variables
    const [saved, setSaved] = useState(true);


    // Form variables
    const fileID = fileData.fileID
    const [fileName, setFileName] = useState(fileData.fileName);
    const fileType = fileData.fileType
    const authorID = fileData.authorID
    const [dateModified, setDateModified] = useState(fileData.dateModified);
    const [invoiceNumber, setInvoiceNumber] = useState(fileData.invoiceNumber);
    const [invoiceDate, setInvoiceDate] = useState(fileData.invoiceDate);
    const [toName, setToName] = useState(fileData.toName);
    const [toAddressLine1, setToAddressLine1] = useState(fileData.toAddressLine1);
    const [toAddressLine2, setToAddressLine2] = useState(fileData.toAddressLine2);
    const [toPhone, setToPhone] = useState(fileData.toPhone);
    const [fromName, setFromName] = useState(fileData.fromName);
    const [fromAddressLine1, setFromAddressLine1] = useState(fileData.fromAddressLine1);
    const [fromAddressLine2, setFromAddressLine2] = useState(fileData.fromAddressLine2);
    const [fromPhone, setFromPhone] = useState(fileData.fromPhone);
    const [items, setItems] = useState(fileData.items);
    const [totalAmount, setTotalAmount] = useState(fileData.totalAmount);

    // Update the value and set saved to false
    const updateValue = (value, setter) => {
        setter(value);
        setSaved(false);
    }
    // Add item to the list
    const addItem = () => {
        const newItem = {
            description: '',
            amount: 0,
        };
        setItems([...items, newItem]);
        setSaved(false);
    };

    const resetForm = () => {
        setFileName(fileData.fileName);
        setDateModified(fileData.dateModified);
        setInvoiceNumber(fileData.invoiceNumber);
        setInvoiceDate(fileData.invoiceDate);
        setToName(fileData.toName);
        setToAddressLine1(fileData.toAddressLine1);
        setToAddressLine2(fileData.toAddressLine2);
        setToPhone(fileData.toPhone);
        setFromName(fileData.fromName);
        setFromAddressLine1(fileData.fromAddressLine1);
        setFromAddressLine2(fileData.fromAddressLine2);
        setFromPhone(fileData.fromPhone);
        setItems(fileData.items);
        setTotalAmount(fileData.totalAmount);
        setSaved(true);
    };

    // Update item description or amount
    const updateItem = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
        setSaved(false);
    };

    // Function to delete an item by index
    const deleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
        setSaved(false);
    };

    // Calculate total amount
    useEffect(() => {
        const calculatedTotal = items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
        setTotalAmount(calculatedTotal);
    }, [items]);

    // Use useEffect to listen for changes in navigation state
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // If data is not saved, prevent navigation and display an alert
            if (!saved) {
                e.preventDefault();
                Alert.alert(
                    'Unsaved Changes',
                    'Please save your changes before going back.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Save',
                            onPress: () => handleSave(),
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => navigation.dispatch(e.data.action),
                        }
                    ],
                    { cancelable: false }
                );
            }

            else {
                // Reset the form
                resetForm();
            }
        });

        return unsubscribe;
    }, [navigation, saved]);

    // Handle the save button
    const handleSave = async () => {
        try {
          setSaved(true);
          setDateModified(new Date().toLocaleDateString());
      
          // Assuming storeFormData is an async function
          await storeFormData({
            fileID,
            authorID,
            fileName,
            fileType,
            dateModified,
            invoiceNumber,
            invoiceDate,
            toName,
            toAddressLine1,
            toAddressLine2,
            toPhone,
            fromName,
            fromAddressLine1,
            fromAddressLine2,
            fromPhone,
            items ,
            totalAmount,
          });
      
          console.log('Data saved successfully');
        } catch (error) {
          console.error('Error saving data:', error);
          // You might want to display an error message to the user here
        }
      };

    const handleCloudSave = async () => {
        try{
            setSaved(true);
            setDateModified(new Date().toLocaleDateString());
            await uploadInvoice1({
                fileID,
                authorID,
                fileName,
                fileType,
                dateModified,
                invoiceNumber,
                invoiceDate,
                toName,
                toAddressLine1,
                toAddressLine2,

                toPhone,
                fromName,
                fromAddressLine1,
                fromAddressLine2,
                fromPhone,
                items,
                totalAmount,
            });
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
            // You might want to display an error message to the user here
        }

    };


      

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.toolbar}>
                <Button title="Local Save" onPress={handleSave} />
                <Button title="Reset" onPress={resetForm} />
                <Button title="Cloud Save" onPress={handleCloudSave} />
            </View>
            <View style={styles.formTitle}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="receipt-outline" size={24} color="black" />
                <TextInput style={styles.titleInput} value={fileName} placeholder='File Name' onChangeText={(value) => updateValue(value, setFileName)} />
                    </View>
                <Text style={styles.titleDate}>Last Modified; {dateModified.toString()}</Text>
            </View>
            <View style={styles.form}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', }}>Invoice</Text>
                <View style={styles.formRow}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Invoice Number</Text>
                        <TextInput style={styles.formInput} keyboardType='numeric' value={invoiceNumber} placeholder='Invoice Number' onChangeText={(value) => updateValue(value, setInvoiceNumber)} />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Invoice Date</Text>
                        <TextInput style={styles.formInput} value={invoiceDate} placeholder='Invoice Date' onChangeText={(value) => updateValue(value, setInvoiceDate)} />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLeft}>
                        <Text style={styles.formLabel}>To</Text>
                        <TextInput style={styles.formInput} value={toName} placeholder='Name' onChangeText={(value) => updateValue(value, setToName)} />
                        <TextInput style={styles.formInput} value={toAddressLine1} placeholder='Address Line 1' onChangeText={(value) => updateValue(value, setToAddressLine1)} />
                        <TextInput style={styles.formInput} value={toAddressLine2} placeholder='Address Line 2' onChangeText={(value) => updateValue(value, setToAddressLine2)} />
                        <TextInput style={styles.formInput} value={toPhone} placeholder='Phone' onChangeText={(value) => updateValue(value, setToPhone)} />
                    </View>
                    <View style={styles.formRight}>
                        <Text style={styles.formLabel}>From</Text>
                        <TextInput style={styles.formInput} value={fromName} placeholder='Name' onChangeText={(value) => updateValue(value, setFromName)} />
                        <TextInput style={styles.formInput} value={fromAddressLine1} placeholder='Address Line 1' onChangeText={(value) => updateValue(value, setFromAddressLine1)} />
                        <TextInput style={styles.formInput} value={fromAddressLine2} placeholder='Address Line 2' onChangeText={(value) => updateValue(value, setFromAddressLine2)} />
                        <TextInput style={styles.formInput} value={fromPhone} placeholder='Phone' onChangeText={(value) => updateValue(value, setFromPhone)} />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.descHeader}>
                        <Text style={styles.formLabel}>Description</Text>
                    </View>
                    <View style={styles.amountHeader}>
                        <Text style={styles.formLabel}>Amount</Text>
                    </View>
                </View>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.tableRow}>
                            <TextInput
                                style={[styles.tableDesc, { width: '70%' }]}
                                value={item.description}
                                placeholder='Description'
                                onChangeText={(value) => updateItem(index, 'description', value)}
                            />
                            <TextInput
                                style={[styles.tableAmt, { width: '20%' }]}
                                value={item.amount.toString()}
                                placeholder='Amount'
                                onChangeText={(value) => updateItem(index, 'amount', value)}
                                keyboardType='numeric'
                            />
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteItem(index)}
                            >
                                <Text style={styles.deleteButtonText}><AntDesign name="delete" size={24} color="black" /></Text>
                            </TouchableOpacity>

                        </View>
                    )}
                />
                <Button
                    title="Add Item"
                    onPress={addItem}
                    style={styles.addItemButton}
                />
                {/* <Text style={styles.formLabel}>Total Amount: {totalAmount.toFixed(2)}</Text> */}
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Total Amount: </Text>
                    <Text style={styles.formLabel}>{totalAmount.toFixed(2)}</Text>
                    </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
    },
    formTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingHorizontal: 30,
        paddingBottom: 15,
    },
    titleInput: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        //text color light black
        color: '#3a3a3a',

        marginLeft: 10,
    },
    titleDate: {
        fontSize: 15,
        color: 'gray',
        textAlign: 'center',
        marginLeft: 10,
    },
    formRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    formLeft: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '50%',
        gap: 10,
    },
    formRight: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '50%',
        gap: 10,
    },
    formLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 20,
    },
    formInput: {
        fontSize: 20,
    },
    descHeader: {
        width: '77%',
        alignItems: 'left',
    },
    amountHeader: {
        width: '28%',
        // alignItems: 'center',
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    tableDesc: {
        fontSize: 20,
    },
    tableAmt: {
        fontSize: 20,
        textAlign: 'center',
    },
    deleteButton: {
        borderRadius: 5,
        paddingHorizontal  : 10,
    },
        
});
