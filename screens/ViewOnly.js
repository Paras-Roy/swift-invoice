import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import sharePDF from '../utils/Share';

export default function ViewOnly({ route }) {
  const { fileData } = route.params;
  const name = fileData.fileName;
  //   const file = await printToFileAsync({ html:html, base64: false });
  //   await shareAsync(file.uri);
  // }

  // const html = `
  // html>
  //   <head>
  //     <style>
  //       body {
  //         font-family: Arial, Helvetica, sans-serif;
  //       }

  //       .container {
  //         padding: 20px;
  //       }

  //       .header {
  //         display: flex;
  //         align-items: center;
  //         margin-bottom: 20px;
  //       }

  //       .header h1 {
  //         font-size: 36px;
  //         font-weight: bold;
  //       }

  //       .header p {
  //         font-size: 15px;
  //         color: gray;
  //         margin-left: 10px;
  //       }

  //       table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin-top: 20px;
  //       }

  //       table, th, td {
  //         border: 1px solid black;
  //       }

  //       th, td {
  //         padding: 10px;
  //         text-align: left;
  //       }

  //       .total-row {
  //         font-weight: bold;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="container">
  //       <div class="header">
  //         <h1>Invoice</h1>
  //         <p>Last Modified: ${fileData.dateModified}</p>
  //       </div>
  //       <table>
  //         <tr>
  //           <th>Invoice Number</th>
  //           <th>Invoice Date</th>
  //           <th>To</th>
  //           <th>From</th>
  //         </tr>
  //         <tr>
  //           <td>${fileData.invoiceNumber}</td>
  //           <td>${fileData.invoiceDate}</td>
  //           <td>${fileData.toName}<br>${fileData.toAddressLine1}<br>${fileData.toAddressLine2}<br>${fileData.toPhone}</td>
  //           <td>${fileData.fromName}<br>${fileData.fromAddressLine1}<br>${fileData.fromAddressLine2}<br>${fileData.fromPhone}</td>
  //         </tr>
  //       </table>
  //       <table>
  //         <tr>
  //           <th>Description</th>
  //           <th>Amount</th>
  //         </tr>
  //         ${
  //           // Loop throw the array
  //           fileData.items.map((item) => {
  //             return `
  //               <tr>
  //                 <td>${item.description}</td>
  //                 <td>${item.amount}</td>
  //               </tr>
  //             `;
  //           }
  //           ).join('')
  //         }
  //         <tr class="total-row">
  //           <td>Total Amount:</td>
  //           <td>${fileData.totalAmount}</td>
  //         </tr>
  //       </table>
  //     </div>
  //   </body>
  //   </html>
  // `;


  // Calculate total amount
  useEffect(() => {
    const calculatedTotal = fileData.items.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0
    );
    fileData.totalAmount = calculatedTotal;
  }, [fileData.items]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.toolbar}>
        <Button title="Share PDF" onPress={()=>{sharePDF(fileData)}} />
      </View>
      <View style={styles.formTitle}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="receipt-outline" size={24} color="black" />
          <Text style={styles.titleInput}>{fileData.fileName}</Text>
        </View>
        <Text style={styles.titleDate}>Last Modified: {fileData.dateModified.toString()}</Text>
      </View>
      <View style={styles.form}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>Invoice</Text>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Invoice Number</Text>
          <Text style={styles.formInput}>{fileData.invoiceNumber}</Text>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Invoice Date</Text>
          <Text style={styles.formInput}>{fileData.invoiceDate}</Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLeft}>
            <Text style={styles.formLabel}>To</Text>
            <Text style={styles.formInput}>{fileData.toName}</Text>
            <Text style={styles.formInput}>{fileData.toAddressLine1}</Text>
            <Text style={styles.formInput}>{fileData.toAddressLine2}</Text>
            <Text style={styles.formInput}>{fileData.toPhone}</Text>
          </View>
          <View style={styles.formRight}>
            <Text style={styles.formLabel}>From</Text>
            <Text style={styles.formInput}>{fileData.fromName}</Text>
            <Text style={styles.formInput}>{fileData.fromAddressLine1}</Text>
            <Text style={styles.formInput}>{fileData.fromAddressLine2}</Text>
            <Text style={styles.formInput}>{fileData.fromPhone}</Text>
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
          data={fileData.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableDesc, { width: '70%' }]}>{item.description}</Text>
              <Text style={[styles.tableAmt, { width: '20%' }]}>{item.amount.toString()}</Text>
            </View>
          )}
        />
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Total Amount:</Text>
          <Text style={styles.formLabel}>{fileData.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginVertical: 15,
  },
  titleInput: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3a3a3a',
    marginLeft: 10,
  },
  titleDate: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    marginLeft: 10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
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
}
);