var vCardsJS = require('vcards-js');
const fs = require('fs');
const path = require('path');
const ExcelHandler = require('./ExcelHandler.js');
const utils = require('./utils.js');
const moment = require('moment');

module.exports = async function(filePath) {
  const excelHandler = new ExcelHandler();
  const data = await excelHandler.import(filePath, {
    columns: [
      { header: '分配时间', key: 'time', width: 10, type: 'numberDate' },
      { header: '所属行业', key: 'industry', width: 10 },
      { header: '姓名', key: 'lastName', width: 10 },
      { header: '公司', key: 'company', width: 10 },
      { header: '职位', key: 'profession', width: 10 },
      { header: '手机', key: 'mobile', width: 10 },
    ],
  });
  let vCardString = '';

  for (const datum of data) {
    //create a new vCard
    var vCard1 = vCardsJS();

    //set basic properties shown before
    vCard1.firstName = `${moment(datum.time).format('M.D')}-${datum.industry}-${datum.lastName}-${
      datum.company
    }-${datum.profession}`;
    vCard1.cellPhone = datum.mobile;
    vCardString += vCard1.getFormattedString() + '\n';
  }

  const name = utils.getFileName(filePath) + '_' + new Date().valueOf();
  const csvFilePath = path.resolve(path.dirname(filePath), `./${name}.vcf`);
  fs.writeFileSync(csvFilePath, vCardString);
  return csvFilePath;
};
