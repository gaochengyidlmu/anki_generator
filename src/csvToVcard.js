var vCardsJS = require('vcards-js');
const fs = require('fs');
const path = require('path');
const ExcelHandler = require('./ExcelHandler.js');
const utils = require('./utils.js');

module.exports = async function(filePath) {
  const excelHandler = new ExcelHandler();
  const data = await excelHandler.import(filePath, {
    columns: [
      { header: '姓', key: 'lastName', width: 10 },
      { header: '名', key: 'firstName', width: 10 },
      { header: '移动电话', key: 'phone', width: 10 },
    ],
  });
  let vCardString = '';

  for (const datum of data) {
    //create a new vCard
    var vCard1 = vCardsJS();

    //set basic properties shown before
    vCard1.firstName = datum.lastName;
    vCard1.cellPhone = datum.phone;
    vCardString += vCard1.getFormattedString() + '\n';
  }

  const name = utils.getFileName(filePath) + '_' + new Date().valueOf();
  const csvFilePath = path.resolve(path.dirname(filePath), `./${name}.vcf`);
  fs.writeFileSync(csvFilePath, vCardString);
  return csvFilePath;
};
