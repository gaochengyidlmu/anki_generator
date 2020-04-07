'use strict';
const path = require('path');
const { color } = require('./utils.js');
const TranslateAnki = require('./TranslateAnki');
const fs = require('fs');

class TranslateAnkiByMd extends TranslateAnki {
  /**
   * 从 md 中获取数据，md 中的书写规则
   * 1. 使用 5 个@符号及以上，来分隔题目+答案
   * 2. 第一行是问题
   * 3. 最后一行是备注，如果检测到全是英文字符，则代表是答案
   * 4. 如果最后一行是倍数，那么倒数第二行是答案
   * 5. 题目与答案之间的数据，都是选项
   *
   * @memberof TranslateAnkiByMd
   */
  async getData() {
    const file = fs.readFileSync(this.filePath, 'utf8');
    const QAList = file.split(/@+/);
    const data = QAList.map((QA) => {
      // 对 QA 字符串做处理，转化为字符数组
      QA = QA.split('\n')
        .map((i) => i.trim())
        .filter((i) => {
          if (!i) return false;
          if (i.startsWith('#')) return false;
          return true;
        });

      const colKey = {
        question: 0,
        options: [],
        answer: QA.length - 2,
        remark: QA.length - 1,
      };

      // 检测最后一行是否全部都是英文字符
      const test = new RegExp(/^[a-z]+$/i);
      if (test.test(QA[colKey.remark])) {
        colKey.remark = QA.length;
        colKey.answer = QA.length - 1;
      }

      // 添加 options 中的索引
      for (let i = colKey.question + 1; i < colKey.answer; i++) {
        colKey.options.push(i);
      }

      const datum = {};

      for (const key in colKey) {
        const index = colKey[key];
        if (Array.isArray(index)) {
          datum[key] = [];
          index.forEach((i) => {
            datum[key].push(QA[i]);
          });
          datum[key] = datum[key]
            .filter((i) => i)
            .map((i) => i.toString().trim())
            .join('***');
        } else {
          datum[key] = (QA[index] || '').trim();
        }
      }
      return datum;
    });
    return [{ data, name: 'anki' }];
  }
}

module.exports = TranslateAnkiByMd;
