import pymysql
import time
import pandas as pd
from flask import Flask, url_for, redirect, flash,request,render_template
from neo4j import GraphDatabase
#查询输入主题的top10人物
#添加专利数据后的查询

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "current-nebula-forum-hope-bagel-3878")) #认证连接数据库
# 建立数据库连接
conn = pymysql.Connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='123456',
    db='zstp',
    charset='utf8'
)


app = Flask(__name__) #flask框架必备


def switch_level(item):
    # 一类期刊分数在80-100，基础分baseScore80
    # 二类期刊分数60-80，基础分baseScore60
    # 三类期刊分数40-60，基础分baseScore40
    level = {
        # "一类": 80,
        ('一类',):80,
        ('二类',):60,
        ('三类',):40,
    }
    return level.get(item,20)

def CalActicleScore(source,date,atra,referenced_count,rcra,downloaded_count,dcra):#计算返回文章得分
    #获取文章所属期刊类别，即判断sourse所属类别,得到baseScore
    cursor1 = conn.cursor()
    sqlstr="SELECT level from zstp.periodical_division WHERE jurnalName='"+source+"'"
    # sqlstr = "SELECT level from zstp.periodical_division WHERE jurnalName='中国科学'"
    cursor1.execute(sqlstr)
    data1=cursor1.fetchone()
    # print(data1)
    baseScore=switch_level(data1)
    print('basescore',baseScore)
    cursor1.close()

    #计算时间间隔，取20年以内比分
    # print(date)
    dateTemp=date+" --"
    date=dateTemp.split(" ")[0]
    # print(date)
    start_time = time.mktime(time.strptime(date,'%Y-%m-%d'))
    end_time = int(time.time())
    count_dayScRa = float((int((end_time - start_time) / (24 * 60 * 60)))/(20*365+5))#时间线拉到20年内，该值越小，表示文章越新
    score1=(1-count_dayScRa)*20*float(atra)/(float(atra)+float(rcra)+float(dcra))#时间额外加分计算完成
    # print(score1)
    #下载量100,000满分
    #被引量3000满分
    score2=(referenced_count/3000)*20*(float(rcra)/(float(atra)+float(rcra)+float(dcra)))
    score3=(downloaded_count/100000)*20*(float(dcra)/(float(atra)+float(rcra)+float(dcra)))

    return score1+score2+score3+baseScore

def CalPatentScore(date):
    # 计算时间间隔，取20年以内比分
    # print(date)
    dateTemp = date + " --"
    date = dateTemp.split(" ")[0]
    # print(date)
    start_time = time.mktime(time.strptime(date, '%Y-%m-%d'))
    end_time = int(time.time())
    count_dayScRa = float((int((end_time - start_time) / (24 * 60 * 60))) / (20 * 365 + 5))  # 时间线拉到20年内，该值越小，表示文章越新
    score = (1 - count_dayScRa) * 100  #根据时间计算专利得分，满分100
    return score



