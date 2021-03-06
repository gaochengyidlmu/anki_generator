'use strict';
const Excel = require('exceljs');
const path = require('path');
const { color } = require('./utils.js');

class TranslateAnki {
  constructor(filePath) {
    this.filePath = this.getFilePath(filePath);
  }

  /**
   * getFilePath 获取文件路径
   *
   * @returns {String}
   * @memberof TranslateAnki
   */
  getFilePath(filePath) {
    if (!filePath)
      throw new Error(
        `请传入文件路径(如果不清楚，则直接将 excel 文件放在当前文件夹，参数传 excel 文件名)
       示例：node app.js example.xlsx / node app.js XXX.md
       目前支持 xlsx / md 两种格式
      `,
      );

    return path.resolve(__dirname, '..', filePath);
  }

  /**
   * 返回标准格式的数据，用于 write 方法中进行写入 csv 文件
   * 本方法是抽象方法，需要子类实现
   * @memberof TranslateAnki
   * @example
   * [{
   *  question: 问题,
   *  options: 选项1***选项2***选项3
   *  answer: 答案
   *  remark: 注释
   * }]
   */
  getData() {
    throw new Error('this method is abstract.');
  }

  /**
   * write 写入 csv 文件
   * 通过 getData 获取数据，然后写入文件
   *
   * @param {Object} data 解析的格式化数据
   * @memberof TranslateAnki
   */
  async write(data) {
    if (!data.length) throw new Error('无数据');
    let dataArr = data;

    const filePaths = [];
    for (let { data, name } of dataArr) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(name);
      data.forEach((datum) => {
        worksheet.addRow(Object.values(datum));
      });

      name = name + '_' + new Date().valueOf();
      const csvFilePath = path.resolve(path.dirname(this.filePath), `./${name}.csv`);
      await workbook.csv.writeFile(csvFilePath);
      filePaths.push(csvFilePath);
    }

    return filePaths;
  }
}

module.exports = TranslateAnki;
