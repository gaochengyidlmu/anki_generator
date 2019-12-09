function parsePostData(ctx) {
  let postData = '';
  return new Promise((resolve, reject) => {
    try {
      ctx.req.addListener('data', function(chunk) {
        postData += chunk;
      });
      ctx.req.addListener('end', function() {
        const parsedData = parseQueryData(postData);
        resolve(parsedData);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function parseQueryData(data) {
  const parsedData = {};
  let queryStrList = data.split('&');
  for (const item of queryStrList) {
    const [key, value] = item.split('=');
    parsedData[key] = value;
  }
  console.log('parsedData: ', parsedData);
  return parsedData;
}

module.exports = parsePostData;
