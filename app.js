const Excel = require('exceljs');
const path = require('path');
const { color } = require('./utils.js');

async function getQuestions(filePath) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('anki');
  console.log(color('文件 sheet 名必须命名为 anki', 'green'));

  const colKey = {
    问题: 0,
    选项: [],
    答案: 0,
    注释: 0,
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

async function generator(data, filePath) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('anki');
  data.forEach(datum => {
    worksheet.addRow(Object.values(datum));
  });

  const filename = path.basename(filePath, path.extname(filePath));
  await workbook.csv.writeFile(path.resolve(path.dirname(filePath), `./${filename}.csv`));
}

async function run() {
  const filePath = getFilePath();
  const data = await getQuestions(filePath);
  await generator(data, filePath);
}

function getFilePath() {
  let filePath = process.argv[2];
  if (!filePath)
    throw new Error(
      `请传入文件路径(如果不清楚，则直接将 excel 文件放在当前文件夹，参数传 excel 文件名)
       示例：node app.js example.xlsx
      `,
    );

  filePath = path.resolve(__dirname, filePath);
  return filePath;
}

run()
  .then(() => {
    console.log('文件生成完毕，请在当前目录检查生成的 csv 文件');
    process.exit();
  })
  .catch(e => {
    console.error(color(e.message, 'red'));
    process.exit();
  });
