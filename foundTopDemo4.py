# 修改整体代码，实现规范局部刷新
import json

from flask import Flask, render_template, request, jsonify, flash
from py2neo import NodeMatcher
from app.build_map import BuildMap
from app.config.settings import DRIVER, GRAPH, MYSQL_CONN
from app.get_rank import GetRank

conn = MYSQL_CONN

graph = GRAPH
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('industry_ranking.html')

@app.route('/expert_search',methods=['GET','POST'])
def expert_search():
    sesstr=''
    if request.method == 'GET':
        persongetid = request.args.get('id')
        if persongetid:
            sesstr = 'MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + str(persongetid) + ' RETURN p1,m,r1'
            result = BuildMap().find_node_and_edge(sesstr)
            return render_template('expert_search.html', result_json=json.dumps(result))
        else:
            return render_template('expert_search.html')


    # return jsonify(elements=result)


@app.route('/fast_get_rank',methods=['POST'])
def fast_get_rank():
    research_dir_list = request.form['research_dir'].split(',')  # 文字内容，是领域或者主题,用英文逗号隔开
    arti_more_important=request.form['arti_more_important']
    article_ra=article_time=patent_ra=referenced_count_rate=downloaded_count_rate=2
    if arti_more_important:
        article_ra=article_time=referenced_count_rate=downloaded_count_rate=8
    else:
        patent_ra=8
    #函数封装

@app.route('/get_ranking', methods=['POST'])
def GetRanking():
    research_dir_list = request.form['research_dir'].split(' ')  # 文字内容，是领域或者主题
    # moren=request.form['moren']
    article_ra = float(request.form['article_ra'])
    article_time = request.form['article_time']
    patent_ra = float(request.form['patent_ra'])
    referenced_count_rate = request.form['referenced_count_rate']
    downloaded_count_rate = request.form['downloaded_count_rate']
    # pa_convertion_rate = request.form.get('pa_convertion_rate')
    print()

    # if moren==True:

    resList=GetRank().get_rank(research_dir_list,article_ra,article_time,patent_ra,referenced_count_rate,downloaded_count_rate)

    return jsonify(resList)


@app.route('/search_achieve', methods=['GET', 'POST'])
def search_achieve():
    # person = request.form['sentence']
    # person=request.args.get('sentence')
    sesstr = ''
    if request.method == 'POST':  # 数据来源于#search_achieve,get是从findtop跳转的
        person = str(request.form.get('name', ''))
        personpostid = str(request.form.get('id', ''))

        if person:
            print('print(person)', person)
            sesstr = 'MATCH (p1{name:"' + person + '"})-[r1:拥有]->(m) RETURN p1,m,r1'
        # if personpostid!='':
        else:
            print('print(personpostid)2', personpostid)
            cursor = conn.cursor()
            idsqlstr = "select name,major,college,artical,download from author_spider where id=" + personpostid
            # print(cursor.execute(idsqlstr))
            if cursor.execute(idsqlstr) == 0:
                # mysql找不到这个人
                flash('没有这个人')
                # 找到对应的neo4j也就是persongetid
            else:
                persondata = cursor.fetchone()  # name,major,college,article,download
                matcher = NodeMatcher(graph)
                re_valuethi_person = matcher.match("person").where(name=persondata[0], major=persondata[1],
                                                                   college=persondata[2]).first()
                string = str(re_valuethi_person)
                persongetid = string.split(':')[0].split('_')[1]
                print(persongetid)
                sesstr = 'MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1'

    if request.method == 'GET':
        persongetid = str(request.args.get('id'))
        if persongetid != '':
            sesstr = 'MATCH (p1)-[r1:拥有]->(m) where id(p1)=' + persongetid + ' RETURN p1,m,r1'

    result=BuildMap().find_node_and_edge(sesstr)

    print(result)

    return jsonify(elements=result)
    # return jsonify(elements={"nodes":nodes})

    # return render_template('search_achiev.html',elements=jsonify({"nodes": nodes, "edges": edges}))


if __name__ == '__main__':
    app.run(debug=True)
