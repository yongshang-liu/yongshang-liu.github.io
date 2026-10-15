# SQL Learning Hub · 中文教学

基于 Ben Forta《SQL必知必会》第5版的原创辅助课程。课堂以浏览器 Live Coding 为主，无需安装数据库。

## 开始
1. 打开 https://yongshang-liu.github.io/sql-learning.html
2. 点击“初始化示例数据”（页面加载后会自动初始化）。
3. 选择第01或第02课，点击“运行代码”。
4. 修改 SQL 再运行，观察结果。

## 第01课
- 数据库：有组织的数据集合。
- 表：存放同一类记录；行代表一条记录；列代表属性。
- SELECT：从表中检索数据；星号表示所有列。
- 练习：分别查询 Customers 和 Products 表。

## 第02课
- SELECT prod_name FROM Products：只选择商品名称。
- SELECT prod_name, prod_price FROM Products：检索多个字段。
- DISTINCT：去除重复值。
- 练习：查询所有客户城市，并比较有无 DISTINCT 的结果。

## 说明
本站教学数据与文字为原创，非出版社官方配套文件。SQLite 与 MySQL 等数据库存在语法差异。官方资源：https://forta.com/books/0135182794/
