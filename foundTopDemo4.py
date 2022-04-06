#修改整体代码，实现规范局部刷新
import pymysql
from neo4j import GraphDatabase
import numpy as np

from flask import Flask, render_template, request, jsonify, flash
import pandas as pd
from py2neo import NodeMatcher, Graph

from app.calcuscore import CalcuScore
from app.build_map import BuildMap

conn = pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='spider',
    charset='utf8'
)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "current-nebula-forum-hope-bagel-3878")) #认证连接数据库
graph = Graph('http://localhost:7474', auth=("neo4j", "current-nebula-forum-hope-bagel-3878"))
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('foundTop.html')
    # return render_template('search_achieve.html')

@app.route('/get_ranking',methods=['POST'])
def GetRanking():
    research_dir = request.form['research_dir'] # 文字内容，是领域或者主题
    article_ra = float(request.form['article_ra'])
    article_time = request.form['article_time']
    patent_ra = float(request.form['patent_ra'])
    referenced_count_rate = request.form['referenced_count_rate']
    downloaded_count_rate = request.form['downloaded_count_rate']
    # pa_convertion_rate = request.form.get('pa_convertion_rate')

    msglist = []
    # 2.获取输入的领域或者主题的全部文章节点
    with driver.session() as session:
        # 找到拥有符合条件文章或者专利的作者节点，并给其DBentered属性标记为0
        results = session.run(
            'MATCH(per:person)-[r:拥有]->(art) where art.keywords=~\'.*' + research_dir + '.*\' or art.title=~\'.*' + research_dir + '.*\' set per.DBentered=0 RETURN per')
        for result in results:

            # 对记录中的作者进行图数据库属性查询，是否DBentered属性为1
            judgeResults = session.run(
                'MATCH (per:person) where id(per)=' + str(result[0]._id) + ' return per.DBentered')
            for record in judgeResults:
                if record["per.DBentered"] == 0:
                    # 找到作者拥有的三元组关系，对文章和专利分别计分并总和
                    resultsPers = session.run('MATCH (per:person)-[r:拥有]->(aop) where id(per)=' + str(result[
                                                                                                          0]._id) + ' and (aop.keywords=~\'.*' + research_dir + '.*\' or aop.title=~\'.*' + research_dir + '.*\') SET per.DBentered = 1 return per,r,aop')
                    at_count = 0  # 文章计数
                    atg_sum = 0  # 计算发表的文章总分
                    pa_count = 0  # 专利计数
                    pcr = 0  # 转化率
                    pag_sum = 0  # 专利总得分
                    for resultsPer in resultsPers:
                        if "article" in resultsPer[2]._labels:  # 是文章节点
                            # 计算ar_time_grades返回atg,,,,referenced_count,downloaded_count设置为99，待录入数据-------------------------------------------------------------
                            # print('time=',resultsPer[2]._properties['date'])
                            atg=CalcuScore().CalActicleScore(resultsPer[2]._properties['sourse'],resultsPer[2]._properties['date'],article_time, 99, referenced_count_rate, 99,downloaded_count_rate)
                            atg_sum = atg_sum + atg
                            at_count = at_count + 1
                        # 专利节点
                        else:
                            pa_count = pa_count + 1
                            pag =CalcuScore().CalPatentScore(resultsPer[2]._properties['patent_date'])
                            pag_sum = pag_sum + pag

                    # 总分计算
                    score = atg_sum * article_ra / (article_ra + patent_ra) + pag_sum * patent_ra / (
                            article_ra + patent_ra)

                    newlist = [str(result[0]._id), str(result[0]._properties['name']), str(at_count), str(pa_count), 99,
                               99, str(pcr), str(atg_sum), result[0]._properties['college'],
                               result[0]._properties['major'], str(score)]
                    msglist.append(newlist)

    msgdf = pd.DataFrame(msglist,
                         columns=['author_id', 'author_name', 'article_count', 'patent_count', 'referenced_count',
                                  'downloaded_count', 'pa_convertion_rate', 'ar_time_grades', 'author_college',
                                  'author_major', 'score'])
    msgview = msgdf.sort_values(by='score', axis=0, ascending=False).head(10)  # axis=1表示对列操作,ascending=False表示降序排列
    print(msgview)

    resList=[]#需要的数据有：编号、作者、单位、专业、分数
    for i,j in msgview.iterrows():
        dic={'author_id':j.author_id,'author_name':j.author_name,'author_college':j.author_college,'author_major':j.author_major,'score':j.score}
        resList.append(dic)
    # print(resList)

    # print('1',msgview.to_json()) #将dict转成str
    # print('2',msgview.to_json(orient='index'))#将最外面的大括号变成方括号即是我们需要转化的json
    # print('3',msgview.to_json(orient='columns'))
    # print('4', msgview.to_dict())
    # print('4', msgview.to_json(orient='records'))
    # print('5',msgview["author_id"])
    # print('6',msgview["author_id"][32])
    # print('7',jsonify(msgview.to_dict()))
    # data=msgview.to_dict()

    # 列表转数组是np.array(a),a是数组
    # return jsonify(data)#是否需要ensure_ascii=False?
    # return msgview.to_json(orient='index')#返回的数据undefine
    # return jsonify({'ss':"sjhds"})

    # return jsonify([{"author_id":"60768","author_name":"\u9ec4\u5065","author_college":"\u6c5f\u82cf\u7701\u82cf\u5dde\u5e02\u6c5f\u5357\u822a\u5929\u673a\u7535\u5de5\u4e1a\u516c\u53f8","author_major":"\u6750\u6599\u79d1\u5b66;\u6b66\u5668\u5de5\u4e1a\u4e0e\u519b\u4e8b\u6280\u672f;\u6c7d\u8f66\u5de5\u4e1a;","score":"76.56399726214921"}])
    return jsonify(resList)

