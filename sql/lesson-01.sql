-- SQL 必知必会 第5版：入门教学示例（自编数据）
CREATE TABLE Customers (cust_id TEXT PRIMARY KEY, cust_name TEXT, city TEXT);
CREATE TABLE Products (prod_id TEXT PRIMARY KEY, prod_name TEXT, prod_price REAL);
CREATE TABLE Orders (order_id INTEGER PRIMARY KEY, cust_id TEXT, order_date TEXT);
INSERT INTO Customers VALUES ('C01','张华','北京'),('C02','李敏','上海'),('C03','Kim','首尔');
INSERT INTO Products VALUES ('P01','笔记本',12.5),('P02','钢笔',8.0),('P03','书包',65.0),('P04','鼠标',39.0);
INSERT INTO Orders VALUES (1001,'C01','2026-10-01'),(1002,'C02','2026-10-03'),(1003,'C01','2026-10-05');
SELECT * FROM Products;