'use strict';
const Excel = require('exceljs');
const { color } = require('./utils.js');
const TranslateAnki = require('./TranslateAnki');

/**
 * 根据 Excel 来转 anki 数据
 *
 * @class TranslateAnkiByExcel
 * @extends {TranslateAnki}
 */
class TranslateAnkiByExcel extends TranslateAnki {
  async getData() {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(this.filePath);
    const worksheet = workbook.getWorksheet('anki');
    console.log(color('warning: 文件 sheet 名必须命名为 anki', 'green'));

    // excel 中根据 colKey 的 key 关键词，进行解析
    const colKey = {
      问题: 1,
      选项: [],
      答案: 1,
      注释: 1,
    };
    const data = [];
    worksheet.eachRow(function(row, rowNumber) {
      // 根据第一行的 header，获取对应题目、选项、答案的位置
      if (rowNumber === 1) {
        row.eachCell(function(cell, colNumber) {
          for (const key in colKey) {
            if (cell.value.includes(key)) {
              if (Array.isArray(colKey[key])) colKey[key].push(colNumber);
              else colKey[key] = colNumber;
            }
          }
        });
      }
      // 获取剩余行的数据
      else {
        const datum = {};
        for (const key in colKey) {
          const index = colKey[key];
          if (Array.isArray(index)) {
            datum[key] = [];
            index.forEach(i => {
              datum[key].push(row.getCell(i).value);
            });
            datum[key] = datum[key]
              .filter(i => i)
              .map(i => i.toString().trim())
              .join('***');
          } else {
            datum[key] = (row.getCell(index).value || '').trim();
          }
        }
        data.push(datum);
      }
    });

    return data;
  }
}

module.exports = TranslateAnkiByExcel;