@app.route('/search_achieve',methods=['GET','POST'])
def search_achieve():
    # person = request.form['sentence']
    # person=request.args.get('sentence')
    # person=''
    # persongetid=''
    # personpostid=''
    sesstr=''
    if request.method=='POST':#数据来源于#search_achieve,get是从findtop跳转的
        person = str(request.form.get('name',''))
        personpostid=str(request.form.get('id',''))

        if person:
            print('print(person)',person)
            sesstr='MATCH (p1{name:"'+person+'"})-[r1:拥有]->(m) RETURN p1,m,r1'
        # if personpostid!='':
        else:
            print('print(personpostid)2',personpostid)
            cursor = conn.cursor()
            idsqlstr = "select name,major,college,artical,download from author_spider where id=" + personpostid
            # print(cursor.execute(idsqlstr))
            if cursor.execute(idsqlstr)==0:
                #mysql找不到这个人
                flash('没有这个人')
                #找到对应的neo4j也就是persongetid
            else:
                persondata = cursor.fetchone()  # name,major,college,article,download
                matcher = NodeMatcher(graph)
                re_valuethi_person = matcher.match("person").where(name=persondata[0], major=persondata[1],
                                                                       college=persondata[2]).first()
                string=str(re_valuethi_person)
                persongetid=string.split(':')[0].split('_')[1]
                print(persongetid)
                sesstr = 'MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1'

    if request.method=='GET':
        persongetid=str(request.args.get('id'))
        if persongetid!='':
            sesstr='MATCH (p1)-[r1:拥有]->(m) where id(p1)='+persongetid+' RETURN p1,m,r1'

    # personn = str(person)
    # print('sjdkhrfwksroiwrwertwieutj',personn)
    # print('-----------------------',personid)


    with driver.session() as session:
        results = session.run(sesstr)
        nodeList = []
        edgeList = []
        # 用for对每一个搜索到的三元组进行处理
        for result in results:
            # print(result[0])
            print("------",result[0]._id)#打印节点id或者label
            # print(result[0]._properties['name'])  # properties是一个字典 #打印属性中的name
            print("======",result[1]._id)
            nodeList.append(result[0])
            # print(result[1])
            nodeList.append(result[1])
            # print(nodeList)
            # 将节点去重排列
            nodeList = list(set(nodeList))
            # print(nodeList)
            # print(result[2])  # 打印关系
            edgeList.append(result[2])

        # 对nodelist中的每个节点进行查找操作
        for nodeitem in nodeList:
            # 找出该节点的name_node
            # print(nodeitem._properties['name'])
            if nodeitem._labels == "article":
                results_node = session.run(
                    'MATCH (m1{title:"' + nodeitem._properties['title'] + '"})-[r2:关联]->(m2) RETURN m1,m2,r2')
                # print(results_node)
                for result_node in results_node:
                    edgeList.append(result_node[2])

        nodes = list(map(BuildMap.buildNodes, nodeList))
        edges = list(map(BuildMap.buildEdges, edgeList))
        print('--------------------------------------')
        print(nodes)
        print(edges)


    return jsonify(elements={"nodes": nodes, "edges": edges})
    # return jsonify(elements={"nodes":nodes})

    # return render_template('search_achieve.html',elements=jsonify({"nodes": nodes, "edges": edges}))

if __name__ == '__main__':
    app.run(debug = True)