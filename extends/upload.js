const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

function upload(ctx) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: ctx.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

      // 文件保存到特定路径
      const destPath = path.join(__dirname, '..', 'upload', filename);
      file.pipe(fs.createWriteStream(destPath));

      // 解析文件结束
      file.on('end', function() {
        console.log(`File [${fieldname}] Finished`);
        ctx.req.file = {
          filePath: destPath,
          filename: filename,
        };
      });
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      resolve('上传结束');
    });
    ctx.req.pipe(busboy);
  });
}

module.exports = upload;
