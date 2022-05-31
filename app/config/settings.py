import pymysql
from neo4j import GraphDatabase
from py2neo import Graph



# current-nebula-forum-hope-bagel-3878是公司数据库的连接密码
DRIVER=GraphDatabase.driver("bolt://localhost:7687",
                              auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))  # 认证连接数据库
# neo4j配置
GRAPH=Graph('http://localhost:7474', auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))


# mysql配置
MYSQL_CONN=pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='spider',
    charset='utf8'
)