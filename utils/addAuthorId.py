import pymysql
import pandas as pd
from py2neo import Graph, NodeMatcher,Node
#将表author_spider中的人物属性对图数据库进行完善，对不存在的人物节点进行新增

#2022.3.19将作者id统一化管理，不采用mysql表中的id，由neo4j自动生成新节点的id
conn = pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='spider',
    charset='utf8'
)

graph = Graph('http://localhost:7474', auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))



# cursor = conn.cursor()
# #从数据库中获取数据
# #注意这里的artical
# sql = "select id,name,major,college,artical,download from author_spider"
# cursor.execute(sql)
# data=cursor.fetchall()
# df=pd.DataFrame(list(data),columns=['id','author','major','college','article','download'])#注意这里必须用author，不能用name作为名字字段
# print(df)

# for i, j in df.iterrows():
#     print(j.author)
#     #图数据库中是否存在该人物节点
#     matcher = NodeMatcher(graph)
#     # 在where里面写键值对判断语句
#     re_valuethi = matcher.match("person").where(name=j.author, college=j.college,major=j.major).first()
#     if re_valuethi is None:
#         #创建人物节点
#         m_attrs = {"name": j.author, "college": j.college, "major": j.major, "article": j.article, "download": j.download}
#         print(m_attrs)
#         m_mode = Node("person", **m_attrs)
#         graph.create(m_mode)
#     else:
#         #已存在
#         print(re_valuethi,'已存在人物')
#         #给该节点添加属性
#         properties = {"article":j.article,"download":j.download}
#         addnode = Node(re_valuethi, **properties)
#         # graph.merge(addnode)
#         graph.merge(re_valuethi,"person",properties)
#
# cursor.close()
# conn.close()


#测试给节点添加属性
m_attrs = {"name": "测试人物名", "college": "测试大学", "major": "测试专业"}
# print(m_attrs)
m_mode = Node("person", **m_attrs)
# graph.delete(m_mode)
graph.create(m_mode)
print(m_mode)
add_pro={"article": "文章", "download": "xiazai"}
graph.merge(m_mode,"person",add_pro)
print(m_mode)

m_mode.update({"article": "文章", "download": "xiazai"})
graph.push(m_mode)
print(m_mode)

m_mode.update({"article": "文章"})
graph.push(m_mode)
print(m_mode)

graph.delete(m_mode)





