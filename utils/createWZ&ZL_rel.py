import pandas as pd
import pymysql
from py2neo import Node, Relationship, Graph, NodeMatcher, RelationshipMatcher
#从数据库中获取数据存入neo4j图形数据库

#专利与文章关联成功

# 建立数据库连接
conn = pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='zstp',
    charset='utf8'
)
# 连接neo4j数据库，输入地址、用户名、密码
graph = Graph('http://localhost:7474', auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))
# graph.delete_all()

# 创建节点
def CreateNode(m_graph, m_label, m_attrs):
    m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"  # _.name='老师' _.name='超市'
    print(111,m_n)
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(m_n).first()#找不到返回none,然后建立节点
    print(222,re_value)  # (_0:Name {name: '\u8001\u5e08'}) (_2:Name {name: '\u8d85\u5e02'})
    if re_value is None:
        m_mode = Node(m_label, **m_attrs)
        n = graph.create(m_mode)
        print('successful')
        return n
    return None


# 查询节点
def MatchNode(m_graph, m_label, m_attrs):
    m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(m_n).first()
    return re_value


# 创建关系
def CreateRelationship(m_graph, m_label1, m_attrs1, m_label2, m_attrs2, m_r_name):

    reValue1 = MatchNode(m_graph, m_label1, m_attrs1)
    reValue2 = MatchNode(m_graph, m_label2, m_attrs2)
    if reValue1 is None or reValue2 is None:
        return False
    m_r = Relationship(reValue1, m_r_name, reValue2)
    n = graph.create(m_r)
    return n

# 获取游标
cursor = conn.cursor()

#建立文章和专利的关联
#从数据库中获取数据
sql = "select zhuanli_name,wenzhang_name from demorelationship"
cursor.execute(sql)
data=cursor.fetchall()
rel=pd.DataFrame(list(data),columns=['zl','wz'])
print(rel)

for i, j in rel.iterrows():
    # 专利
    attr2 = {"name": j.zl}
    # 文章
    attr3={"name":j.wz}
    reValue = CreateRelationship(graph,  "wenzhang", attr3, "zhuanli", attr2,"关联")
    print(reValue)


cursor.close()
conn.close()




















