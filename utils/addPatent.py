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
        # 创建专利节点
        m_mode = Node("patent", **attr_patent)
        graph.create(m_mode)
        re_valuethi=m_mode
        # print("专利节点创建成功")

    #对该专利节点进行与人物的关系建立
    idall=str(j.author_id).split(",")#有多个作者时id的分割符号为“，”
    for id in idall:
        if id!="":#作者id不为空

            #取图数据库中的节点组成拥有关系
            re_valuethi_person=Node()
            #去找到人名等各个信息
            idsqlstr="select name,major,college,artical,download from author_spider where id="+id
            print(cursor.execute(idsqlstr))

            if cursor.execute(idsqlstr)==0:#
                print('人物表里没有这个作者,id是'+id+'的作者不存在"')
                name_from_id="justID"+id
                #去图数据库找一下这个人
                matcher = NodeMatcher(graph)
                re_valuethi_person = matcher.match("person").where(name=name_from_id).first()
                if re_valuethi_person is None:
                    attr_person_node = {"name": name_from_id}
                    re_valuethi_person = Node("person", **attr_person_node)
                    graph.create(re_valuethi_person)
            else:
                try:
                    print('在人物表里找到了作者')
                    #去图数据库找
                    persondata = cursor.fetchone()  # name,major,college,article,download
                    matcher = NodeMatcher(graph)
                    re_valuethi_person = matcher.match("person").where(name=persondata[0], major=persondata[1],college=persondata[2]).first()
                    if re_valuethi_person is None:#没有在neo4j中找到
                        print('没有在图数据库找到')
                        m_attrs = {"name":persondata[0], "college": persondata[2], "major": persondata[1], "article": persondata[3],"download": persondata[4]}
                        # print(m_attrs)
                        re_valuethi_person = Node("person", **m_attrs)
                        graph.create(re_valuethi_person)
                    else:
                        print(re_valuethi_person, '在图数据库找到了')
                        # 给该节点添加属性
                        properties = {"article": persondata[3],"download": persondata[4]}
                        re_valuethi_person.update(properties)
                        graph.push(re_valuethi_person)
                        # graph.merge(re_valuethi_person, "person", properties)
                        print(re_valuethi_person,"加了属性之后")

                    relationshipAr = Relationship(re_valuethi_person, "拥有", re_valuethi)
                    graph.create(relationshipAr)
                    print("关系创建成功")
                except:
                    print('异常情况（调试用）')

cursor.close()
conn.close()
