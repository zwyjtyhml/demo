#修改整体代码，实现规范局部刷新
from neo4j import GraphDatabase

from flask import Flask, render_template, request, jsonify
import pandas as pd
from app.calcuscore import CalcuScore

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "current-nebula-forum-hope-bagel-3878")) #认证连接数据库
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('foundTop.html')

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
    # print('1',msgview.to_json()) #将dict转成str
    # print('2',msgview.to_json(orient='index'))
    print('3',msgview.to_json(orient='columns'))
    print('4', msgview.to_dict())
    # print('4', msgview.to_json(orient='records'))
    print('5',msgview["author_id"])
    print('6',msgview["author_id"][32])
    # print('7',jsonify(msgview.to_dict()))
    data=msgview.to_dict()
    print(data)

    return jsonify(data)#是否需要ensure_ascii=False?
    # return jsonify({'ss':"sjhds"})

if __name__ == '__main__':
    app.run(debug = True)