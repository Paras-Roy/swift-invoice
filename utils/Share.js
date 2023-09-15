import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

export default async function sharePDF(fileData) {
    const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        .container {
          padding: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 36px;
          font-weight: bold;
        }

        .header p {
          font-size: 15px;
          color: gray;
          margin-left: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        table, th, td {
          border: 1px solid black;
        }

        th, td {
          padding: 10px;
          text-align: left;
        }

        .total-row {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice</h1>
          <p>Last Modified: ${fileData.dateModified}</p>
        </div>
        <table>
          <tr>
            <th>Invoice Number</th>
            <th>Invoice Date</th>
            <th>To</th>
            <th>From</th>
          </tr>
          <tr>
            <td>${fileData.invoiceNumber}</td>
            <td>${fileData.invoiceDate}</td>
            <td>${fileData.toName}<br>${fileData.toAddressLine1}<br>${fileData.toAddressLine2}<br>${fileData.toPhone}</td>
            <td>${fileData.fromName}<br>${fileData.fromAddressLine1}<br>${fileData.fromAddressLine2}<br>${fileData.fromPhone}</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          ${
        // Loop throw the array
        fileData.items.map((item) => {
            return `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.amount}</td>
                </tr>
              `;
        }
        ).join('')
        }
          <tr class="total-row">
            <td>Total Amount:</td>
            <td>${fileData.totalAmount}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
    const file = await printToFileAsync({ html: html, base64: false });
    await shareAsync(file.uri);

    return file.uri;
}