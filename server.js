const Koa = require('koa');
const Router = require('koa-router');
const parsePostData = require('./extends/parsePostData.js');
const upload = require('./extends/upload.js');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const app = new Koa();
const router = new Router();

// 如果是 post，则解析 body 内的数据
app.use(async (ctx, next) => {
  // 上传文件
  if (ctx.method === 'POST' && ctx.path === '/upload') {
    console.log('上传文件');
    await upload(ctx);
  }
  // 解析 body 内的数据，仅能解析 application/x-www-form-urlencoded
  else if (ctx.method === 'POST') {
    console.log('获取 body 中的数据');
    const data = await parsePostData(ctx);
    ctx.request.body = data;
  }
  await next();
});

router.post('/upload', ctx => {
  const file = ctx.req.file;
  if (!file) {
    return (ctx.body = {
      message: '上传失败',
    });
  }
  ctx.body = {
    message: '上传成功',
  };
});

router.get('/index', async ctx => {
  console.log('获取 index 页面');
  const res = await readFile('./views/index.html', 'utf8');
  ctx.body = res;
});

router.get('/json', ctx => {
  ctx.body = {
    test: 'test1',
  };
});

app.use(router.routes());

const PORT = 6700;
app.listen(PORT, () => console.log('port on ' + PORT));
