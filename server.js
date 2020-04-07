const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const koaBody = require('koa-body');
const send = require('koa-send');
const moment = require('moment');
const path = require('path');
const generatorCSV = require('./app.js');
const views = require('koa-views');

const app = new Koa();
app.use(
  views(path.join(__dirname, 'views'), {
    map: {
      html: 'ejs',
    },
  }),
);
const router = new Router();
const isProduction = process.env.NODE_ENV === 'production';

// nginx 二级子目录
const subPath = isProduction ? '/anki_generator/' : '/';

router.get('/', (ctx) => {
  const redirectPath = path.join(subPath, '/index');
  ctx.redirect(redirectPath);
});

router.get('/index', async (ctx) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': 获取 index 页面');
  await ctx.render('index.ejs', {
    subPath,
  });
});

// 支持 upload 中间件
app.use(
  koaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, 'upload/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => {
        // 获取文件后缀
        const ext = path.extname(file.name);
        let filename = path.basename(file.name);
        filename = filename.split(ext)[0] + '_' + new Date().valueOf() + ext;

        // 最终要保存到的文件夹目录
        file.path = path.join(__dirname, `upload/${filename}`);
      },
    },
  }),
);

router.post('/api/upload', async (ctx) => {
  const files = ctx.request.files;
  if (!files || !files.file) {
    return (ctx.body = {
      code: 2,
      message: '上传失败',
    });
  }
  const filePath = files.file.path;
  let csvFilePaths;
  try {
    csvFilePaths = await generatorCSV(filePath);
  } catch (err) {
    return (ctx.body = {
      code: 2,
      message: 'CSV 生成失败，请联系作者：gaochengyidlmu@163.com\n' + err.message,
    });
  }
  // fs.unlinkSync(filePath);
  const filePaths = csvFilePaths.map((filePath) => path.basename(filePath));
  console.log('filePaths: ', filePaths);
  ctx.body = {
    code: 1,
    message: '上传成功',
    filePaths,
  };
});

router.get('/api/download/:name', async (ctx) => {
  const name = ctx.params.name;
  const filePath = `upload/${name}`;
  ctx.attachment(filePath);
  await send(ctx, filePath);
  setTimeout(() => {
    const filename = path.basename(filePath);
    // 如果是范例，则不删除文件，其它的下载完成后，删除文件
    if (filename === 'example.xlsx') return;
    fs.unlink(filePath, () => {
      console.log('文件' + filePath + ': 移除成功');
    });
  }, 10 * 1000);
});

app.use(router.routes());

const PORT = 6700;
app.listen(PORT, () => console.log('port on http://localhost:' + PORT));
