-- SQL Learning Hub 原创金融教学数据（SQLite）
-- 虚构公司、借款人、账户与交易；不对应真实个人或机构。
PRAGMA foreign_keys = ON;

CREATE TABLE companies (
  company_id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  founded_year INTEGER,
  city TEXT
);
CREATE TABLE financials (
  company_id INTEGER NOT NULL,
  fiscal_year INTEGER NOT NULL,
  revenue_m REAL NOT NULL,
  net_income_m REAL NOT NULL,
  assets_m REAL NOT NULL,
  liabilities_m REAL NOT NULL,
  PRIMARY KEY (company_id, fiscal_year),
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);
CREATE TABLE borrowers (
  borrower_id INTEGER PRIMARY KEY,
  borrower_name TEXT NOT NULL,
  segment TEXT NOT NULL,
  risk_grade TEXT NOT NULL,
  city TEXT
);
CREATE TABLE loans (
  loan_id INTEGER PRIMARY KEY,
  borrower_id INTEGER NOT NULL,
  principal REAL NOT NULL,
  balance REAL NOT NULL,
  annual_rate REAL NOT NULL,
  start_date TEXT NOT NULL,
  status TEXT NOT NULL,
  days_past_due INTEGER DEFAULT 0,
  FOREIGN KEY (borrower_id) REFERENCES borrowers(borrower_id)
);
CREATE TABLE payments (
  payment_id INTEGER PRIMARY KEY,
  loan_id INTEGER NOT NULL,
  payment_date TEXT NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);
CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  investor_name TEXT NOT NULL,
  investor_type TEXT NOT NULL,
  opened_date TEXT NOT NULL
);
CREATE TABLE securities (
  symbol TEXT PRIMARY KEY,
  security_name TEXT NOT NULL,
  sector TEXT NOT NULL
);
CREATE TABLE trades (
  trade_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  trade_date TEXT NOT NULL,
  side TEXT NOT NULL CHECK(side IN ('BUY','SELL')),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  fee REAL DEFAULT 0,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id),
  FOREIGN KEY (symbol) REFERENCES securities(symbol)
);

INSERT INTO companies VALUES
  (1,'北辰智能','科技',2015,'北京'),(2,'海岳能源','新能源',2011,'青岛'),
  (3,'澄江消费','消费',2008,'杭州'),(4,'远川物流','交通运输',2017,'成都'),
  (5,'青禾医疗','医疗健康',2013,'苏州'),(6,'云帆数据','科技',2020,'深圳');
INSERT INTO financials VALUES
  (1,2024,820,96,1100,420),(1,2025,1010,128,1360,515),
  (2,2024,1460,115,2780,1510),(2,2025,1625,142,3010,1590),
  (3,2024,690,54,920,360),(3,2025,735,48,955,388),
  (4,2024,510,-18,760,505),(4,2025,620,22,810,520),
  (5,2024,940,133,1700,610),(5,2025,1085,161,1880,655),
  (6,2024,180,-42,310,175),(6,2025,315,-12,470,248);
INSERT INTO borrowers VALUES
  (101,'星原制造','企业','A','天津'),(102,'晨露餐饮','小微','B','南京'),
  (103,'林岚','个人','A','上海'),(104,'河谷商贸','小微','C','武汉'),
  (105,'苏明','个人','B','广州'),(106,'新途材料','企业','D','合肥');
INSERT INTO loans VALUES
  (1001,101,1200000,760000,0.052,'2024-03-15','正常',0),
  (1002,102,320000,245000,0.068,'2025-01-10','正常',0),
  (1003,103,680000,610000,0.041,'2023-09-01','正常',0),
  (1004,104,450000,402000,0.079,'2024-11-20','关注',18),
  (1005,105,210000,198000,0.063,'2025-05-08','逾期',47),
  (1006,106,1800000,1690000,0.086,'2024-06-30','逾期',92),
  (1007,101,500000,0,0.049,'2022-02-12','结清',0);
INSERT INTO payments VALUES
  (1,1001,'2025-08-15',48000),(2,1001,'2025-09-15',48000),
  (3,1002,'2025-09-10',13500),(4,1003,'2025-09-01',8200),
  (5,1004,'2025-08-20',9000),(6,1005,'2025-07-08',4300),
  (7,1006,'2025-06-30',22000),(8,1002,'2025-08-10',13500);
INSERT INTO accounts VALUES
  (201,'稳健成长基金','机构','2022-01-05'),(202,'明远资本','机构','2021-06-18'),
  (203,'陈曦','个人','2024-02-11'),(204,'周宁','个人','2025-01-20');
INSERT INTO securities VALUES
  ('BCAI','北辰智能','科技'),('HYE','海岳能源','新能源'),
  ('QHM','青禾医疗','医疗健康'),('CYX','澄江消费','消费');
INSERT INTO trades VALUES
  (1,201,'BCAI','2025-09-01','BUY',1200,42.50,18),
  (2,201,'QHM','2025-09-02','BUY',800,68.20,15),
  (3,202,'HYE','2025-09-01','BUY',2500,21.30,25),
  (4,202,'BCAI','2025-09-05','SELL',600,45.10,12),
  (5,203,'CYX','2025-09-03','BUY',300,32.80,6),
  (6,203,'BCAI','2025-09-08','BUY',200,44.60,5),
  (7,204,'QHM','2025-09-09','BUY',150,70.00,5),
  (8,201,'BCAI','2025-09-10','SELL',400,46.20,10),
  (9,204,'HYE','2025-09-12','BUY',500,20.90,6),
  (10,202,'HYE','2025-09-15','SELL',1000,22.10,12);
