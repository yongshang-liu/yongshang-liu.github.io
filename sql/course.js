(function(){
const seed=`PRAGMA foreign_keys=ON;
CREATE TABLE companies(company_id INTEGER PRIMARY KEY,company_name TEXT NOT NULL,industry TEXT NOT NULL,founded_year INTEGER,city TEXT);
CREATE TABLE financials(company_id INTEGER NOT NULL,fiscal_year INTEGER NOT NULL,revenue_m REAL NOT NULL,net_income_m REAL NOT NULL,assets_m REAL NOT NULL,liabilities_m REAL NOT NULL,PRIMARY KEY(company_id,fiscal_year),FOREIGN KEY(company_id) REFERENCES companies(company_id));
CREATE TABLE borrowers(borrower_id INTEGER PRIMARY KEY,borrower_name TEXT NOT NULL,segment TEXT NOT NULL,risk_grade TEXT NOT NULL,city TEXT);
CREATE TABLE loans(loan_id INTEGER PRIMARY KEY,borrower_id INTEGER NOT NULL,principal REAL NOT NULL,balance REAL NOT NULL,annual_rate REAL NOT NULL,start_date TEXT NOT NULL,status TEXT NOT NULL,days_past_due INTEGER DEFAULT 0,FOREIGN KEY(borrower_id) REFERENCES borrowers(borrower_id));
CREATE TABLE payments(payment_id INTEGER PRIMARY KEY,loan_id INTEGER NOT NULL,payment_date TEXT NOT NULL,amount REAL NOT NULL,FOREIGN KEY(loan_id) REFERENCES loans(loan_id));
CREATE TABLE accounts(account_id INTEGER PRIMARY KEY,investor_name TEXT NOT NULL,investor_type TEXT NOT NULL,opened_date TEXT NOT NULL);
CREATE TABLE securities(symbol TEXT PRIMARY KEY,security_name TEXT NOT NULL,sector TEXT NOT NULL);
CREATE TABLE trades(trade_id INTEGER PRIMARY KEY,account_id INTEGER NOT NULL,symbol TEXT NOT NULL,trade_date TEXT NOT NULL,side TEXT NOT NULL CHECK(side IN ('BUY','SELL')),quantity INTEGER NOT NULL,price REAL NOT NULL,fee REAL DEFAULT 0,FOREIGN KEY(account_id) REFERENCES accounts(account_id),FOREIGN KEY(symbol) REFERENCES securities(symbol));
INSERT INTO companies VALUES (1,'北辰智能','科技',2015,'北京'),(2,'海岳能源','新能源',2011,'青岛'),(3,'澄江消费','消费',2008,'杭州'),(4,'远川物流','交通运输',2017,'成都'),(5,'青禾医疗','医疗健康',2013,'苏州'),(6,'云帆数据','科技',2020,'深圳');
INSERT INTO financials VALUES (1,2024,820,96,1100,420),(1,2025,1010,128,1360,515),(2,2024,1460,115,2780,1510),(2,2025,1625,142,3010,1590),(3,2024,690,54,920,360),(3,2025,735,48,955,388),(4,2024,510,-18,760,505),(4,2025,620,22,810,520),(5,2024,940,133,1700,610),(5,2025,1085,161,1880,655),(6,2024,180,-42,310,175),(6,2025,315,-12,470,248);
INSERT INTO borrowers VALUES (101,'星原制造','企业','A','天津'),(102,'晨露餐饮','小微','B','南京'),(103,'林岚','个人','A','上海'),(104,'河谷商贸','小微','C','武汉'),(105,'苏明','个人','B','广州'),(106,'新途材料','企业','D','合肥');
INSERT INTO loans VALUES (1001,101,1200000,760000,0.052,'2024-03-15','正常',0),(1002,102,320000,245000,0.068,'2025-01-10','正常',0),(1003,103,680000,610000,0.041,'2023-09-01','正常',0),(1004,104,450000,402000,0.079,'2024-11-20','关注',18),(1005,105,210000,198000,0.063,'2025-05-08','逾期',47),(1006,106,1800000,1690000,0.086,'2024-06-30','逾期',92),(1007,101,500000,0,0.049,'2022-02-12','结清',0);
INSERT INTO payments VALUES (1,1001,'2025-08-15',48000),(2,1001,'2025-09-15',48000),(3,1002,'2025-09-10',13500),(4,1003,'2025-09-01',8200),(5,1004,'2025-08-20',9000),(6,1005,'2025-07-08',4300),(7,1006,'2025-06-30',22000),(8,1002,'2025-08-10',13500);
INSERT INTO accounts VALUES (201,'稳健成长基金','机构','2022-01-05'),(202,'明远资本','机构','2021-06-18'),(203,'陈曦','个人','2024-02-11'),(204,'周宁','个人','2025-01-20');
INSERT INTO securities VALUES ('BCAI','北辰智能','科技'),('HYE','海岳能源','新能源'),('QHM','青禾医疗','医疗健康'),('CYX','澄江消费','消费');
INSERT INTO trades VALUES (1,201,'BCAI','2025-09-01','BUY',1200,42.50,18),(2,201,'QHM','2025-09-02','BUY',800,68.20,15),(3,202,'HYE','2025-09-01','BUY',2500,21.30,25),(4,202,'BCAI','2025-09-05','SELL',600,45.10,12),(5,203,'CYX','2025-09-03','BUY',300,32.80,6),(6,203,'BCAI','2025-09-08','BUY',200,44.60,5),(7,204,'QHM','2025-09-09','BUY',150,70.00,5),(8,201,'BCAI','2025-09-10','SELL',400,46.20,10),(9,204,'HYE','2025-09-12','BUY',500,20.90,6),(10,202,'HYE','2025-09-15','SELL',1000,22.10,12);`;

const lessons=[
{
title:'数据库、表与第一条查询',
objective:'理解关系数据库的基本结构，并用 SELECT 从一张表读取需要的列。',
concepts:[['表、行、列','表描述一类对象，行是一条记录，列是对象的属性。'],['只取所需列','明确列名比长期使用星号更稳定，也能减少无用数据。']],
exampleNote:'先观察公司表，再比较“指定列”和“全部列”的结果。',
sql:`-- 指定列：适合正式分析\nSELECT company_id, company_name, industry\nFROM companies;\n\n-- 星号：适合快速探索\nSELECT * FROM companies;`,
exercise:'查询 borrowers 表中的借款人编号、姓名与风险等级。',
exerciseSql:`-- 补全列名和表名\nSELECT /* 在这里写三列 */\nFROM /* 在这里写表名 */;`,
answer:`SELECT borrower_id, borrower_name, risk_grade\nFROM borrowers;`,
answerNote:'结果应有 6 行，每行代表一个虚构借款人。'
},
{
title:'检索、去重与限制行数',
objective:'掌握 DISTINCT、LIMIT 和列别名，快速看清数据中有哪些类别。',
concepts:[['DISTINCT','对选中的整组列去重，常用于类别盘点。'],['LIMIT','只返回前若干行；探索大表时先限制行数更安全。']],
exampleNote:'列出行业种类，并预览三笔贷款。',
sql:`SELECT DISTINCT industry AS 行业\nFROM companies\nORDER BY 行业;\n\nSELECT loan_id, principal, status\nFROM loans\nLIMIT 3;`,
exercise:'列出借款人的所有不重复客户分群，并把列命名为“客户类型”。',
exerciseSql:`SELECT DISTINCT /* 列 */ AS 客户类型\nFROM borrowers;`,
answer:`SELECT DISTINCT segment AS 客户类型\nFROM borrowers\nORDER BY 客户类型;`,
answerNote:'DISTINCT 作用于 SELECT 后的全部表达式。'
},
{
title:'排序查询结果',
objective:'使用 ORDER BY 控制单列、多列、升序与降序排列。',
concepts:[['ASC 与 DESC','默认升序 ASC；DESC 表示降序，并且只影响它紧跟的列。'],['多列排序','先按第一列分组排序，遇到相同值再比较第二列。']],
exampleNote:'先看余额最高的贷款，再看行业内公司按成立年份排序。',
sql:`SELECT loan_id, balance, annual_rate\nFROM loans\nORDER BY balance DESC\nLIMIT 5;\n\nSELECT industry, company_name, founded_year\nFROM companies\nORDER BY industry ASC, founded_year ASC;`,
exercise:'按成交日期从新到旧、同一天按成交金额从高到低列出交易。成交金额为 quantity * price。',
exerciseSql:`SELECT trade_id, trade_date, quantity * price AS trade_value\nFROM trades\nORDER BY /* 两个排序条件 */;`,
answer:`SELECT trade_id, trade_date, quantity * price AS trade_value\nFROM trades\nORDER BY trade_date DESC, trade_value DESC;`,
answerNote:'SQLite 允许在 ORDER BY 中使用 SELECT 定义的别名。'
},
{
title:'WHERE 精确筛选',
objective:'用比较运算符和 NULL 判断只保留满足业务条件的记录。',
concepts:[['比较运算符','常见条件包括 =、<>、<、<=、>、>=。文本值需要单引号。'],['NULL 判断','NULL 表示未知或缺失，必须用 IS NULL 或 IS NOT NULL。']],
exampleNote:'筛选逾期贷款，以及净利润为负的年度财务记录。',
sql:`SELECT loan_id, balance, days_past_due\nFROM loans\nWHERE status = '逾期';\n\nSELECT company_id, fiscal_year, net_income_m\nFROM financials\nWHERE net_income_m < 0;`,
exercise:'查找贷款余额至少 400000、且年利率低于 7% 的贷款。',
exerciseSql:`SELECT loan_id, balance, annual_rate\nFROM loans\nWHERE /* 条件一 */ AND /* 条件二 */;`,
answer:`SELECT loan_id, balance, annual_rate\nFROM loans\nWHERE balance >= 400000\n  AND annual_rate < 0.07;`,
answerNote:'利率在数据中以小数保存，7% 写作 0.07。'
},
{
title:'组合条件与集合筛选',
objective:'正确组合 AND、OR、NOT、IN 与 BETWEEN，并理解运算优先级。',
concepts:[['括号优先','AND 通常先于 OR 计算；有混合条件时主动加括号最清楚。'],['IN 与 BETWEEN','IN 匹配离散集合；BETWEEN 同时包含上下边界。']],
exampleNote:'寻找需要关注的贷款，并筛选特定风险等级且余额位于区间内的记录。',
sql:`SELECT loan_id, status, days_past_due\nFROM loans\nWHERE status = '逾期'\n   OR (status = '关注' AND days_past_due >= 15);\n\nSELECT loan_id, balance, annual_rate\nFROM loans\nWHERE balance BETWEEN 200000 AND 800000\n  AND borrower_id IN (101,102,104);`,
exercise:'查找风险等级为 C 或 D 的借款人，但排除武汉。',
exerciseSql:`SELECT borrower_name, risk_grade, city\nFROM borrowers\nWHERE /* IN 条件 */\n  AND /* 排除城市 */;`,
answer:`SELECT borrower_name, risk_grade, city\nFROM borrowers\nWHERE risk_grade IN ('C','D')\n  AND city <> '武汉';`,
answerNote:'也可以写 NOT city = 武汉，但 <> 更直接。'
},
{
title:'通配符与文本匹配',
objective:'使用 LIKE、百分号和下划线进行可控的模式搜索。',
concepts:[['百分号 %','匹配零个或多个任意字符，适合前缀、后缀和包含搜索。'],['下划线 _','只匹配一个字符；精度更高，也更容易受字符长度影响。']],
exampleNote:'搜索名称中带“智能”的公司，并查找代码以 H 开头的证券。',
sql:`SELECT company_name, industry\nFROM companies\nWHERE company_name LIKE '%智能%';\n\nSELECT symbol, security_name\nFROM securities\nWHERE symbol LIKE 'H%';`,
exercise:'找出名字以“资本”结尾，或姓名恰好两个汉字的投资者。',
exerciseSql:`SELECT investor_name\nFROM accounts\nWHERE /* 两种 LIKE 模式，用 OR 连接 */;`,
answer:`SELECT investor_name\nFROM accounts\nWHERE investor_name LIKE '%资本'\n   OR investor_name LIKE '__';`,
answerNote:'下划线按字符匹配。真实系统中还需确认大小写与排序规则。'
},
{
title:'计算字段与可读别名',
objective:'在查询时生成交易金额、费用后现金流和财务比率。',
concepts:[['表达式','列可以参加加减乘除；计算结果不会自动写回原表。'],['CASE','把业务规则翻译成分类或带符号数值，是分析型 SQL 的核心工具。']],
exampleNote:'计算每笔交易的名义金额与含方向的净现金流。',
sql:`SELECT trade_id, side, quantity, price,\n       ROUND(quantity * price, 2) AS gross_value,\n       ROUND(CASE WHEN side='BUY'\n             THEN -(quantity*price+fee)\n             ELSE quantity*price-fee END, 2) AS cash_flow\nFROM trades\nORDER BY trade_id;`,
exercise:'计算 2025 年各公司的净利率（净利润 / 营收），显示百分比并保留两位小数。',
exerciseSql:`SELECT company_id,\n       /* 用 ROUND 计算百分比 */ AS net_margin_pct\nFROM financials\nWHERE fiscal_year = 2025;`,
answer:`SELECT company_id,\n       ROUND(net_income_m * 100.0 / revenue_m, 2) AS net_margin_pct\nFROM financials\nWHERE fiscal_year = 2025;`,
answerNote:'乘以 100.0 能清楚表达百分比意图，也可避免部分数据库的整数除法。'
},
{
title:'函数：文本、数值与日期',
objective:'用 SQLite 标量函数清洗展示字段，并了解跨数据库函数差异。',
concepts:[['标量函数','每输入一行就输出一个值，如 UPPER、ROUND、LENGTH。'],['日期函数','SQLite 用 date 和 strftime；迁移到其他数据库时要查对应语法。']],
exampleNote:'标准化股票代码、四舍五入利率，并计算账户开户年份。',
sql:`SELECT UPPER(symbol) AS symbol,\n       security_name, LENGTH(security_name) AS name_length\nFROM securities;\n\nSELECT loan_id, ROUND(annual_rate*100,2) AS rate_pct,\n       CAST(strftime('%Y', start_date) AS INTEGER) AS start_year\nFROM loans;`,
exercise:'显示每笔交易的月份（YYYY-MM）和保留两位小数的成交价。',
exerciseSql:`SELECT trade_id,\n       /* 月份函数 */ AS trade_month,\n       /* 四舍五入 */ AS price_2dp\nFROM trades;`,
answer:`SELECT trade_id,\n       strftime('%Y-%m', trade_date) AS trade_month,\n       ROUND(price, 2) AS price_2dp\nFROM trades;`,
answerNote:'日期以 ISO 格式文本保存，因此 SQLite 日期函数可以直接解析。'
},
{
title:'汇总数据',
objective:'使用 COUNT、SUM、AVG、MIN、MAX 把多行压缩成业务指标。',
concepts:[['聚合函数','对一组行计算一个结果；COUNT(*) 统计行，COUNT(列) 忽略 NULL。'],['避免伪精确','金额和比率展示时用 ROUND；解释指标时说明单位和口径。']],
exampleNote:'计算贷款组合规模与平均利率，再汇总成交额。',
sql:`SELECT COUNT(*) AS loan_count,\n       ROUND(SUM(balance),2) AS total_balance,\n       ROUND(AVG(annual_rate)*100,2) AS avg_rate_pct,\n       MAX(days_past_due) AS max_dpd\nFROM loans\nWHERE status <> '结清';\n\nSELECT ROUND(SUM(quantity*price),2) AS turnover\nFROM trades;`,
exercise:'统计 2025 年财务记录的公司数、总营收和平均净利润。',
exerciseSql:`SELECT /* 三个聚合指标 */\nFROM financials\nWHERE fiscal_year = 2025;`,
answer:`SELECT COUNT(*) AS company_count,\n       SUM(revenue_m) AS total_revenue_m,\n       ROUND(AVG(net_income_m),2) AS avg_net_income_m\nFROM financials\nWHERE fiscal_year = 2025;`,
answerNote:'这些财务数值的单位都是“百万元”。'
},
{
title:'分组与分组后筛选',
objective:'用 GROUP BY 形成业务分组，并用 HAVING 筛选聚合结果。',
concepts:[['WHERE 与 HAVING','WHERE 在分组前筛行；HAVING 在聚合后筛组。'],['分组粒度','SELECT 中非聚合列应出现在 GROUP BY，避免含义不确定。']],
exampleNote:'按贷款状态汇总余额，只保留余额较大的状态组。',
sql:`SELECT status, COUNT(*) AS loan_count,\n       ROUND(SUM(balance),2) AS total_balance\nFROM loans\nGROUP BY status\nHAVING SUM(balance) > 300000\nORDER BY total_balance DESC;`,
exercise:'按股票代码统计成交笔数和成交数量，只显示成交笔数至少 2 笔的证券。',
exerciseSql:`SELECT symbol, /* 两个聚合指标 */\nFROM trades\nGROUP BY symbol\nHAVING /* 聚合条件 */;`,
answer:`SELECT symbol, COUNT(*) AS trade_count,\n       SUM(quantity) AS total_quantity\nFROM trades\nGROUP BY symbol\nHAVING COUNT(*) >= 2\nORDER BY trade_count DESC, symbol;`,
answerNote:'HAVING 可以引用聚合函数本身，跨数据库兼容性通常最好。'
},
{
title:'子查询',
objective:'把一个查询的结果作为另一个查询的条件或计算来源。',
concepts:[['标量子查询','应返回一个值，可与每行的值比较。'],['集合子查询','返回一列多个值，常和 IN 配合；注意 NULL 可能影响 NOT IN。']],
exampleNote:'找出余额高于全体平均值的贷款，以及发生过 BCAI 交易的账户。',
sql:`SELECT loan_id, balance\nFROM loans\nWHERE balance > (SELECT AVG(balance) FROM loans)\nORDER BY balance DESC;\n\nSELECT account_id, investor_name\nFROM accounts\nWHERE account_id IN (\n  SELECT account_id FROM trades WHERE symbol='BCAI'\n);`,
exercise:'找出 2025 年净利润高于当年平均净利润的公司编号和净利润。',
exerciseSql:`SELECT company_id, net_income_m\nFROM financials\nWHERE fiscal_year=2025\n  AND net_income_m > (/* 平均值子查询 */);`,
answer:`SELECT company_id, net_income_m\nFROM financials\nWHERE fiscal_year=2025\n  AND net_income_m > (\n    SELECT AVG(net_income_m) FROM financials WHERE fiscal_year=2025\n  )\nORDER BY net_income_m DESC;`,
answerNote:'内外查询必须使用相同年度口径，否则比较会混入其他年份。'
},
{
title:'连接表',
objective:'通过主键与外键把分散在多张表中的信息重新组合。',
concepts:[['INNER JOIN','只保留两边连接键都能匹配的记录。'],['限定列名','多表查询中用表名或别名限定列，避免同名列歧义。']],
exampleNote:'把贷款与借款人信息连接，把交易与证券名称连接。',
sql:`SELECT l.loan_id, b.borrower_name, b.risk_grade, l.balance\nFROM loans AS l\nJOIN borrowers AS b ON b.borrower_id=l.borrower_id\nORDER BY l.balance DESC;\n\nSELECT t.trade_id, s.security_name, t.side, t.quantity\nFROM trades AS t\nJOIN securities AS s ON s.symbol=t.symbol;`,
exercise:'连接 financials 与 companies，列出 2025 年公司名称、行业、营收和净利润。',
exerciseSql:`SELECT /* 公司名、行业、营收、净利润 */\nFROM financials AS f\nJOIN companies AS c ON /* 连接条件 */\nWHERE f.fiscal_year=2025;`,
answer:`SELECT c.company_name, c.industry, f.revenue_m, f.net_income_m\nFROM financials AS f\nJOIN companies AS c ON c.company_id=f.company_id\nWHERE f.fiscal_year=2025\nORDER BY f.revenue_m DESC;`,
answerNote:'别名 c 和 f 让连接条件与列来源一目了然。'
},
{
title:'高级连接与未匹配数据',
objective:'使用 LEFT JOIN、自连接和反连接思路处理“没有记录”的问题。',
concepts:[['LEFT JOIN','保留左表全部行；右表无匹配时相应列为 NULL。'],['反连接','LEFT JOIN 后筛右表主键 IS NULL，可找出没有对应记录的对象。']],
exampleNote:'列出全部贷款及其最近一次付款日期，包括从未付款的贷款。',
sql:`SELECT l.loan_id, b.borrower_name,\n       MAX(p.payment_date) AS latest_payment\nFROM loans AS l\nJOIN borrowers AS b ON b.borrower_id=l.borrower_id\nLEFT JOIN payments AS p ON p.loan_id=l.loan_id\nGROUP BY l.loan_id, b.borrower_name\nORDER BY l.loan_id;`,
exercise:'找出没有任何交易记录的证券代码和名称。',
exerciseSql:`SELECT s.symbol, s.security_name\nFROM securities AS s\nLEFT JOIN trades AS t ON /* 连接条件 */\nWHERE /* 右表没有匹配 */;`,
answer:`SELECT s.symbol, s.security_name\nFROM securities AS s\nLEFT JOIN trades AS t ON t.symbol=s.symbol\nWHERE t.trade_id IS NULL;`,
answerNote:'当前示例数据可能返回 0 行；这也是有意义的结论。可先删除一类交易再观察。'
},
{
title:'组合查询',
objective:'用 UNION 或 UNION ALL 把结构兼容的查询纵向拼接。',
concepts:[['UNION','合并结果并去重；各查询列数必须一致、类型应兼容。'],['UNION ALL','保留重复行，通常更快；当重复本身有意义时优先使用。']],
exampleNote:'建立一张跨业务的“风险事件流”。',
sql:`SELECT '贷款逾期' AS event_type,\n       CAST(loan_id AS TEXT) AS object_id,\n       days_past_due AS severity\nFROM loans WHERE status='逾期'\nUNION ALL\nSELECT '公司亏损',\n       CAST(company_id AS TEXT),\n       CAST(ABS(net_income_m) AS INTEGER)\nFROM financials WHERE fiscal_year=2025 AND net_income_m<0\nORDER BY severity DESC;`,
exercise:'把机构账户和个人账户分别查询后用 UNION ALL 合并，并增加 category 常量列。',
exerciseSql:`SELECT /* 常量、账户编号、名称 */ FROM accounts WHERE investor_type='机构'\nUNION ALL\nSELECT /* 相同三列 */ FROM accounts WHERE investor_type='个人';`,
answer:`SELECT '机构' AS category, account_id, investor_name\nFROM accounts WHERE investor_type='机构'\nUNION ALL\nSELECT '个人', account_id, investor_name\nFROM accounts WHERE investor_type='个人'\nORDER BY category, account_id;`,
answerNote:'两个 SELECT 的列顺序决定最终结果的结构。'
},
{
title:'插入数据',
objective:'安全地用 INSERT 添加单行、多行或查询结果，并认识字段约束。',
concepts:[['显式列清单','INSERT 时写出列名，可避免表结构变化导致错位。'],['约束保护','主键、外键、NOT NULL 与 CHECK 会拒绝不合格数据。']],
exampleNote:'在临时课堂表中插入一条观察记录，不污染核心数据表。',
sql:`DROP TABLE IF EXISTS watchlist;\nCREATE TABLE watchlist(\n  symbol TEXT PRIMARY KEY,\n  reason TEXT NOT NULL,\n  added_date TEXT NOT NULL\n);\nINSERT INTO watchlist(symbol,reason,added_date)\nVALUES ('BCAI','关注成交活跃度','2025-09-16');\nSELECT * FROM watchlist;`,
exercise:'向 watchlist 再插入 HYE，原因为“观察能源价格”，日期为 2025-09-17，然后查询全表。请先运行本课示例创建表。',
exerciseSql:`INSERT INTO watchlist(/* 三个列名 */)\nVALUES (/* 三个值 */);\nSELECT * FROM watchlist;`,
answer:`INSERT INTO watchlist(symbol,reason,added_date)\nVALUES ('HYE','观察能源价格','2025-09-17');\nSELECT * FROM watchlist;`,
answerNote:'如果重复运行会触发主键冲突；点击“重建数据”再运行本课示例即可恢复。'
},
{
title:'更新与删除数据',
objective:'用 UPDATE 和 DELETE 修改数据，并建立先预览、后变更的安全习惯。',
concepts:[['WHERE 是安全边界','遗漏 WHERE 会影响整张表。先用相同条件 SELECT 预览。'],['事务式思考','变更前确认行数、范围和回滚方案；生产环境还需权限与审计。']],
exampleNote:'复制一张课堂用贷款表，在副本中更新状态并删除结清记录。',
sql:`DROP TABLE IF EXISTS loans_sandbox;\nCREATE TABLE loans_sandbox AS SELECT * FROM loans;\n\n-- 先预览，再更新\nSELECT * FROM loans_sandbox WHERE days_past_due>=90;\nUPDATE loans_sandbox SET status='严重逾期' WHERE days_past_due>=90;\nDELETE FROM loans_sandbox WHERE status='结清';\nSELECT loan_id,status,days_past_due FROM loans_sandbox;`,
exercise:'把 loans_sandbox 中逾期 30 天以上但不足 90 天的状态改成“重点关注”。请先运行本课示例。',
exerciseSql:`UPDATE loans_sandbox\nSET status=/* 新状态 */\nWHERE /* 30 到 89 天 */;\nSELECT loan_id,status,days_past_due FROM loans_sandbox;`,
answer:`UPDATE loans_sandbox\nSET status='重点关注'\nWHERE days_past_due>=30 AND days_past_due<90;\nSELECT loan_id,status,days_past_due FROM loans_sandbox;`,
answerNote:'区间条件写清上下界，可避免与“严重逾期”规则重叠。'
},
{
title:'创建与维护表结构',
objective:'用 CREATE TABLE 设计字段、主键、默认值和检查约束。',
concepts:[['数据类型与约束','类型表达用途，约束表达业务规则；两者共同守住数据质量。'],['DDL 变更','结构变更影响所有使用者，正式环境需迁移脚本、备份和回滚计划。']],
exampleNote:'创建一个带风险分值检查的审核表，并插入合法记录。',
sql:`DROP TABLE IF EXISTS credit_reviews;\nCREATE TABLE credit_reviews(\n  review_id INTEGER PRIMARY KEY,\n  loan_id INTEGER NOT NULL,\n  review_date TEXT NOT NULL,\n  risk_score INTEGER CHECK(risk_score BETWEEN 0 AND 100),\n  decision TEXT DEFAULT '待定',\n  FOREIGN KEY(loan_id) REFERENCES loans(loan_id)\n);\nINSERT INTO credit_reviews(review_id,loan_id,review_date,risk_score)\nVALUES (1,1004,'2025-09-20',72);\nSELECT * FROM credit_reviews;`,
exercise:'向 credit_reviews 插入第二条审核：贷款 1005，风险分 88，决定为“复核”。请先运行本课示例。',
exerciseSql:`INSERT INTO credit_reviews(/* 列清单 */)\nVALUES (/* 数据 */);\nSELECT * FROM credit_reviews;`,
answer:`INSERT INTO credit_reviews(review_id,loan_id,review_date,risk_score,decision)\nVALUES (2,1005,'2025-09-21',88,'复核');\nSELECT * FROM credit_reviews;`,
answerNote:'尝试把风险分改为 108，可观察 CHECK 约束如何拒绝数据。'
},
{
title:'使用视图封装查询',
objective:'把稳定的查询逻辑保存为视图，让后续分析使用一致口径。',
concepts:[['视图是查询接口','普通视图通常不复制数据，而是在访问时执行定义中的查询。'],['口径复用','复杂连接与计算集中定义，减少多人重复实现造成的差异。']],
exampleNote:'创建一张 2025 年公司盈利能力视图并进行二次筛选。',
sql:`DROP VIEW IF EXISTS company_profitability_2025;\nCREATE VIEW company_profitability_2025 AS\nSELECT c.company_name,c.industry,f.revenue_m,f.net_income_m,\n       ROUND(f.net_income_m*100.0/f.revenue_m,2) AS margin_pct\nFROM companies c JOIN financials f ON f.company_id=c.company_id\nWHERE f.fiscal_year=2025;\n\nSELECT * FROM company_profitability_2025\nWHERE margin_pct>8\nORDER BY margin_pct DESC;`,
exercise:'基于视图查询营收超过 800、且净利润为正的公司。请先运行本课示例。',
exerciseSql:`SELECT company_name,revenue_m,net_income_m\nFROM company_profitability_2025\nWHERE /* 两个条件 */;`,
answer:`SELECT company_name,revenue_m,net_income_m\nFROM company_profitability_2025\nWHERE revenue_m>800 AND net_income_m>0\nORDER BY revenue_m DESC;`,
answerNote:'使用者不必重复连接表，也不必重新实现净利率公式。'
},
{
title:'存储过程的思想与替代方案',
objective:'理解参数化、封装与权限边界；在 SQLite 中用参数查询思路替代存储过程。',
concepts:[['存储过程','在支持它的数据库中，可把多条带参数的逻辑保存在服务端。'],['SQLite 适配','SQLite 没有通用存储过程语法；可用视图、触发器或应用层参数查询。']],
exampleNote:'用 CTE parameters 模拟“传入最低余额”的只读参数查询。',
sql:`WITH parameters(min_balance) AS (VALUES(400000))\nSELECT l.loan_id,b.borrower_name,l.balance,l.status\nFROM loans l\nJOIN borrowers b ON b.borrower_id=l.borrower_id\nCROSS JOIN parameters p\nWHERE l.balance>=p.min_balance\nORDER BY l.balance DESC;`,
exercise:'用 CTE 参数 target_symbol 值 BCAI，返回该证券全部交易。',
exerciseSql:`WITH parameters(target_symbol) AS (VALUES(/* 参数值 */))\nSELECT t.*\nFROM trades t CROSS JOIN parameters p\nWHERE /* 使用参数 */;`,
answer:`WITH parameters(target_symbol) AS (VALUES('BCAI'))\nSELECT t.*\nFROM trades t CROSS JOIN parameters p\nWHERE t.symbol=p.target_symbol\nORDER BY t.trade_date;`,
answerNote:'真实应用应使用数据库驱动提供的绑定参数，不要用字符串拼接用户输入。'
},
{
title:'事务与一致性',
objective:'理解原子性、提交与回滚，让一组相关变更要么全部成功，要么全部撤销。',
concepts:[['BEGIN / COMMIT','BEGIN 开启事务，COMMIT 使变更成为最终结果。'],['ROLLBACK','发现校验失败时撤销事务内变更；本课用副本安全演示。']],
exampleNote:'在账户副本中演示一次更新后回滚，再比较前后结果。',
sql:`DROP TABLE IF EXISTS accounts_sandbox;\nCREATE TABLE accounts_sandbox AS SELECT * FROM accounts;\nBEGIN;\nUPDATE accounts_sandbox\nSET investor_name='稳健成长基金（更名待审）'\nWHERE account_id=201;\nSELECT * FROM accounts_sandbox WHERE account_id=201;\nROLLBACK;\nSELECT * FROM accounts_sandbox WHERE account_id=201;`,
exercise:'在事务中删除 account_id=204，查询确认后 ROLLBACK，再查询确认记录恢复。请先运行本课示例。',
exerciseSql:`BEGIN;\nDELETE FROM accounts_sandbox WHERE account_id=204;\nSELECT * FROM accounts_sandbox WHERE account_id=204;\n/* 撤销 */\nSELECT * FROM accounts_sandbox WHERE account_id=204;`,
answer:`BEGIN;\nDELETE FROM accounts_sandbox WHERE account_id=204;\nSELECT * FROM accounts_sandbox WHERE account_id=204;\nROLLBACK;\nSELECT * FROM accounts_sandbox WHERE account_id=204;`,
answerNote:'两次 SELECT 应分别返回 0 行与 1 行。'
},
{
title:'游标思维与集合化处理',
objective:'理解逐行处理的用途与代价，并优先用窗口函数完成集合化分析。',
concepts:[['游标','游标逐行读取结果，适合必须逐条调用外部过程的场景，但通常更慢。'],['窗口函数','在保留明细行的同时计算排名、累计值或移动指标。']],
exampleNote:'不用游标，直接计算每只股票按日期的累计成交量。',
sql:`SELECT symbol,trade_date,side,quantity,\n       SUM(CASE WHEN side='BUY' THEN quantity ELSE -quantity END)\n       OVER(PARTITION BY symbol ORDER BY trade_date,trade_id)\n       AS running_net_quantity\nFROM trades\nORDER BY symbol,trade_date,trade_id;`,
exercise:'为每个账户的交易按日期编号，最新交易编号为 1。',
exerciseSql:`SELECT account_id,trade_id,trade_date,\n       /* 使用 ROW_NUMBER 窗口函数 */ AS recency_rank\nFROM trades;`,
answer:`SELECT account_id,trade_id,trade_date,\n       ROW_NUMBER() OVER(\n         PARTITION BY account_id ORDER BY trade_date DESC,trade_id DESC\n       ) AS recency_rank\nFROM trades\nORDER BY account_id,recency_rank;`,
answerNote:'窗口函数不会像 GROUP BY 那样把明细行合并掉。'
},
{
title:'高级 SQL：CTE、索引与负责任的数据使用',
objective:'综合使用 CTE 与窗口函数完成风险分析，查看查询计划，并建立安全与治理意识。',
concepts:[['CTE 分步表达','WITH 把复杂问题拆成有名称的中间结果，提高可读性和可测试性。'],['索引与治理','索引服务查询但增加写入成本；生产数据还需最小权限、脱敏、审计和保留策略。']],
exampleNote:'计算贷款组合中的余额占比和风险排序，再观察索引前后的查询计划。',
sql:`WITH portfolio AS (\n  SELECT l.loan_id,b.borrower_name,b.risk_grade,l.balance,l.days_past_due,\n         SUM(l.balance) OVER() AS total_balance\n  FROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id\n  WHERE l.status<>'结清'\n)\nSELECT loan_id,borrower_name,risk_grade,balance,days_past_due,\n       ROUND(balance*100.0/total_balance,2) AS portfolio_pct,\n       DENSE_RANK() OVER(ORDER BY days_past_due DESC,balance DESC) AS risk_rank\nFROM portfolio\nORDER BY risk_rank;\n\nCREATE INDEX IF NOT EXISTS idx_loans_status_balance ON loans(status,balance);\nEXPLAIN QUERY PLAN SELECT * FROM loans WHERE status='逾期' ORDER BY balance;`,
exercise:'用 CTE 计算 2024 到 2025 年每家公司的营收增长率，并按增长率降序排列。',
exerciseSql:`WITH yearly AS (\n  SELECT company_id,\n         /* 条件聚合得到 2024 和 2025 营收 */\n  FROM financials GROUP BY company_id\n)\nSELECT /* 公司编号与增长率 */\nFROM yearly;`,
answer:`WITH yearly AS (\n  SELECT company_id,\n         MAX(CASE WHEN fiscal_year=2024 THEN revenue_m END) AS rev_2024,\n         MAX(CASE WHEN fiscal_year=2025 THEN revenue_m END) AS rev_2025\n  FROM financials\n  GROUP BY company_id\n)\nSELECT company_id,rev_2024,rev_2025,\n       ROUND((rev_2025-rev_2024)*100.0/rev_2024,2) AS growth_pct\nFROM yearly\nORDER BY growth_pct DESC;`,
answerNote:'你已经把筛选、聚合、条件表达式、CTE 和排序组合成一个完整分析。实际项目中还应记录数据来源、口径与访问权限。'
}
];

window.SQL_COURSE={seed,lessons};
})();
