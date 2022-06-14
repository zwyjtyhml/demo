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

    def find_information(self,sesstr):
        """
        :param sesstr:
        :return: 专家和其拥有的成果组成一个数组元素
        """
        with driver.session() as session:
            # sesstr=MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1
            results = session.run(sesstr)
            ids = []
            article_and_patent_ids = []
            divs = []  # 里面存放person_obj，是一个div
            # 用for对每一个搜索到的三元组进行处理
            for result in results:
                people = result[0]
                art_or_pa = result[1]
                if people._id not in ids:  # 作者还未处理过信息
                    ids.append(people._id)  # 标记id,表示已处理
                    person_obj = {
                        'id': people._id,
                        'name': people._properties['name'],
                        'college':people._properties.get('college',''),
                        'download_sum': people._properties.get('download',''),
                        'major': people._properties.get('major',''),
                        'article_sum': people._properties.get('article', ''),
                        'articles':[],
                        'patents':[]
                    }
                    divs.append(person_obj)
                for person_obj in divs:
                    if person_obj['id'] == people._id and art_or_pa._id not in article_and_patent_ids:
                        article_and_patent_ids.append(art_or_pa._id)
                        if 'article' in art_or_pa.labels:
                            art_obj = {
                                'id': art_or_pa._id,
                                'title': art_or_pa._properties.get('title', ''),
                                'date': art_or_pa._properties.get('date', ''),
                                'baseinfo': art_or_pa._properties.get('baseinfo', ''),
                                'sourse': art_or_pa._properties.get('sourse', ''),
                                'keywords': art_or_pa._properties.get('keywords', ''),
                                'date_url': art_or_pa._properties.get('date_url', ''),
                            }
                            person_obj['articles'].append(art_obj)
                        if 'patent' in art_or_pa.labels:
                            patent={
                                'id':art_or_pa._id,
                                'patent_date': art_or_pa._properties.get('patent_date', ''),
                                'patent_applicant': art_or_pa._properties.get('patent_applicant', ''),
                                'address': art_or_pa._properties.get('address', ''),
                                'abstract': art_or_pa._properties.get('abstract', ''),
                                'title': art_or_pa._properties.get('title', ''),
                                'city_number': art_or_pa._properties.get('city_number', ''),
                                'patent_number': art_or_pa._properties.get('patent_number', ''),
                                'publication_date': art_or_pa._properties.get('publication_date', ''),
                                'patent_type': art_or_pa._properties.get('patent_type', ''),
                                'publication_number': art_or_pa._properties.get('publication_number', ''),
                                'main_classification_number': art_or_pa._properties.get('main_classification_number', ''),
                                'classification_number': art_or_pa._properties.get('classification_number', ''),
                            }
                            person_obj['patents'].append(patent)

            return divs

    def find_node_and_edge(self, sesstr):
        """
        :param sesstr:
        :return: 点和边的数组
        """
        with driver.session() as session:
            # sesstr=MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1
            results = session.run(sesstr)
            nodeList = []
            edgeList = []
            ids = []
            article_and_patent_ids = []
            divs = []  # 里面存放person_obj，是一个div
            # 用for对每一个搜索到的三元组进行处理
            for result in results:
                people = result[0]
                art_or_pa = result[1]

                nodeList.append(people)
                nodeList.append(art_or_pa)
                # 将节点去重排列
                nodeList = list(set(nodeList))
                # print(result[2])  # 打印关系
                edgeList.append(result[2])

            # 文章和专利之间的关联
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
