
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