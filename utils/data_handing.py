from app.config.settings import MYSQL_ZSTP_CONN


def data_clean():
    """数据清洗"""
    cursor=MYSQL_ZSTP_CONN.cursor()

    # # 去除periodical_division重复数据（jurnalName重复）
    # sql = "SELECT jurnalName,id from periodical_division"
    # cursor.execute(sql)
    # data = cursor.fetchall()
    # exist_name=[]
    # for i in data:
    #     if i[0] in exist_name:
    #         sql_delete=f'delete from periodical_division where id={i[1]};'
    #         cursor.execute(sql_delete)
    #         print(f"已删除{i}")
    #     else:
    #         exist_name.append(i[0])
    # MYSQL_ZSTP_CONN.commit()

    # 去除article_spider的重复数据（title重复的就对比author和author_college和author_major）
    # 与periodical_division的方法不同，不借助python数组
    # 需要在终端设置only_full_group_by，否则会报错，参考https://blog.csdn.net/qq_39954916/article/details/120123550?spm=1001.2014.3001.5506
    select_repeat_sql_str="select * from(select * ,count(*) as countnumber from article_spider group by title ,author ,author_college, author_major) as A where countnumber >1"
    cursor.execute(select_repeat_sql_str)
    data=cursor.fetchall()
    for i in data:
        # delete_str=f'delete from article_spider where id={i[1]};'      SELECT * FROM article_spider WHERE title="基于光电容积描记法的多路肌肉收缩传感系统" and author="黄建平" and author_college="莆田学院" and author_major =
        print(i)





    cursor.close()
    MYSQL_ZSTP_CONN.close()


if __name__ =='__main__':
    #数据清洗为一次性工作
    data_clean()