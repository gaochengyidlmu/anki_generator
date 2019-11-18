# 猪猪 的 anki 模版生成器

## 目的

根据指定 excel 生成对应的 anki 可识别的 excel.csv 文件

## 使用方法

1. [安装 node](https://nodejs.org/en/download/)
2. 下载代码（以下方式二选一）
   1. 如果有 git，使用 `git clone https://github.com/gaochengyidlmu/anki_generator.git`
   2. 直接在本页面下载代码
3. 进入代码文件夹中，将 excel 文件移入文件夹
4. 执行 `node app.js 文件名`，例如 `node app.js example.xlsx`

### excel 模版

可以查看代码文件夹中的 excel.xlsx，按照该模版进行录入数据。
规则：

1. excel 中的选项可以添加多列，每一列的列名以 '选项' 开头即可
2. excel 中的 sheet 名一定要是 anki
