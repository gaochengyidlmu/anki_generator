# http 相关内容

http form 中请求时的数据编码方式，下面正确的是
application/x-www-form-urlencoded 发送前编码所有字段(空格编码为 +，特殊字符编码为 ASCII 十六进制字符)
multipart/form-data 不对字符编码。在使用包含文件上传时，必须使用这个类型
text/plain 空格转换为 + 号，但不对特殊字符编码
application/json json 格式发送数据
ABC
默认会采用 application/x-www-form-urlencoded，根据 get、post 将数据编码在报文的不同位置

http form 请求中，不同请求方式与编码方式，对应的数据位置描述正确的是
GET + application/x-www-form-urlencoded 此时数据编码为 x=1&y=2 放在请求的 url query 部分
GET + multpart/form-data 此时数据编码为 x=1&y=2 放在请求的 url query 部分
POST + application/x-www-form-urlencoded 此时数据编码为 x=1&y=2 放在请求的 url query 部分
POST + multipart/form-data 此时数据分割成多个部分(multipart)，每个部分与表单的内容一一对应，所以在此种传输方式中，能够传递文件，其它的传输方式传递文件，则只会传递对应的 file name，而不会传递具体的 file 内容。
ABCD
