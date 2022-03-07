# coding=utf-8
from flask import Flask, jsonify, request, render_template
#from py2neo import Graph
from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "current-nebula-forum-hope-bagel-3878")) #认证连接数据库

app = Flask(__name__) #flask框架必备

#定义全局变量
res="sen"

def buildNodes(nodeRecord): #构建web显示节点
    data = {"id": nodeRecord._id,
            "label": list(nodeRecord._labels)[0]} #将集合元素变为list，然后取出值
    data.update(dict(nodeRecord._properties))#将属性（包括name）存储为字典
    return {"data": data}

def buildEdges(relationRecord): #构建web显示边
    data = {"source": relationRecord.start_node._id,
            "target":relationRecord.end_node._id,
            "relationship": relationRecord.type}
    return {"data": data}


@app.route('/')#建立路由，指向网页
def index():
    return render_template('search_achieve.html')


# @app.route('/search', methods=['POST'])
# def search():
#     sentence = request.form['sentence'] #['sentence']是从js中获取得到的sentence，然后进行赋值
#     # res = sentence + "hhhhh"
#     res=sentence #更改全局变量res的值
#     return jsonify({'sentence': res})  #利用jsonify将sentence传值到data

@app.route('/graph',methods=['POST'])#两个路由指向同一个网页，返回图的节点和边的结构体
def get_graph():

    person=request.form['sentence']
    personn=str(person)
    # print(personn)

    with driver.session() as session:
        results = session.run('MATCH (p1{name:"' + personn + '"})-[r1:拥有]->(m) RETURN p1,m,r1')
        nodeList = []
        edgeList = []
        #用for对每一个搜索到的三元组进行处理
        for result in results:
            print(result[0])
            # print(result[0]._id)#打印节点id或者label
            print(result[0]._properties['name'])#properties是一个字典 #打印属性中的name

            nodeList.append(result[0])
            # print(result[1])
            nodeList.append(result[1])
            # print(nodeList)
            #将节点去重排列
            nodeList = list(set(nodeList))
            # print(nodeList)
            print(result[2])#打印关系
            edgeList.append(result[2])

        #对nodelist中的每个节点进行查找操作
        for nodeitem in nodeList:
            #找出该节点的name_node
            # print(nodeitem._properties['name'])
            if nodeitem._labels=="article":
                results_node = session.run(
                    'MATCH (m1{title:"' + nodeitem._properties['title'] + '"})-[r2:关联]->(m2) RETURN m1,m2,r2')
                print(results_node)
                for result_node in results_node:
                    edgeList.append(result_node[2])

        nodes = list(map(buildNodes, nodeList))
        edges= list(map(buildEdges,edgeList))

    return jsonify(elements = {"nodes": nodes, "edges": edges})

if __name__ == '__main__':
    app.run(debug = True)