@app.route('/', methods=['GET', 'POST'])
def index():

    #声明全局变量
    d_html_text=""

    if request.method == 'POST':  # 判断是否是 POST
        #1. 获取输入的各项指标得分和主题
        research_dir =request.form.get('research_dir') #文字内容，是领域或者主题
        article_ra = float(request.form.get('article_ra'))
        article_time = request.form.get('article_time')
        patent_ra = float(request.form.get('patent_ra'))
        referenced_count_rate = request.form.get('referenced_count')
        downloaded_count_rate = request.form.get('downloaded_count')
        pa_convertion_rate = request.form.get('pa_convertion_rate')
        # print(article_ra)

        # 获取游标
        cursor = conn.cursor()
        #2.获取输入的领域或者主题的全部文章节点
        with driver.session() as session:
            # results=session.run('MATCH(art:article) where art.keywords=~\'.*'+research_dir+'.*\' return art')
            # results=session.run('MATCH(per:person)-[r:拥有]->(art:article) where art.keywords=~\'.*'+research_dir+'.*\' return per,r,art')
        # 对查找结果中所有的作者节点进行是否录入数据库进行初始化标记
            #查找的是全部符合条件的三元组
            # 为作者节点增加属性DBentered,初始化值为0，已录入则更改为1
            # MATCH(per:person)-[r:拥有]->(art:article) where art.keywords=~'.*微生物.*' set per.DBentered=0 RETURN per,r,art
            # results=session.run('MATCH(per:person)-[r:拥有]->(art:article) where art.keywords=~\'.*'+research_dir+'.*\' set per.DBentered=0 RETURN per')
            results=session.run('MATCH(per:person)-[r:拥有]->(art) where art.keywords=~\'.*'+research_dir+'.*\' or art.title=~\'.*'+research_dir+'.*\' set per.DBentered=0 RETURN per')
            # session.run('MATCH (per:person) SET per.DBentered = 0 RETURN per')
        #3.获取拥有文章的作者，对每一个作者生成表author_test行数据
            # print('sucessful-111')

            au_id=1
            for result in results:#bug解释：对于match1的结果result,已经进行了保存，match2并不会更新result1的DBentered值，需要重新查询一次
                # print(result[0]._id)#打印节点id或者label
                # print(result[0]._properties['name'])  # properties是一个字典 #打印属性中的name
        #4.对每一个获取的三元组进行：作者信息存入数据库、文章加权评分计算，文章指标评分录入数据库
                judgeResults=session.run('MATCH (per:person) where id(per)='+str(result[0]._id)+' return per.DBentered')
                for record in judgeResults:
                    print(record["per.DBentered"])
                    # if result[0]._properties['DBentered'] == 0:
                    if record["per.DBentered"]==0:
                        # 该作者节点在数据库中无记录
                        # 5.对取出的作者节点进行标记，以作者节点为单位进行各项指标分数录入
                        #             session.run('MATCH (per:person) where id(per)='+result[0]._id+' SET per.DBentered = 1')
                        # 找到列表作者符合条件的文章三元组,并且SET per.DBentered = 1

                        resultsPers = session.run('MATCH (per:person)-[r:拥有]->(aop) where id(per)=' + str(result[0]._id) + ' and (aop.keywords=~\'.*' + research_dir + '.*\' or aop.title=~\'.*' + research_dir + '.*\') SET per.DBentered = 1 return per,r,aop')

                        # resultsPers = session.run('MATCH (per:person)-[r:拥有]->(art:article) where id(per)=' + str(result[0]._id) + ' and art.keywords=~\'.*' + research_dir + '.*\' SET per.DBentered = 1 return per,r,art')
                        # print('sucessful-222')

                        at_count = 0  # 文章计数
                        atg_sum = 0  # 计算发表的文章总分

                        pa_count = 0#专利计数
                        pcr = 0#转化率
                        pag_sum = 0#专利总得分

                        for resultsPer in resultsPers:

                            # print(resultsPer)
                            # 如果aop为文章节点
                            if "article" in resultsPer[2]._labels:
                                # 计算ar_time_grades返回atg,,,,referenced_count,downloaded_count设置为99，待录入数据-------------------------------------------------------------
                                atg = CalActicleScore(resultsPer[2]._properties['sourse'],
                                                      resultsPer[2]._properties['date'],
                                                      article_time, 99, referenced_count_rate, 99,
                                                      downloaded_count_rate)
                                # print('atg',atg)
                                atg_sum = atg_sum + atg
                                at_count = at_count + 1

                            #专利节点
                            else:
                                pa_count=pa_count+1
                                pag=CalPatentScore(resultsPer[2]._properties['patent_date'])
                                #专利算作每个80分
                                pag_sum=pag_sum+pag


                        # pac=0#已转化专利计数
                        #     # pa_convertion_rate需要主动在网站设置-----------------待完成的功能需求(对patent的属性paConvertion进行设置，为0表示未转化，1表示已转化)---------------------------------------------
                        #     #计算专利得分，需要根据专利是否转化来计算
                        #     # ptg=CalPatentScore()

                        #     if results2Per[2]._properties['paConvertion']==1:
                        #         pac=pac+1
                        # #专利转化率计算
                        # if pa_count!=0:
                        #     pcr = pac / pa_count
                        # else:pcr=0
                        # # pag_sum=pac*100*(pa_convertion_rate/10)+pa_count*100*(1-pa_convertion_rate/10)



                        # 总分计算z
                        score = atg_sum * article_ra / (article_ra + patent_ra) + pag_sum * patent_ra / (
                                    article_ra + patent_ra)
                        # print('总分',score)
                        # 录入mysql
                        print(result[0]._properties['name'])
                        #用节点id换au_id
                        sql = "INSERT INTO zstp.author_test (author_id,author_name,article_count,patent_count,referenced_count,downloaded_count,pa_convertion_rate,ar_time_grades,author_college,author_major,score) VALUES (" + str(
                            result[0]._id) + ", '" + str(result[0]._properties['name']) + "'," + str(at_count) + "," + str(
                            pa_count) + ",99,99," + str(pcr) + "," + str(atg_sum) + ",'" + result[0]._properties[
                                  'college'] + "','" + result[0]._properties['major'] + "'," + str(score) + ");"
                        # sql="INSERT INTO zstp.author_test (author_id,author_name,article_count,patent_count,referenced_count,downloaded_count,pa_convertion_rate,ar_time_grades,author_college,author_major,score) VALUES (" + str(result[0]._id) + ", '" + result[0]._properties['name'] + "'," + str(at_count) + "," + str(
                        #     pa_count) + ",99,99," + str(pcr) + "," + str(atg_sum) + ",'" + result[0]._properties[
                        #           'college'] + "','" + result[0]._properties['major'] + "'," + str(score) + ");"
                        cursor.execute(sql)
                        # print(sql)
                        # au_id = au_id + 1


        #对author_test中的每行数据得分计算后排序
        sql="select * from zstp.author_test order by score desc limit 10"
        cursor.execute(sql)
        data = cursor.fetchall()
        df = pd.DataFrame(list(data),columns=['author_id', 'author_name', 'article_count', 'patent_count', 'referenced_count', 'downloaded_count', 'pa_convertion_rate','ar_time_grades','author_college','author_major', 'score'])
        print(df)#打印前十名

        #表清空
        clearsql="truncate table zstp.author_test"
        cursor.execute(clearsql)

        conn.commit()

        cursor.close()
        conn.close()

        d_html_text=df.to_html()
        # print(d_html_text)

    return render_template('foundTop.html',d_html_text=d_html_text)

if __name__ == '__main__':
    app.run(debug = True)