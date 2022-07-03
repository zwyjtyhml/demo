from app.config.settings import MYSQL_ZSTP_CONN


def data_clean():
    """数据清洗"""
    cursor = MYSQL_ZSTP_CONN.cursor()

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
    select_repeat_sql_str = "select * from(select * ,count(*) as countnumber from article_spider group by title ,author ,author_college, author_major) as A where countnumber >1"
    cursor.execute(select_repeat_sql_str)
    data = cursor.fetchall()
    for i in data:
        # delete_str=f'delete from article_spider where id={i[1]};'      SELECT * FROM article_spider WHERE title="基于光电容积描记法的多路肌肉收缩传感系统" and author="黄建平" and author_college="莆田学院" and author_major =
        print(i)

    cursor.close()
    MYSQL_ZSTP_CONN.close()


def review_and_entry():
    """数据审查与录入"""
    # article_spider中的专家信息录入到author_spider
    cursor = MYSQL_ZSTP_CONN.cursor()
    select_str = "select artical_id,author ,author_college, author_major from article_spider group by author ,author_college, author_major;"
    cursor.execute(select_str)
    data = cursor.fetchall()
    for i in data:
        person_list = []
        if ';' in i[1]:
            person_list = i[1].split(';')
            # if i[2] or i[3]:
            #     print('多位作者且author_college, author_major有数据')
            #     for person in person_list:
            #         find_people_str = f'select id_new from author_spider where name="{person}" and major="{i[3]}" and college="{i[2]}"'
            #         cursor.execute(find_people_str)
            #         if len(cursor.fetchall()) == 0:
            #             insert_str = f"insert into author_spider(name,major,college) values ('{person}','{i[3]}','{i[2]}')"
            #             cursor.execute(insert_str)
            #             print(f'{person}已录入专家数据库')
            #             findstr=f'select id_new from author_spider where name="{person}" and major="{i[3]}" and college="{i[2]}"'
            #             cursor.execute(findstr)
            #             default_id = cursor.fetchone()[0]
            #             print(default_id)
            #         else:
            #             default_id=cursor.fetchone()[0]
            #             print(default_id)
            #
            # else:
            #     print('多位作者且author_college, author_major无数据')
            #     for person in person_list:
            #         find_people_str = f'select id_new from author_spider where name="{person}";'
            #         cursor.execute(find_people_str)
            #         print(cursor.fetchall())
            #         if len(cursor.fetchall()) == 0:
            #             insert_str = f"insert into author_spider(name,major,college) values ('{person}','','')"
            #             cursor.execute(insert_str)
            #             print(f'{person}已录入专家数据库')
            #             findstr=f'select id_new from author_spider where name="{person}";'
            #             cursor.execute(findstr)
            #             default_id = cursor.fetchone()[0]
            #             print(default_id)
            #         else:
            #             default_id = cursor.fetchall()
            #             print(default_id)
        else:
            person_list.append(i[1])
            # find_people_str=f'select id_new from author_spider where name="{i[1]}" and major="{i[3]}" and college="{i[2]}"'
            # # print(find_people_str)
            # try:
            #     cursor.execute(find_people_str)
            #     if len(cursor.fetchall()) == 0:
            #         insert_str = f"insert into author_spider(name,major,college) values ('{i[1]}','{i[3]}','{i[2]}')"
            #         cursor.execute(insert_str)
            #         print(f'{i[1]}已录入专家数据库')
            #         findstr=find_people_str
            #         cursor.execute(findstr)
            #         default_id = cursor.fetchone()[0]
            #         print(default_id)
            #     else:
            #         default_id = cursor.fetchone()[0]
            #         print(default_id)
            # except:
            #     # 处理异常数据
            #     print('查询人物失败')
        for person_name in person_list:
            print(f'{person_name}--{i[2]}--{i[3]}')
            if i[2] or i[3]:#有学校和专业信息
                find_str=f'select id_new from author_spider where name="{person_name}" and major="{i[3]}" and college="{i[2]}"'
            elif i[2]:
                find_str = f'select id_new from author_spider where name="{person_name}" and college="{i[2]}"'
            elif i[3]:
                find_str=f'select id_new from author_spider where name="{person_name}" and major="{i[3]}"'
            else:
                find_str = f'select id_new from author_spider where name="{person_name}"'
            cursor.execute(find_str)
            if len(cursor.fetchall()) == 0:
                # 专家表中没有这名专家的信息，需要插入
                insert_str = f"insert into author_spider(name,major,college) values ('{person_name}','{i[3]}','{i[2]}')"

            else:
                print(cursor.feltchall())


    MYSQL_ZSTP_CONN.commit()
    cursor.close()
    MYSQL_ZSTP_CONN.close()


if __name__ == '__main__':
    # 数据处理为一次性工作
    # data_clean()
    review_and_entry()
