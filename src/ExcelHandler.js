'use strict';

const Excel = require('exceljs');
const path = require('path');
const debug = require('debug')('matrix:excel');
const moment = require('moment');

class ExcelHandler {
  constructor() {
    this.workbook = new Excel.Workbook();
    this.sheetNums = 0;
  }

  /**
   * 导出 Excel
   *
   * @param {String} filePath 导出的文件路径
   * @param {Array} columns 列数组
   * @param {String} columns.header 列数组
   * @param {Array} rows 行数据
   * @memberof ExcelHandler
   *
   * @example
   * columns = [
   *  { header: '自增序号', key: 'seq', width: 10 },
   *  { header: 'Id', key: '_id', width: 10 }
   * ]
   * // header 是 excel 中展示的列明
   * // key 是行数据中的 key
   *
   * rows = [
   *  {
   *    seq: 1,
   *    _id: '435-23406-435',
   *  }
   * ];
   * 行数据需要与 columns 中的数据对应上
   */
  async export(filePath, columns, rows) {
    const sheet = this.workbook.addWorksheet(`sheet${++this.sheetNums}`);
    sheet.columns = columns;
    sheet.addRows(rows);
    await this.workbook.xlsx.writeFile(filePath);
    debug(filePath + ':文件已导出');
  }

  async import(filePath, options = {}) {
    const extname = path.extname(filePath);
    if (extname === '.csv') {
      await this.workbook.csv.readFile(filePath);
    } else await this.workbook.xlsx.readFile(filePath);
    const data = [];
    let sheet;
    this.workbook.eachSheet(function(worksheet) {
      if (!sheet) sheet = worksheet;
    });
    sheet.eachRow(function(row, rowNumber) {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
        rowData.push(cell.text.trim());
      });
      data.push(rowData);
    });
    const { columns } = options;
    if (!columns) return data;
    return this.parseRows(data, columns);
  }

  /**
   * 解析行数据
   * 如果文件之前是根据 columns 生成的，那么可以使用之前的 columns 将数据还原
   *
   * @param {Array} data 数据源
   * @param {Array} columns 列
   * @return {Array} 解析后的数据
   * @memberof ExcelHandler
   */
  parseRows(data, columns) {
    const headerMap = columns.reduce((obj, column) => {
      obj[column.header] = column.key;
      return obj;
    }, {});
    const headers = data[0];
    const keyMap = headers.reduce((obj, header, index) => {
      const key = headerMap[header];
      if (!key) return obj;
      obj[index] = key;
      return obj;
    }, {});

    const results = [];
    const rows = data.slice(1);
    for (const row of rows) {
      const datum = {};
      row.forEach((cell, index) => {
        const key = keyMap[index];
        const columnCfg = columns.find(column => column.key === key);
        if (!key) return;
        // 如果值是 number 型的日期，则转化为标准日期格式
        if (columnCfg.type === 'numberDate') {
          datum[key] = moment('1900-01-01').add(parseInt(cell - 2), 'days');
        } else datum[key] = cell;
      });
      results.push(datum);
    }
    return results;
  }

  getExt(filePath) {
    return;
  }
}

module.exports = ExcelHandler;
