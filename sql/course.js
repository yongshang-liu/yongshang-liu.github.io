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

const expansions=[
{
detailIntro:'这一课先建立关系数据库的地图。数据不是散落的单元格，而是按实体、属性和关系组织起来；SQL 是向数据库描述“想得到什么”的声明式语言。',
guide:[['数据库与 DBMS','数据库是有组织的数据集合；DBMS 负责存储、检索、并发、权限与恢复。SQLite、PostgreSQL、MySQL 等都是 DBMS，SQL 是它们共同支持的语言。'],['表、主键与外键','表代表一种实体；主键唯一识别一行，外键把表连接起来。本课程用 company_id、borrower_id 等稳定编号建立关系，名称只是可变化的属性。'],['模式与数据','模式定义表名、列、类型和约束；数据是按模式保存的记录。分析前先理解模式，能避免把编号、金额或日期解释错。']],
examples:[{title:'查看数据库中的表',note:'SQLite 的系统目录保存了表和视图的名称。',sql:`SELECT name, type\nFROM sqlite_master\nWHERE type IN ('table','view')\nORDER BY type,name;`},{title:'查看表结构',note:'PRAGMA table_info 展示列名、类型、非空与主键信息。',sql:`PRAGMA table_info(loans);\nPRAGMA foreign_key_list(loans);`}],
pitfalls:['把显示名称当作主键：重名或改名会破坏关联。','认为所有数据库语法完全相同：核心 SQL 接近，但日期、分页和管理命令存在方言差异。'],
challenge:{question:'画出贷款域的关系：列出 loans 的每个外键及其指向的表和列。',sql:`PRAGMA foreign_key_list(loans);`,answer:`PRAGMA foreign_key_list(loans);`,note:'结果显示 loans.borrower_id 指向 borrowers.borrower_id。payments.loan_id 又指向 loans.loan_id，三张表形成借款人—贷款—还款链条。'}
},
{
detailIntro:'SELECT 是读取数据的入口。本课详细区分单列、多列、全部列、去重、限制行数与注释，让探索性查询逐步变成稳定的分析接口。',
guide:[['SELECT 与 FROM','SELECT 决定输出哪些列或表达式，FROM 决定从哪张表读取。语句可以换行，关键字大小写通常不敏感。'],['DISTINCT 的范围','DISTINCT 作用于 SELECT 后整组列。选择两列时，只有两列组合完全相同才会被合并。'],['LIMIT 与注释','LIMIT 适合数据预览；正式结果若要求“前几名”，必须同时写 ORDER BY。双连字符是单行注释，斜杠星号可写块注释。']],
examples:[{title:'比较单列与多列去重',note:'观察只选行业与同时选择行业、城市时，去重粒度怎样变化。',sql:`SELECT DISTINCT industry FROM companies;\nSELECT DISTINCT industry,city FROM companies;`},{title:'稳定地预览贷款',note:'先规定顺序，再取前 4 行，结果才具有可解释性。',sql:`SELECT loan_id,balance,status\nFROM loans\nORDER BY loan_id\nLIMIT 4;`}],
pitfalls:['SELECT * 会把未来新增列也带入结果，可能破坏下游程序。','没有 ORDER BY 的 LIMIT 不承诺固定顺序。'],
challenge:{question:'返回 2025 年财务表中不重复的 fiscal_year，并预览净利润最高的 3 条记录。',sql:`SELECT DISTINCT fiscal_year FROM financials WHERE fiscal_year=2025;\nSELECT company_id,net_income_m FROM financials WHERE fiscal_year=2025 ORDER BY net_income_m DESC LIMIT 3;`,answer:`SELECT DISTINCT fiscal_year\nFROM financials\nWHERE fiscal_year=2025;\n\nSELECT company_id,net_income_m\nFROM financials\nWHERE fiscal_year=2025\nORDER BY net_income_m DESC\nLIMIT 3;`,note:'第二个查询必须排序后再限制，才能表达“最高的 3 条”。'}
},
{
detailIntro:'关系表本身没有天然显示顺序。ORDER BY 是最终结果顺序的唯一可靠保证，可按列名、别名、多个字段或列位置排序。',
guide:[['多列排序','从左到右逐级比较：第一列相同才比较第二列。常用主业务指标降序，再以主键升序作为稳定的平局规则。'],['方向控制','ASC 为升序且通常可省略，DESC 为降序；每个排序列都能单独指定方向。'],['列位置排序','ORDER BY 2 可按输出的第二列排序，但列清单变化后含义会改变，因此教学可了解，生产代码更推荐列名。']],
examples:[{title:'按别名排序计算结果',note:'先计算成交金额，再按别名从高到低排序。',sql:`SELECT trade_id,symbol,quantity*price AS trade_value\nFROM trades\nORDER BY trade_value DESC,trade_id ASC;`},{title:'NULL 的排序表现',note:'用表达式制造 NULL，观察当前数据库如何排列未知值。',sql:`SELECT borrower_name,\n       CASE WHEN risk_grade IN ('C','D') THEN days_past_due END AS risk_days\nFROM borrowers b LEFT JOIN loans l ON l.borrower_id=b.borrower_id\nORDER BY risk_days IS NULL,risk_days DESC;`}],
pitfalls:['误以为表会保持插入顺序；没有 ORDER BY 就没有顺序承诺。','只给第一列写 DESC，却以为后续列也会自动降序。'],
challenge:{question:'列出 2025 年公司财务，先按净利润是否为负排序（亏损在前），再按亏损绝对额从大到小。',sql:`SELECT company_id,net_income_m\nFROM financials\nWHERE fiscal_year=2025\nORDER BY /* 完成排序 */;`,answer:`SELECT company_id,net_income_m\nFROM financials\nWHERE fiscal_year=2025\nORDER BY (net_income_m<0) DESC, ABS(net_income_m) DESC;`,note:'SQLite 中布尔比较产生 0 或 1。其他数据库可用 CASE 构造排序键。'}
},
{
detailIntro:'WHERE 在数据进入结果集之前过滤行。本课覆盖等值、不等、范围、空值和文本比较，并强调金额、比率、日期的正确表示。',
guide:[['比较条件','=、<>、<、<=、>、>= 比较一个列或表达式。文本与日期字面量用单引号，数字通常不加引号。'],['BETWEEN 与边界','BETWEEN low AND high 同时包含上下界。对时间戳做日期区间时要特别检查上界是否遗漏当日后续时刻。'],['NULL 三值逻辑','NULL 不是空字符串或 0，而是未知。任何与 NULL 的普通比较都不会得到真值，必须使用 IS NULL 或 IS NOT NULL。']],
examples:[{title:'区间与排除条件',note:'筛出中等规模且未结清的贷款。',sql:`SELECT loan_id,balance,status\nFROM loans\nWHERE balance BETWEEN 200000 AND 800000\n  AND status <> '结清';`},{title:'寻找缺失或异常信息',note:'当前数据无空城市，因此第一部分应返回 0 行；第二部分展示业务异常。',sql:`SELECT * FROM borrowers WHERE city IS NULL;\nSELECT loan_id,status,days_past_due FROM loans WHERE days_past_due>0;`}],
pitfalls:['写 column = NULL 永远不能正确匹配未知值。','把百分数 7% 写成 7，而数据实际以 0.07 存储。'],
challenge:{question:'找出 2024-01-01 至 2024-12-31 发放、且当前余额大于原始本金 50% 的贷款。',sql:`SELECT loan_id,principal,balance,start_date\nFROM loans\nWHERE /* 日期与比例条件 */;`,answer:`SELECT loan_id,principal,balance,start_date\nFROM loans\nWHERE start_date BETWEEN '2024-01-01' AND '2024-12-31'\n  AND balance > principal*0.5;`,note:'ISO 日期文本 YYYY-MM-DD 可按字典序比较；真实系统应使用正式日期类型。'}
},
{
detailIntro:'复杂业务条件来自多个简单判断的组合。理解 AND、OR、NOT 的优先级，并选用 IN 或 BETWEEN，可以让条件更短、更可靠。',
guide:[['AND 与 OR','AND 要求两边同时成立，OR 只需一边成立。SQL 通常先算 AND，再算 OR；混合使用时应显式加括号表达业务分组。'],['IN 集合','IN 适合与一个短列表或子查询比较，比连续多个 OR 更清晰。NOT IN 遇到包含 NULL 的集合时要格外谨慎。'],['NOT 的作用域','NOT 可以否定条件、IN、BETWEEN 或 LIKE。否定复杂条件时使用括号，让读者看清它否定的范围。']],
examples:[{title:'演示优先级差异',note:'运行两个查询，比较括号改变后返回行数的差别。',sql:`SELECT loan_id,status,balance FROM loans\nWHERE status='逾期' OR status='关注' AND balance>300000;\nSELECT loan_id,status,balance FROM loans\nWHERE (status='逾期' OR status='关注') AND balance>300000;`},{title:'IN 与 NOT',note:'保留重点风险等级，同时排除已结清贷款。',sql:`SELECT l.loan_id,b.risk_grade,l.status\nFROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id\nWHERE b.risk_grade IN ('C','D')\n  AND NOT l.status='结清';`}],
pitfalls:['混用 AND/OR 却不加括号，结果常与自然语言理解不同。','NOT IN 子查询若返回 NULL，可能导致整个条件没有真值；可改用 NOT EXISTS。'],
challenge:{question:'筛选 A 级企业客户，或余额超过 100 万且风险等级为 C/D 的任意客户。',sql:`SELECT b.borrower_name,b.segment,b.risk_grade,l.balance\nFROM borrowers b JOIN loans l ON l.borrower_id=b.borrower_id\nWHERE /* 组合条件 */;`,answer:`SELECT b.borrower_name,b.segment,b.risk_grade,l.balance\nFROM borrowers b JOIN loans l ON l.borrower_id=b.borrower_id\nWHERE (b.risk_grade='A' AND b.segment='企业')\n   OR (l.balance>1000000 AND b.risk_grade IN ('C','D'));`,note:'括号把两套独立的准入规则分开。'}
},
{
detailIntro:'LIKE 用模式而不是精确值筛选文本。通配符搜索灵活，但前导百分号往往无法利用普通索引，数据量大时要兼顾性能。',
guide:[['百分号与下划线','% 匹配任意长度字符，_ 恰好匹配一个字符。二者可以组合，例如 A_% 表示 A、任意一个字符、再接任意字符。'],['大小写与排序规则','LIKE 是否区分大小写取决于数据库、字符集和排序规则，不应假设所有系统行为一致。'],['转义与性能','若要搜索字面意义的 % 或 _，需使用数据库支持的转义方式。以 % 开头的包含搜索通常比前缀搜索更昂贵。']],
examples:[{title:'前缀、后缀与包含',note:'同时比较三种模式写法。',sql:`SELECT company_name FROM companies WHERE company_name LIKE '北%';\nSELECT company_name FROM companies WHERE company_name LIKE '%医疗';\nSELECT company_name FROM companies WHERE company_name LIKE '%川%';`},{title:'单字符占位',note:'下划线严格匹配一个字符，可用于已知格式的代码。',sql:`SELECT symbol,security_name\nFROM securities\nWHERE symbol LIKE 'H__';`}],
pitfalls:['把 % 当作“至少一个字符”；它也可以匹配零个字符。','对大表到处使用 %关键词% 而不评估全文索引或专用搜索方案。'],
challenge:{question:'找出名称中含“基金”或以“资本”结尾的机构账户，并说明两种模式的区别。',sql:`SELECT account_id,investor_name\nFROM accounts\nWHERE /* LIKE 条件 */;`,answer:`SELECT account_id,investor_name\nFROM accounts\nWHERE investor_type='机构'\n  AND (investor_name LIKE '%基金%' OR investor_name LIKE '%资本');`,note:'第一个模式是任意位置包含，第二个模式要求文本以“资本”结束。'}
},
{
detailIntro:'计算字段把原始列转化为业务指标。别名改善可读性，拼接生成展示文本，CASE 则把规则转成分类或带符号数值。',
guide:[['算术表达式','可以直接计算金额、比率和差额。分母可能为 0 时应先保护；金额计算还要考虑币种、单位与舍入。'],['别名与拼接','AS 为结果列命名。SQLite 用 || 拼接文本，其他数据库可能提供 CONCAT。'],['CASE 表达式','CASE WHEN 可表达分段、标签、条件聚合和方向转换；条件从上到下匹配，第一个成立分支生效。']],
examples:[{title:'资产负债率与利润率',note:'一次查询生成两个核心财务比率。',sql:`SELECT company_id,fiscal_year,\n ROUND(liabilities_m*100.0/assets_m,2) AS debt_ratio_pct,\n ROUND(net_income_m*100.0/revenue_m,2) AS margin_pct\nFROM financials WHERE fiscal_year=2025;`},{title:'CASE 风险标签',note:'把逾期天数转换为易读的风险区间。',sql:`SELECT loan_id,days_past_due,\n CASE WHEN days_past_due>=90 THEN '严重'\n      WHEN days_past_due>=30 THEN '较高'\n      WHEN days_past_due>0 THEN '关注'\n      ELSE '正常' END AS risk_band\nFROM loans;`}],
pitfalls:['整数除法在部分数据库会截断小数，使用 100.0 或显式类型转换。','CASE 条件顺序错误：先判断 >=30 会让 >=90 的记录提前匹配。'],
challenge:{question:'计算每笔交易扣除费用后的带方向现金流，并拼接“代码-买卖方向”标签。',sql:`SELECT trade_id, /* 标签和现金流 */ FROM trades;`,answer:`SELECT trade_id, symbol||'-'||side AS trade_label,\n CASE WHEN side='BUY' THEN -(quantity*price+fee)\n      ELSE quantity*price-fee END AS net_cash_flow\nFROM trades\nORDER BY trade_id;`,note:'买入产生现金流出，因此为负；卖出产生现金流入，并扣除费用。'}
},
{
detailIntro:'函数对每行输入执行转换。文本、数值和日期函数很常用，但也是 SQL 方言差异最明显的区域之一，迁移时必须核对目标 DBMS。',
guide:[['文本函数','UPPER、LOWER、LENGTH、TRIM、SUBSTR 用于标准化和拆分文本。不要用展示层清洗掩盖源数据质量问题。'],['数值函数','ROUND、ABS 等处理精度和符号。财务金额应明确采用何种舍入规则，关键账务通常使用定点数而非浮点数。'],['日期时间','SQLite 用 date、strftime、julianday；SQL Server、Oracle、PostgreSQL 各有不同函数。日期差计算还需明确时区与自然日口径。']],
examples:[{title:'文本标准化',note:'生成统一大写代码与带城市的借款人标签。',sql:`SELECT UPPER(symbol),LOWER(symbol),LENGTH(symbol) FROM securities;\nSELECT TRIM(borrower_name)||'（'||city||'）' AS label FROM borrowers;`},{title:'贷款存续天数',note:'用 julianday 计算发放日至固定分析日的天数。',sql:`SELECT loan_id,start_date,\n CAST(julianday('2025-09-30')-julianday(start_date) AS INTEGER) AS age_days\nFROM loans;`}],
pitfalls:['把某个数据库的日期函数直接复制到另一个数据库。','在 WHERE 中对索引列包函数，可能使普通索引无法直接定位。'],
challenge:{question:'按月份汇总交易笔数，并生成 YYYY年MM月 的中文月份标签。',sql:`SELECT /* 月份标签与笔数 */ FROM trades GROUP BY /* 月份 */;`,answer:`SELECT strftime('%Y',trade_date)||'年'||strftime('%m',trade_date)||'月' AS month_label,\n       COUNT(*) AS trade_count\nFROM trades\nGROUP BY strftime('%Y-%m',trade_date)\nORDER BY strftime('%Y-%m',trade_date);`,note:'分组键采用可排序的 YYYY-MM，展示标签单独拼接。'}
},
{
detailIntro:'聚合函数把一组明细压缩为一个或多个指标。掌握 NULL、DISTINCT 和统计口径，是从“会写函数”到“指标可信”的关键。',
guide:[['五类常用聚合','COUNT 计数，SUM 求和，AVG 平均，MIN/MAX 找边界。它们可作用于全表或 WHERE 筛选后的集合。'],['NULL 与计数','COUNT(*) 统计行数；COUNT(column) 只统计该列非 NULL 的行。SUM、AVG 等通常忽略 NULL。'],['DISTINCT 聚合','COUNT(DISTINCT column) 统计不同值数量。AVG(DISTINCT column) 只对不同值求平均，业务中较少见，必须说明口径。']],
examples:[{title:'COUNT 的不同口径',note:'比较贷款行数、不同借款人数与非零余额贷款数。',sql:`SELECT COUNT(*) AS rows_count,\n COUNT(DISTINCT borrower_id) AS borrowers,\n SUM(CASE WHEN balance>0 THEN 1 ELSE 0 END) AS active_loans\nFROM loans;`},{title:'组合聚合',note:'一次输出交易规模、价格范围与加权均价。',sql:`SELECT symbol,COUNT(*) AS trades,SUM(quantity) AS qty,\n ROUND(SUM(quantity*price)/SUM(quantity),2) AS weighted_avg_price,\n MIN(price) AS min_price,MAX(price) AS max_price\nFROM trades GROUP BY symbol;`}],
pitfalls:['用 AVG(price) 代替成交量加权均价。','把 NULL 当成 0；聚合忽略 NULL 与把 NULL 补 0 会得到不同结果。'],
challenge:{question:'计算未结清贷款的加权平均利率，权重使用当前余额。',sql:`SELECT /* 加权利率 */ FROM loans WHERE status<>'结清';`,answer:`SELECT ROUND(SUM(balance*annual_rate)*100.0/SUM(balance),2) AS weighted_rate_pct\nFROM loans\nWHERE status<>'结清' AND balance>0;`,note:'普通 AVG 每笔贷款权重相同；余额加权平均更能描述整个贷款组合的利率暴露。'}
},
{
detailIntro:'GROUP BY 改变查询粒度：从明细行变为每个组一行。WHERE 先筛明细，HAVING 再筛聚合后的组，二者不能随意互换。',
guide:[['分组规则','SELECT 中除聚合表达式外的列应出现在 GROUP BY。严格遵守能保证跨数据库一致，并避免“随便取一行”的不确定结果。'],['WHERE 与 HAVING','WHERE 在聚合前减少输入行，HAVING 根据 COUNT、SUM 等组指标筛选。能在 WHERE 完成的条件不要推迟到 HAVING。'],['子分组与排序','可按多列形成层级分组。ORDER BY 在聚合后执行，常按聚合别名排序。']],
examples:[{title:'多列分组',note:'同时观察投资者类型与买卖方向的成交规模。',sql:`SELECT a.investor_type,t.side,COUNT(*) AS trades,SUM(t.quantity) AS qty\nFROM trades t JOIN accounts a ON a.account_id=t.account_id\nGROUP BY a.investor_type,t.side\nORDER BY a.investor_type,t.side;`},{title:'WHERE 与 HAVING 配合',note:'先保留未结清贷款，再筛总余额超过 50 万的客户分群。',sql:`SELECT b.segment,SUM(l.balance) AS total_balance\nFROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id\nWHERE l.status<>'结清'\nGROUP BY b.segment\nHAVING SUM(l.balance)>500000;`}],
pitfalls:['在 WHERE 中直接写 SUM(balance)>...，聚合尚未发生。','SELECT 了未分组、未聚合的列，SQLite 可能运行但结果含义不可靠。'],
challenge:{question:'按行业计算 2025 年公司数、总营收和平均净利率，只保留至少 2 家公司的行业。',sql:`SELECT /* 行业指标 */ FROM companies c JOIN financials f ON /*...*/ WHERE /*...*/ GROUP BY /*...*/ HAVING /*...*/;`,answer:`SELECT c.industry,COUNT(*) AS company_count,\n SUM(f.revenue_m) AS revenue_m,\n ROUND(AVG(f.net_income_m*100.0/f.revenue_m),2) AS avg_margin_pct\nFROM companies c JOIN financials f ON f.company_id=c.company_id\nWHERE f.fiscal_year=2025\nGROUP BY c.industry\nHAVING COUNT(*)>=2;`,note:'这里平均的是“公司净利率”，不同于行业总利润除以行业总营收；两种口径要明确区分。'}
},
{
detailIntro:'子查询把查询嵌套在查询中，可出现在 WHERE、SELECT 或 FROM。选择标量、集合、相关或派生表形式，取决于内层返回的形状和业务问题。',
guide:[['标量与集合','标量子查询应返回单值，可用于比较；集合子查询返回一列多行，常与 IN 配合。返回多列时通常放入 FROM 作为派生表。'],['相关子查询','内层引用外层当前行，因此逻辑上会针对每行判断。EXISTS 只关心是否存在匹配，常用于存在性与反存在性分析。'],['可读性与性能','子查询不一定慢，优化器可能重写；但深层嵌套难维护，可改用 JOIN 或 CTE 表达步骤。']],
examples:[{title:'EXISTS 存在性筛选',note:'找出至少有一笔付款记录的贷款。',sql:`SELECT l.loan_id,l.balance\nFROM loans l\nWHERE EXISTS(SELECT 1 FROM payments p WHERE p.loan_id=l.loan_id);`},{title:'相关标量子查询',note:'为每笔贷款附加该借款人的贷款总数。',sql:`SELECT l.loan_id,l.borrower_id,\n (SELECT COUNT(*) FROM loans x WHERE x.borrower_id=l.borrower_id) AS borrower_loan_count\nFROM loans l;`}],
pitfalls:['标量子查询返回多行，在不同数据库中可能报错或产生非预期值。','用 NOT IN 对付可能含 NULL 的子查询；NOT EXISTS 通常更稳健。'],
challenge:{question:'找出从未发生过交易的账户；即使当前结果为空，也要写出正确的反存在查询。',sql:`SELECT a.* FROM accounts a WHERE /* NOT EXISTS */;`,answer:`SELECT a.account_id,a.investor_name\nFROM accounts a\nWHERE NOT EXISTS(\n  SELECT 1 FROM trades t WHERE t.account_id=a.account_id\n);`,note:'NOT EXISTS 直接表达“不存在关联明细”，不会受子查询 NULL 值影响。'}
},
{
detailIntro:'连接根据相关列横向组合表。理解笛卡尔积、连接条件、表别名和一对多关系，才能避免行数意外膨胀。',
guide:[['连接条件','INNER JOIN 先形成匹配组合，再按 ON 条件保留行。忘记 ON 或条件不完整会产生笛卡尔积。'],['一对多粒度','一个借款人可有多笔贷款，一笔贷款可有多笔还款；连续连接会把父行复制到每条明细，聚合时要认识这一粒度。'],['别名与限定','表别名缩短语句；同名列必须限定来源。连接键最好具有一致的数据类型和索引。']],
examples:[{title:'三表连接',note:'把付款追溯到贷款与借款人。',sql:`SELECT p.payment_id,p.payment_date,p.amount,l.loan_id,b.borrower_name\nFROM payments p\nJOIN loans l ON l.loan_id=p.loan_id\nJOIN borrowers b ON b.borrower_id=l.borrower_id\nORDER BY p.payment_date;`},{title:'检测错误连接的行数膨胀',note:'比较笛卡尔积与正确连接的行数；实际工作不要返回完整笛卡尔积。',sql:`SELECT COUNT(*) AS cartesian_rows FROM loans CROSS JOIN borrowers;\nSELECT COUNT(*) AS matched_rows FROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id;`}],
pitfalls:['只写 JOIN 表名却漏掉 ON，行数可能成倍增长。','连接一对多表后直接 SUM 父表金额，会因明细重复而重复累计。'],
challenge:{question:'列出每笔交易的投资者名称、证券名称、方向和成交金额。',sql:`SELECT /* 跨三表字段 */ FROM trades t JOIN /*...*/;`,answer:`SELECT t.trade_id,a.investor_name,s.security_name,t.side,\n       ROUND(t.quantity*t.price,2) AS trade_value\nFROM trades t\nJOIN accounts a ON a.account_id=t.account_id\nJOIN securities s ON s.symbol=t.symbol\nORDER BY t.trade_id;`,note:'trades 是事实表，accounts 与 securities 提供两侧维度描述。'}
},
{
detailIntro:'高级连接包括自连接、外连接、反连接与带聚合的连接。核心问题始终是：哪些未匹配行应该保留，最终结果的粒度是什么。',
guide:[['LEFT JOIN','保留左表全部行，右侧无匹配时补 NULL。RIGHT/FULL JOIN 的支持度因数据库而异，可通过改写或 UNION 模拟。'],['自连接','同一张表使用不同别名相连，可比较同行业公司、组织上下级或前后记录。'],['连接后聚合','先确认连接粒度，再 GROUP BY。COUNT(右表主键) 能让无匹配的左表对象得到 0，而 COUNT(*) 至少会计入外连接生成的一行。']],
examples:[{title:'外连接计数',note:'列出所有证券及交易笔数，包括 0 笔。',sql:`SELECT s.symbol,s.security_name,COUNT(t.trade_id) AS trade_count\nFROM securities s LEFT JOIN trades t ON t.symbol=s.symbol\nGROUP BY s.symbol,s.security_name;`},{title:'同行业公司自连接',note:'用编号大小避免 A-B 与 B-A 重复。',sql:`SELECT a.company_name AS company_a,b.company_name AS company_b,a.industry\nFROM companies a JOIN companies b\n ON a.industry=b.industry AND a.company_id<b.company_id;`}],
pitfalls:['LEFT JOIN 后在 WHERE 中筛右表普通列，可能把外连接重新变成内连接。','外连接计数使用 COUNT(*)，导致无明细对象被计为 1。'],
challenge:{question:'列出全部贷款、借款人和累计还款额；没有付款的贷款显示 0。',sql:`SELECT /* 贷款、姓名、累计还款 */ FROM loans l JOIN borrowers b ON /*...*/ LEFT JOIN payments p ON /*...*/ GROUP BY /*...*/;`,answer:`SELECT l.loan_id,b.borrower_name,l.principal,\n       COALESCE(SUM(p.amount),0) AS paid_amount\nFROM loans l\nJOIN borrowers b ON b.borrower_id=l.borrower_id\nLEFT JOIN payments p ON p.loan_id=l.loan_id\nGROUP BY l.loan_id,b.borrower_name,l.principal\nORDER BY l.loan_id;`,note:'COALESCE 把无付款时的 NULL 汇总结果转换为 0。'}
},
{
detailIntro:'UNION 把多个查询纵向组合，适用于同结构的来源、规则或时期。列名来自第一个查询，最终排序只能放在整个组合查询末尾。',
guide:[['结构兼容','每个 SELECT 必须返回相同列数，列位置的类型应可兼容；数据库按位置而不是按别名对齐。'],['UNION 与 ALL','UNION 去重，通常需要额外排序或哈希；UNION ALL 保留全部行，更快也更忠实于事件明细。'],['全局排序','各分支通常不单独 ORDER BY；在最后一个 SELECT 之后对整体结果排序或限制。']],
examples:[{title:'合并两类主体',note:'把公司和借款人映射到统一的主体清单。',sql:`SELECT '公司' AS entity_type,CAST(company_id AS TEXT) AS entity_id,company_name AS entity_name FROM companies\nUNION ALL\nSELECT '借款人',CAST(borrower_id AS TEXT),borrower_name FROM borrowers\nORDER BY entity_type,entity_id;`},{title:'观察 UNION 去重',note:'同一行业列表合并后，UNION 去重而 UNION ALL 保留重复。',sql:`SELECT industry AS category FROM companies WHERE company_id<=3\nUNION\nSELECT industry FROM companies WHERE company_id>=3;`}],
pitfalls:['两个分支列顺序不同但类型相容，语句能运行却把含义错位。','不需要去重却使用 UNION，增加成本并丢失重复事件信息。'],
challenge:{question:'创建统一资金事件流：付款为正流入，买入交易为负流出，返回日期、类型和金额。',sql:`SELECT /* 付款 */ UNION ALL SELECT /* 买入交易 */ ORDER BY event_date;`,answer:`SELECT payment_date AS event_date,'贷款回款' AS event_type,amount\nFROM payments\nUNION ALL\nSELECT trade_date,'证券买入',-(quantity*price+fee)\nFROM trades WHERE side='BUY'\nORDER BY event_date,event_type;`,note:'统一结构后可以在上层继续按日或按月汇总现金流。'}
},
{
detailIntro:'INSERT 新增数据。正式写入应明确列清单，理解默认值和约束，并区分单行 VALUES、多行 VALUES 与 INSERT SELECT。',
guide:[['显式列名','列清单让值与字段的对应关系清晰，也允许省略有默认值或可为 NULL 的列。'],['多行与复制','VALUES 可一次插入多行；INSERT INTO ... SELECT ... 可从查询批量复制或转换数据。'],['约束与原子性','主键、外键、NOT NULL、CHECK 会在写入时验证。批量操作是否整批回滚取决于 DBMS 和事务设置。']],
examples:[{title:'多行插入沙盒',note:'创建临时观察名单并一次添加两条记录。',sql:`DROP TABLE IF EXISTS watchlist_demo;\nCREATE TABLE watchlist_demo(symbol TEXT PRIMARY KEY,reason TEXT,priority INTEGER DEFAULT 3);\nINSERT INTO watchlist_demo(symbol,reason) VALUES ('QHM','盈利稳定'),('CYX','观察消费恢复');\nSELECT * FROM watchlist_demo;`},{title:'INSERT SELECT',note:'从贷款查询生成高风险复核队列。',sql:`DROP TABLE IF EXISTS review_queue;\nCREATE TABLE review_queue(loan_id INTEGER PRIMARY KEY,reason TEXT);\nINSERT INTO review_queue\nSELECT loan_id,'逾期'||days_past_due||'天' FROM loans WHERE days_past_due>=30;\nSELECT * FROM review_queue;`}],
pitfalls:['省略列清单并依赖表的物理列顺序。','重复运行 INSERT 导致主键冲突；演示脚本应重建沙盒或使用明确的冲突策略。'],
challenge:{question:'创建 profitable_companies 表，并用 INSERT SELECT 写入 2025 年净利润为正的公司编号与净利润。',sql:`DROP TABLE IF EXISTS profitable_companies;\nCREATE TABLE profitable_companies(company_id INTEGER PRIMARY KEY,net_income_m REAL);\n/* INSERT SELECT */`,answer:`DROP TABLE IF EXISTS profitable_companies;\nCREATE TABLE profitable_companies(company_id INTEGER PRIMARY KEY,net_income_m REAL);\nINSERT INTO profitable_companies(company_id,net_income_m)\nSELECT company_id,net_income_m FROM financials\nWHERE fiscal_year=2025 AND net_income_m>0;\nSELECT * FROM profitable_companies;`,note:'目标列清单和 SELECT 列顺序必须一一对应。'}
},
{
detailIntro:'UPDATE 修改已有行，DELETE 删除行。两者语法简单但影响巨大，专业流程应包含预览、事务、影响行数检查与审计。',
guide:[['UPDATE','SET 可以修改一个或多个列，右侧可引用原值。WHERE 精确限定目标；某些数据库还支持基于 JOIN 的更新。'],['DELETE','DELETE 删除整行，不负责删除表结构。若要删除全部行，TRUNCATE 在部分数据库更快但事务行为不同。'],['安全工作流','先 SELECT 相同 WHERE，开启事务，执行变更，核对影响行数与抽样，再 COMMIT；不符合预期则 ROLLBACK。']],
examples:[{title:'基于原值更新',note:'在沙盒里给关注类贷款利率增加 0.2 个百分点。',sql:`DROP TABLE IF EXISTS loan_edit_demo;CREATE TABLE loan_edit_demo AS SELECT * FROM loans;\nUPDATE loan_edit_demo SET annual_rate=annual_rate+0.002 WHERE status='关注';\nSELECT loan_id,annual_rate FROM loan_edit_demo WHERE status='关注';`},{title:'条件删除与验证',note:'删除沙盒中的零余额记录，并比较前后行数。',sql:`DROP TABLE IF EXISTS loan_delete_demo;CREATE TABLE loan_delete_demo AS SELECT * FROM loans;\nSELECT COUNT(*) AS before_count FROM loan_delete_demo;\nDELETE FROM loan_delete_demo WHERE balance=0;\nSELECT COUNT(*) AS after_count FROM loan_delete_demo;`}],
pitfalls:['遗漏 WHERE 导致全表更新或删除。','只验证“语句成功”而不核对影响范围与业务结果。'],
challenge:{question:'在贷款副本中，把 1–29 天逾期设为“关注”，30 天及以上设为“逾期”，用一个 CASE 更新完成。',sql:`DROP TABLE IF EXISTS loan_status_demo;CREATE TABLE loan_status_demo AS SELECT * FROM loans;\nUPDATE loan_status_demo SET status=CASE /*...*/ END WHERE days_past_due>0;`,answer:`DROP TABLE IF EXISTS loan_status_demo;\nCREATE TABLE loan_status_demo AS SELECT * FROM loans;\nUPDATE loan_status_demo\nSET status=CASE WHEN days_past_due>=30 THEN '逾期' ELSE '关注' END\nWHERE days_past_due>0;\nSELECT loan_id,status,days_past_due FROM loan_status_demo;`,note:'WHERE 排除 0 天记录，CASE 只处理需要重分类的行。'}
},
{
detailIntro:'DDL 定义数据结构。好的表设计把业务规则写进类型、主键、外键、非空、唯一性、默认值和检查约束，而不只依赖应用程序。',
guide:[['CREATE TABLE','为每列选择能表达含义的类型，并定义主键。金额、时间和代码的具体类型要结合目标数据库。'],['约束','NOT NULL 防缺失，UNIQUE 防重复，CHECK 限定范围，FOREIGN KEY 维护引用完整性。约束名称有助于定位生产错误。'],['ALTER 与 DROP','ALTER TABLE 用于演进结构，各 DBMS 支持程度不同；DROP TABLE 删除结构与数据，是高风险操作，需要迁移与恢复计划。']],
examples:[{title:'组合唯一约束',note:'同一证券同一估值日只能有一条价格。',sql:`DROP TABLE IF EXISTS daily_prices;\nCREATE TABLE daily_prices(symbol TEXT NOT NULL,price_date TEXT NOT NULL,close_price REAL CHECK(close_price>0),UNIQUE(symbol,price_date));\nINSERT INTO daily_prices VALUES('BCAI','2025-09-30',46.8);\nSELECT * FROM daily_prices;`},{title:'默认值与外键',note:'创建带默认状态、引用证券表的提醒记录。',sql:`DROP TABLE IF EXISTS price_alerts;\nCREATE TABLE price_alerts(alert_id INTEGER PRIMARY KEY,symbol TEXT NOT NULL,status TEXT DEFAULT '启用',FOREIGN KEY(symbol) REFERENCES securities(symbol));\nINSERT INTO price_alerts(alert_id,symbol) VALUES(1,'HYE');SELECT * FROM price_alerts;`}],
pitfalls:['用字符串保存所有数据，失去类型校验与正确排序。','先删除父表或父记录，却忽略外键依赖。'],
challenge:{question:'设计 portfolio_positions：账户与证券构成组合主键，quantity 不得为负，并分别引用 accounts 与 securities。',sql:`CREATE TABLE portfolio_positions(/* 完成定义 */);`,answer:`DROP TABLE IF EXISTS portfolio_positions;\nCREATE TABLE portfolio_positions(\n account_id INTEGER NOT NULL,\n symbol TEXT NOT NULL,\n quantity INTEGER NOT NULL CHECK(quantity>=0),\n PRIMARY KEY(account_id,symbol),\n FOREIGN KEY(account_id) REFERENCES accounts(account_id),\n FOREIGN KEY(symbol) REFERENCES securities(symbol)\n);`,note:'组合主键保证一个账户对同一证券最多只有一条汇总持仓。'}
},
{
detailIntro:'视图是有名称的查询，可隐藏复杂连接、统一计算口径或限制暴露列。普通视图不自动保存查询结果，性能取决于展开后的底层查询。',
guide:[['抽象与复用','把经常重复的 JOIN、CASE 和计算字段封装为视图，使用者像查询表一样查询它。'],['安全边界','视图可只暴露必要列，但真正的数据安全还依赖数据库权限；不要把视图当作唯一安全措施。'],['可更新性','简单单表视图有时可更新，含聚合、DISTINCT、GROUP BY 或复杂连接的视图通常不可直接更新。']],
examples:[{title:'贷款风险视图',note:'封装借款人、贷款和风险标签。',sql:`DROP VIEW IF EXISTS loan_risk_view;\nCREATE VIEW loan_risk_view AS SELECT l.loan_id,b.borrower_name,b.risk_grade,l.balance,l.days_past_due,CASE WHEN l.days_past_due>=30 THEN '高' WHEN l.days_past_due>0 THEN '中' ELSE '低' END AS risk_band FROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id;\nSELECT * FROM loan_risk_view WHERE risk_band<>'低';`},{title:'聚合视图',note:'建立每只证券的交易统计接口。',sql:`DROP VIEW IF EXISTS security_activity;\nCREATE VIEW security_activity AS SELECT symbol,COUNT(*) AS trade_count,SUM(quantity) AS total_qty FROM trades GROUP BY symbol;\nSELECT * FROM security_activity ORDER BY trade_count DESC;`}],
pitfalls:['误以为普通视图把数据复制了一份或自动缓存。','在视图中写 ORDER BY 并认为任何外层查询都会保持该顺序。'],
challenge:{question:'创建 investor_turnover 视图，按账户汇总成交金额与交易笔数，再连接账户名称查询。',sql:`CREATE VIEW investor_turnover AS /* 聚合查询 */;`,answer:`DROP VIEW IF EXISTS investor_turnover;\nCREATE VIEW investor_turnover AS\nSELECT account_id,COUNT(*) AS trade_count,SUM(quantity*price) AS turnover\nFROM trades GROUP BY account_id;\nSELECT a.investor_name,v.trade_count,ROUND(v.turnover,2) AS turnover\nFROM investor_turnover v JOIN accounts a ON a.account_id=v.account_id\nORDER BY turnover DESC;`,note:'视图保持账户粒度，外层再补充展示名称。'}
},
{
detailIntro:'存储过程把一组 SQL 与控制逻辑保存在数据库服务器端，可接收参数、返回结果并控制权限。SQLite 不提供通用存储过程，本课用参数 CTE 和触发器演示相近思想。',
guide:[['过程的组成','常见能力包括输入/输出参数、局部变量、条件分支、循环、异常处理和事务。具体创建与调用语法高度依赖 DBMS。'],['适用场景','适合靠近数据的批处理、受控写入接口和统一规则；但过度堆积业务逻辑会增加版本管理、测试与迁移难度。'],['SQLite 替代','应用层绑定参数负责安全传值，视图封装只读逻辑，触发器响应数据事件。示例只讲可迁移概念，不伪造 SQLite 不支持的语法。']],
examples:[{title:'多参数查询接口',note:'用一行参数 CTE 模拟最低余额和目标状态。',sql:`WITH params(min_balance,target_status) AS (VALUES(300000,'正常'))\nSELECT loan_id,balance,status FROM loans,params\nWHERE balance>=min_balance AND status=target_status;`},{title:'触发器自动审计',note:'在沙盒表更新时自动写入审计表。',sql:`DROP TABLE IF EXISTS loan_proc_demo;DROP TABLE IF EXISTS loan_audit;\nCREATE TABLE loan_proc_demo AS SELECT * FROM loans;\nCREATE TABLE loan_audit(loan_id INTEGER,old_status TEXT,new_status TEXT);\nCREATE TRIGGER loan_status_audit AFTER UPDATE OF status ON loan_proc_demo BEGIN INSERT INTO loan_audit VALUES(old.loan_id,old.status,new.status);END;\nUPDATE loan_proc_demo SET status='复核' WHERE loan_id=1004;SELECT * FROM loan_audit;`}],
pitfalls:['把 MySQL、SQL Server 或 Oracle 的存储过程语法当作通用 SQL。','通过字符串拼接“参数”，造成 SQL 注入；应用必须使用绑定参数。'],
challenge:{question:'用参数 CTE 同时传入风险等级 D 和最低余额 1000000，返回匹配的借款人与贷款。',sql:`WITH params(target_grade,min_balance) AS (VALUES(/*...*/)) SELECT /*...*/;`,answer:`WITH params(target_grade,min_balance) AS (VALUES('D',1000000))\nSELECT b.borrower_name,b.risk_grade,l.loan_id,l.balance\nFROM borrowers b JOIN loans l ON l.borrower_id=b.borrower_id\nCROSS JOIN params p\nWHERE b.risk_grade=p.target_grade AND l.balance>=p.min_balance;`,note:'真实服务端应将两个值作为绑定参数传给预编译语句。'}
},
{
detailIntro:'事务把多条语句视为一个工作单元。ACID 描述原子性、一致性、隔离性和持久性；实际系统还要选择合适隔离级别并处理并发冲突。',
guide:[['原子性','BEGIN 后的一组变更要么 COMMIT 全部生效，要么 ROLLBACK 全部撤销。适合转账、结算等必须同步成功的操作。'],['保存点','SAVEPOINT 可在大事务内部建立局部回退点，ROLLBACK TO 撤销其后的变更而不必结束整个事务。'],['隔离与并发','并发事务可能产生脏读、不可重复读或幻读。不同隔离级别在一致性、锁竞争和吞吐量间取舍。']],
examples:[{title:'保存点局部回滚',note:'先做一次有效更新，再撤销保存点后的误操作。',sql:`DROP TABLE IF EXISTS tx_demo;CREATE TABLE tx_demo AS SELECT * FROM loans;\nBEGIN;UPDATE tx_demo SET status='复核' WHERE loan_id=1004;SAVEPOINT before_error;UPDATE tx_demo SET balance=0 WHERE loan_id=1004;ROLLBACK TO before_error;RELEASE before_error;COMMIT;SELECT loan_id,balance,status FROM tx_demo WHERE loan_id=1004;`},{title:'转账式双边变更',note:'用简化现金表演示一减一加必须在同一事务。',sql:`DROP TABLE IF EXISTS cash_accounts;CREATE TABLE cash_accounts(id INTEGER PRIMARY KEY,balance REAL CHECK(balance>=0));INSERT INTO cash_accounts VALUES(1,1000),(2,500);BEGIN;UPDATE cash_accounts SET balance=balance-200 WHERE id=1;UPDATE cash_accounts SET balance=balance+200 WHERE id=2;COMMIT;SELECT * FROM cash_accounts;`}],
pitfalls:['认为每条语句成功就代表整项业务一致。','开启事务后忘记 COMMIT/ROLLBACK，长期占用锁和资源。'],
challenge:{question:'在沙盒中把贷款 1005 的余额减少 10000，并新增同额付款；用同一事务完成后核对两边。',sql:`DROP TABLE IF EXISTS tx_loans;DROP TABLE IF EXISTS tx_payments;CREATE TABLE tx_loans AS SELECT * FROM loans;CREATE TABLE tx_payments AS SELECT * FROM payments;BEGIN;/* 两项变更 */COMMIT;`,answer:`DROP TABLE IF EXISTS tx_loans;DROP TABLE IF EXISTS tx_payments;\nCREATE TABLE tx_loans AS SELECT * FROM loans;CREATE TABLE tx_payments AS SELECT * FROM payments;\nBEGIN;\nUPDATE tx_loans SET balance=balance-10000 WHERE loan_id=1005;\nINSERT INTO tx_payments(payment_id,loan_id,payment_date,amount) VALUES(99,1005,'2025-09-30',10000);\nCOMMIT;\nSELECT balance FROM tx_loans WHERE loan_id=1005;\nSELECT * FROM tx_payments WHERE payment_id=99;`,note:'余额与付款记录属于同一业务事实，必须同时成功。'}
},
{
detailIntro:'游标允许逐行读取结果，常用于必须按行执行程序逻辑的场景。但 SQL 擅长集合操作；能用一次 UPDATE、窗口函数或聚合解决时，通常不应逐行循环。',
guide:[['游标生命周期','传统流程包括声明、打开、读取、循环处理、关闭和释放。具体语法依 DBMS 而异。'],['逐行代价','每行一次处理会增加上下文切换、锁持有和网络往返，常被称为 RBAR 问题。'],['集合化替代','窗口函数、条件聚合、CASE、JOIN 和批量 DML 往往能用一条语句处理整组数据。SQLite 浏览器课重点练习这些替代方案。']],
examples:[{title:'LAG 比较前一笔交易',note:'不用游标就能让每行看到同一证券的前一成交价。',sql:`SELECT symbol,trade_date,price,\n LAG(price) OVER(PARTITION BY symbol ORDER BY trade_date,trade_id) AS previous_price\nFROM trades ORDER BY symbol,trade_date;`},{title:'移动平均',note:'对每只证券计算当前行及前一行的两笔移动均价。',sql:`SELECT symbol,trade_date,price,ROUND(AVG(price) OVER(PARTITION BY symbol ORDER BY trade_date,trade_id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW),2) AS moving_avg_2\nFROM trades ORDER BY symbol,trade_date;`}],
pitfalls:['因为熟悉循环就默认使用游标，忽略集合语句。','窗口 ORDER BY 缺少稳定的平局列，同日多行顺序可能不确定。'],
challenge:{question:'计算每个账户按时间累计的买入金额，不使用游标。',sql:`SELECT account_id,trade_date,/* 窗口累计 */ FROM trades WHERE side='BUY';`,answer:`SELECT account_id,trade_id,trade_date,quantity*price AS buy_value,\n SUM(quantity*price) OVER(PARTITION BY account_id ORDER BY trade_date,trade_id ROWS UNBOUNDED PRECEDING) AS cumulative_buy_value\nFROM trades\nWHERE side='BUY'\nORDER BY account_id,trade_date,trade_id;`,note:'显式 ROWS UNBOUNDED PRECEDING 表示从分区第一行累计到当前行。'}
},
{
detailIntro:'最后一课把约束、索引、触发器、CTE、窗口函数和治理串起来。高级 SQL 不只是语法更复杂，而是让性能、完整性、安全与可维护性共同服务业务。',
guide:[['索引与查询计划','索引按键值组织访问路径，适合高选择性筛选、连接和排序；复合索引的列顺序很重要。EXPLAIN 可查看优化器计划。'],['约束与触发器','约束优先表达简单不变量；触发器处理数据事件，但隐藏执行逻辑可能增加调试难度，应有文档和测试。'],['CTE 与窗口','CTE 分解步骤，递归 CTE 可处理层级；窗口函数保留明细同时完成排名、累计和同比。'],['数据治理','使用最小权限、参数绑定、敏感字段脱敏、审计日志、备份恢复与数据保留策略。技术正确不等于有权使用数据。']],
examples:[{title:'复合索引的左前缀',note:'创建状态+余额索引并比较两类查询计划。',sql:`CREATE INDEX IF NOT EXISTS idx_loan_status_balance ON loans(status,balance);\nEXPLAIN QUERY PLAN SELECT * FROM loans WHERE status='逾期' AND balance>100000;\nEXPLAIN QUERY PLAN SELECT * FROM loans WHERE balance>100000;`},{title:'同比窗口分析',note:'用 LAG 取得上年营收并计算增长率。',sql:`WITH y AS(SELECT company_id,fiscal_year,revenue_m,LAG(revenue_m) OVER(PARTITION BY company_id ORDER BY fiscal_year) AS prev_revenue FROM financials) SELECT company_id,fiscal_year,revenue_m,ROUND((revenue_m-prev_revenue)*100.0/prev_revenue,2) AS yoy_pct FROM y ORDER BY company_id,fiscal_year;`}],
pitfalls:['索引越多越好：每个索引都占空间并增加 INSERT/UPDATE/DELETE 成本。','只优化语句速度，不记录指标口径、权限边界和敏感数据用途。'],
challenge:{question:'构建贷款风险排行榜：先按风险等级映射分数，再结合逾期天数与余额计算综合分，并在全部贷款中排名。',sql:`WITH scored AS (SELECT /* 风险分 */ FROM loans l JOIN borrowers b ON /*...*/) SELECT /* 排名 */ FROM scored;`,answer:`WITH scored AS(\n SELECT l.loan_id,b.borrower_name,l.balance,l.days_past_due,\n  (CASE b.risk_grade WHEN 'D' THEN 40 WHEN 'C' THEN 30 WHEN 'B' THEN 20 ELSE 10 END)\n  + MIN(l.days_past_due,100)*0.5\n  + CASE WHEN l.balance>=1000000 THEN 10 ELSE 0 END AS risk_score\n FROM loans l JOIN borrowers b ON b.borrower_id=l.borrower_id\n WHERE l.status<>'结清'\n)\nSELECT *,DENSE_RANK() OVER(ORDER BY risk_score DESC) AS risk_rank\nFROM scored ORDER BY risk_rank,loan_id;`,note:'这是教学评分，不是现实信贷模型。真实模型需要验证、公平性评估、监管合规和持续监控。'}
}
];

lessons.forEach((lesson,index)=>Object.assign(lesson,expansions[index]));

window.SQL_COURSE={seed,lessons};
})();
