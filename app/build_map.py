from app.config.settings import DRIVER

driver = DRIVER


class BuildMap():

    def buildNodes(nodeRecord):  # 构建web显示节点
        data = {"id": nodeRecord._id,
                "label": list(nodeRecord._labels)[0]}  # 将集合元素变为list，然后取出值
        data.update(dict(nodeRecord._properties))  # 将属性（包括name）存储为字典

        return {"data": data}

    def buildEdges(relationRecord):  # 构建web显示边
        data = {"source": relationRecord.start_node._id,
                "target": relationRecord.end_node._id,
                "relationship": relationRecord.type}

        return {"data": data}

    def find_node_and_edge(self, sesstr):
        with driver.session() as session:
            # MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1
            results = session.run(sesstr)
            nodeList = []
            edgeList = []
            ids=[]
            article_and_patent_ids=[]
            divs=[]
            # 用for对每一个搜索到的三元组进行处理
            for result in results:
                if result[0]._id not in ids:
                    ids.append(result[0]._id)
                    person_obj = {
                        'id': result[0]._id,
                        'name': result[0]._properties['name'],
                    }
                    divs.append(person_obj)
                for person_obj in divs:
                    if person_obj['id']==result[0]._id and result[1]._id not in article_and_patent_ids:
                        article_and_patent_ids.append(result[1]._id)
                        person_obj['art_or_pa']=result[1]
                # print(result[0])
                print("------", result[0]._id)  # 打印节点id或者label
                # print(result[0]._properties['name'])  # properties是一个字典 #打印属性中的name
                person_obj.update('name')
                print("======", result[1]._id)
                nodeList.append(result[0])
                nodeList.append(result[1])
                # 将节点去重排列
                nodeList = list(set(nodeList))
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
            node_and_edge = {
                "nodes": nodes,
                "edges": edges
            }

            return node_and_edge
