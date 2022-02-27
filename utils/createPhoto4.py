import pandas as pd
import pymysql
from py2neo import Node, Relationship, Graph, NodeMatcher, RelationshipMatcher
#从数据库中获取数据存入neo4j图形数据库

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
graph.delete_all()

# 创建节点
def CreateNodePerson(m_graph, m_label, m_attrs):
    #如果为person节点,需要双重判断排除同名情况
    # m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"
    matcher = NodeMatcher(m_graph)
    # re_value = matcher.match(m_label).where(m_n).first()
    re_value = matcher.match(m_label).where(name=m_attrs['name']).first()
    if re_value is None:
        m_mode = Node(m_label, **m_attrs)
        graph.create(m_mode)
        # print('successful_111')
        return m_mode
    else:  # 如果名字重复，则对比college和major   # 不重复创建节点
        # m_nsec = "_.college=" + "\'" + m_attrs['college'] + "\'"
        # print("名字重复，看是否在同一学校")
        matcher = NodeMatcher(m_graph)
        re_valuesec = matcher.match(m_label).where(name= m_attrs['name'],college=m_attrs['college']).first()
        if re_valuesec is None:
            print("名字重复但不在同一学校---"+m_attrs['name']+m_attrs['college'])
            m_mode = Node(m_label, **m_attrs)
            graph.create(m_mode)
            # print('successful_222')
            return m_mode
        else:
            print("名字和学校均重复，看是否同专业----"+m_attrs['college'])
            # college仍旧重复
            # m_nthi = "_.major=" + "\'" + m_attrs['major'] + "\'"
            matcher = NodeMatcher(m_graph)
            #在where里面写键值对判断语句
            re_valuethi = matcher.match(m_label).where(name= m_attrs['name'],college=m_attrs['college'],major= m_attrs['major']).first()
            if re_valuethi is None:
                print("名字学校均重复，专业不同----"+m_attrs['name'])
                m_mode = Node(m_label, **m_attrs)
                graph.create(m_mode)
                return m_mode
            else:
                print('人物创建失败---学校和专业都重复---返回值见下行------' + m_attrs['name'])
                # print(re_valuethi)
                #出错，打印不同人物的学校和专业节点
                return re_valuethi


def CreateNodeArticle(m_graph, m_label, m_attrs,writer):
    # m_n="_.title=" + "\'" + m_attrs['title'] + "\'"
    # 如果为文章节点,标题和作者均相同则判断为同一文章
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(title=m_attrs['title']).first()
    if re_value is None:
        m_mode = Node(m_label, **m_attrs)
        graph.create(m_mode)
        # print('文章successful-111')
        return m_mode
    else:  # 不重复创建节点-------------------------------建议修改采用session实现-----------------------------------------------------
        rmatcher = RelationshipMatcher(m_graph)
        #用match来指明要匹配哪种label的节点，用where来表示筛选条件
        pre = matcher.match("person").where(name=writer).first()  # a Node
        if pre is None:
            print('没有找到'+writer)
        #原relationship查询方法
        # relationFound = rmatcher.match({re_value, pre}).first()  # a Relationship
        relationFound=rmatcher.match((pre,re_value),r_type='拥有')
        if relationFound is None:
            m_mode = Node(m_label, **m_attrs)
            graph.create(m_mode)
            # print('文章successful-222'+writer)
            return m_mode
        else:
            print('文章或专利创建失败---可能是重复---' + m_attrs['title'])
            return re_value


# 获取游标
cursor = conn.cursor()
#从数据库中获取数据
sql = "select title,keywords,source,baseinfo,date,author,author_college,author_major,date_url from zw_info"
cursor.execute(sql)
data=cursor.fetchall()
# df=pd.DataFrame(list(data),columns=['a_na','zl_na','wz_na','lianjie'])
df=pd.DataFrame(list(data),columns=['title','keywords','sourse','baseinfo','date','author','author_college','author_major','date_url'])
print(df)

label_person="person"
label_article="article"
label_patent="patent"

for i, j in df.iterrows():#i相当于index，列、属性，j是行数据
    attr_person={"name": j.author,"college":j.author_college,"major":j.author_major}
    # CreateNode(graph, label_name, attr1)
    nodePre=CreateNodePerson(graph,label_person,attr_person)
    # 专利，有链接需要绑定
    if j.baseinfo=="专利":
        #创建对应专利节点
        print('这是一个专利')
    else:
        #归为文章一类
        attr_article={"title":j.title,"keywords":j.keywords,"sourse":j.sourse,"baseinfo":j.baseinfo,"date":j.date,"date_url":j.date_url}
        nodeEnd=CreateNodeArticle(graph,label_article,attr_article,j.author)
        #防止关系的重复创建可以添加全局变量进行条件判断后再创建关系“拥有”
        relationshipAr=Relationship(nodePre, "拥有", nodeEnd)
        graph.create(relationshipAr)

cursor.close()
conn.close()
