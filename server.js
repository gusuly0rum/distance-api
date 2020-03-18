const Excel = require('exceljs');
// const Excel = require('excel4node');
const express = require('express');
const Socket = require('socket.io');
const readXlsxFile = require('read-excel-file/node');

const app = express();
const server = app.listen(5000);
app.use(express.static('public'));
const io = Socket(server);

var workbook = new Excel.Workbook();
// const workbook = new Excel.Workbook('/Users/donguk/Downloads/results.xlsx');
// const worksheet = workbook.addWorksheet('Sheet1');

io.sockets.on('connection', (socket) => {
  const hospitalNames = [];

  readXlsxFile('/Users/donguk/Downloads/dist.xlsx').then(rows => {
    hospitalNames.push(rows[0].slice(1, rows[0].length));
  }).then(() => {
    socket.emit('connection', hospitalNames);
    socket.on('response', (response) => writeToExcel(response));
  });
});

function writeToExcel(response) {

  const row = response[0];
  const col = response[1];
  const origin = response[2].request.origin.query;
  const destin = response[2].request.destination.query;
  const distance = response[2].routes[0].legs[0].distance.text;
  console.log('(' + col + '/55)' + origin + ' -> ' + destin + '=' + distance);

  workbook.xlsx.readFile('/Users/donguk/Downloads/results.xlsx')
    .then(() => {
      var worksheet = workbook.getWorksheet(1);

      // worksheet.cell(col + 2, 1).string(origin);
      // worksheet.cell(1, col + 2).string(destin);
      // worksheet.cell(row + 2, col + 2).string(distance);
      // worksheet.cell(col + 2, row + 2).string(distance);

      worksheet.getRow(row + 2).getCell(1).value = origin;
      worksheet.getRow(1).getCell(col + 2).value = destin;
      worksheet.getRow(row + 2).getCell(col + 2).value = distance;
      worksheet.getRow(col + 2).getCell(row + 2).value = distance;
      workbook.xlsx.writeFile('/Users/donguk/Downloads/results.xlsx');
    });
  
  // workbook.write('/Users/donguk/Downloads/results.xlsx');
}