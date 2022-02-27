import pandas as pd
import pymysql
from py2neo import Node, Relationship, Graph, NodeMatcher, RelationshipMatcher
#根据表patent_spider创建专利节点，并和作者节点进行连接
# 建立数据库连接
conn = pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='spider',
    charset='utf8'
)
# 连接neo4j数据库，输入地址、用户名、密码
graph = Graph('http://localhost:7474', auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))

# MATCH(per:person)-[r:拥有]->(art) where art.keywords=~'.*微生物.*' or art.title=~'.*微生物.*' return per

# 获取游标
cursor = conn.cursor()
#从数据库中获取数据
sql = "select title,patent_type,patent_number,patent_date,publication_number,publication_date,patent_applicant,address,main_classification_number,classification_number,city_number,abstract,author_id from patent_spider"
cursor.execute(sql)
data=cursor.fetchall()
df=pd.DataFrame(list(data),columns=['title','patent_type','patent_number','patent_date','publication_number','publication_date','patent_applicant','address','main_classification_number','classification_number','city_number','abstract','author_id'])

for i, j in df.iterrows():
    attr_patent={"title": j.title,"patent_type":j.patent_type,"patent_number":j.patent_number,"patent_date":j.patent_date,"publication_number":j.publication_number,"publication_date":j.publication_date,"patent_applicant":j.patent_applicant,"address":j.address,"main_classification_number":j.main_classification_number,"classification_number":j.classification_number,"city_number":j.city_number,"abstract":j.abstract,"author_id":j.author_id}
    matcher = NodeMatcher(graph)
    # 在where里面写键值对判断语句
    re_valuethi = matcher.match("patent").where(patent_number=attr_patent['patent_number']).first()
    if re_valuethi is None:
        # 创建人物节点
        m_mode = Node("patent", **attr_patent)
        graph.create(m_mode)
        re_valuethi=m_mode
        # print("专利节点创建成功")

    #对该专利节点进行与人物的关系建立
    idall=str(j.author_id).split(",")
    for id in idall:
        if id!="":#作者id不为空
            matcher = NodeMatcher(graph)
            re_person=matcher.match("person").where(id=id).first()
            if re_person is None:
                print("id是"+id+"的作者不存在")
                #作者节点添加，数据录入
                attr_person_node={"id":id}
                per_node=Node("person",**attr_person_node)
                graph.create(per_node)
            else:
                relationshipAr = Relationship(re_person, "拥有", re_valuethi)
                graph.create(relationshipAr)
                print("关系创建成功")

cursor.close()
conn.close()
