import time
import pymysql
#文章专利计分函数

class CalcuScore():

    def CalActicleScore(self,source, date, atra, referenced_count, rcra, downloaded_count, dcra):  # 计算返回文章得分
        # 获取文章所属期刊类别，即判断sourse所属类别,得到baseScore
        try:
            conn = pymysql.Connect(host='localhost', port=3306, user='root', passwd='123456', db='zstp', charset='utf8')
            cursor1 = conn.cursor()
            sqlstr = "SELECT level from zstp.periodical_division WHERE jurnalName='" + source + "'"
            cursor1.execute(sqlstr)
            data1 = cursor1.fetchone()
            baseScore = switch_level(data1)
            # print('basescore', baseScore)
            cursor1.close()
            conn.close()

        except:
            #没有在数据库里找到文章等级
            print('找不到文献等级，文献为：',source)
            baseScore=0

        # 计算时间间隔，取20年以内比分
        #时间格式为2016-10-11
        #如果格式为201709,算中旬2017-09-15
        if '-' not in date:
            date = date[:4] + '-'+date[5:]+'-'+'15'
        dateTemp = date + " --"
        date = dateTemp.split(" ")[0]
        # print(date)
        # 如果文章在1971年之前，设置为无效文章数据
        year=int(date.split("-")[0])

        if year<=1970:
            date_score=0

        else:
            # print(time.strptime(date, '%Y-%m-%d'))
            start_time = time.mktime(time.strptime(date, '%Y-%m-%d'))
            end_time = int(time.time())
            count_dayScRa = float(
                (int((end_time - start_time) / (24 * 60 * 60))) / (20 * 365 + 5))  # 时间线拉到20年内，该值越小，表示文章越新
            date_score = (1 - count_dayScRa) * 20 * float(atra) / (float(atra) + float(rcra) + float(dcra))  # 时间额外加分计算完成
            # 下载量100,000满分
            # 被引量3000满分

        score2 = (referenced_count / 3000) * 20 * (float(rcra) / (float(atra) + float(rcra) + float(dcra)))
        score3 = (downloaded_count / 100000) * 20 * (float(dcra) / (float(atra) + float(rcra) + float(dcra)))


        return date_score + score2 + score3 + baseScore

    def CalPatentScore(self,date):

        dateTemp = date + " --"
        date = dateTemp.split(" ")[0]
        start_time = time.mktime(time.strptime(date, '%Y-%m-%d'))
        end_time = int(time.time())
        count_dayScRa = float((int((end_time - start_time) / (24 * 60 * 60))) / (20 * 365 + 5))  # 时间线拉到20年内，该值越小，表示文章越新
        score = (1 - count_dayScRa) * 100  # 根据时间计算专利得分，满分100
        return score

def switch_level(item):

    # 一类期刊分数在80-100，基础分baseScore80
    # 二类期刊分数60-80，基础分baseScore60
    # 三类期刊分数40-60，基础分baseScore40

    level = {
        ('一类',):80,
        ('二类',):60,
        ('三类',):40,
    }
    return level.get(item,20)