from pymysql.converters import escape_string

from app.config.settings import MYSQL_ZSTP_CONN


def periodical_division_data_clean():
    """数据清洗"""
    cursor = MYSQL_ZSTP_CONN.cursor()

    # 去除periodical_division重复数据（jurnalName重复）
    sql = "SELECT jurnalName,id from periodical_division"
    cursor.execute(sql)
    data = cursor.fetchall()
    exist_name=[]
    for i in data:
        if i[0] in exist_name:
            sql_delete=f'delete from periodical_division where id={i[1]};'
            cursor.execute(sql_delete)
            print(f"已删除{i}")
        else:
            exist_name.append(i[0])
    MYSQL_ZSTP_CONN.commit()
    cursor.close()
    MYSQL_ZSTP_CONN.close()

def article_spider_data_clean():
    # 去除article_spider的重复数据（title重复的就对比author和author_college和author_major）
    # 与periodical_division的方法不同，不借助python数组
    cursor = MYSQL_ZSTP_CONN.cursor()
    # 需要在终端设置only_full_group_by，否则会报错，参考https://blog.csdn.net/qq_39954916/article/details/120123550?spm=1001.2014.3001.5506
    cursor.execute("select * from(select * ,count(*) as countnumber from article_spider group by title ,date ,author_id) as A where countnumber >1;")
    data = cursor.fetchall()# 里面的记录为有重复数据的行，数据本身不重复
    for item in data:
        title=item[0]
        date=item[5]
        article_id=item[6]
        author_ids=item[8]
        count=item[9]
        cursor.execute('delete from article_spider where title="%s" and date="%s" and author_id="%s" and artical_id<>%d'%(escape_string(title),date,author_ids,article_id))
        MYSQL_ZSTP_CONN.commit()
        print(f"完成文章：{title} 重复项的删除")

    cursor.close()
    MYSQL_ZSTP_CONN.close()


def article_review_and_entry():
    """数据审查与录入"""
    # article_spider中的专家信息录入到author_spider
    cursor = MYSQL_ZSTP_CONN.cursor()
    # select_str = "select artical_id,author ,author_college, author_major from article_spider group by author ,author_college, author_major;"
    # 遗漏了录入作者有多篇文章的文章的专家id数据，因此需要对下面的数据再执行本方法一次。正常情况应该是删去上面str中的group by。
    # select_str="select artical_id,author ,author_college, author_major from article_spider WHERE author_id is NULL"
    # 正常情况如下
    select_str = "select artical_id,author ,author_college, author_major from article_spider"
    cursor.execute(select_str)
    data = cursor.fetchall()
    for i in data:
        person_list = []
        if ';' in i[1]:
            person_list = i[1].split(';')
        else:
            person_list.append(i[1])
        ids_str = ''
        for person_name in person_list:
            # print(f'{person_name}--{i[2]}--{i[3]}')
            if i[2] or i[3]:  # 有学校和专业信息
                find_str = f'select id_new from author_spider where name="{escape_string(person_name)}" and major="{escape_string(i[3])}" and college="{escape_string(i[2])}"'
            elif i[2]:  # 只有学校信息
                find_str = f'select id_new from author_spider where name="{escape_string(person_name)}" and college="{escape_string(i[2])}"'
            elif i[3]:  # 只有专业信息
                find_str = f'select id_new from author_spider where name="{escape_string(person_name)}" and major="{escape_string(i[3])}"'
            else:
                find_str = f'select id_new from author_spider where name="{escape_string(person_name)}"'
            cursor.execute(find_str)
            data2 = cursor.fetchone()
            if not data2:  # 找不到就是none_type
                # 专家表中没有这名专家的信息，需要插入
                cursor.execute('insert into author_spider(name,major,college) values (("%s"),("%s"),("%s"))' % (
                    escape_string(person_name), escape_string(i[3]), escape_string(i[2])))
                MYSQL_ZSTP_CONN.commit()
                print(f"{person_name}插入专家数据库成果成功")
                # 查询该作者的id，进行添加到ids_str
                cursor.execute(
                    f'select id_new from author_spider where name="{escape_string(person_name)}" and major="{escape_string(i[3])}" and college="{escape_string(i[2])}"')
                data3 = cursor.fetchone()
                if ids_str != '':
                    ids_str += ';'
                ids_str += str(data3[0])
            else:
                if ids_str != '':
                    ids_str += ';'
                ids_str += str(data2[0])
            up_str = 'update article_spider set author_id="%s" where artical_id=%d' % (ids_str, i[0])
            cursor.execute(up_str)
            MYSQL_ZSTP_CONN.commit()
            print(f"文章id:{i[0]}关联专家{person_name}成功")

    cursor.close()
    MYSQL_ZSTP_CONN.close()


def patent_review_and_entry():
    """专利表的审查与录入"""
    # 对专利表进行审查修改，对author_id进行更新，如果在专家表中没有找到id（zw）则进行插入，并自动生成new_id
    cursor = MYSQL_ZSTP_CONN.cursor()
    cursor.execute("select id,author_id from patent_spider")
    patent_da = cursor.fetchall()
    for patent in patent_da:
        new_author_id = ''
        author_id_list = patent[1].split(',')
        for id in author_id_list:
            sel_str = 'select id_new from author_spider where id="%s"' % (id,)
            cursor.execute(sel_str)
            new_id = cursor.fetchone()
            if new_author_id != '':
                new_author_id += ';'
            if new_id:  # 在专家表找到了该专家旧id
                new_author_id += str(new_id[0])
            else:
                # 没有找到，在专家表中插入一条数据，填入旧id，搜索返回new_id
                cursor.execute('insert into author_spider(id) values ("%s")' % (id,))
                MYSQL_ZSTP_CONN.commit()
                print(f"{id}插入专家数据库成功")
                cursor.execute('select id_new from author_spider where id="%s"' % (id,))
                new_author_id += str(cursor.fetchone()[0])
        upstr = 'update patent_spider set author_id="%s" where id=%d' % (new_author_id, patent[0])
        cursor.execute(upstr)
        MYSQL_ZSTP_CONN.commit()
        print(f"专利id:{patent[0]}关联专家(id:{new_author_id})成功")

    cursor.close()
    MYSQL_ZSTP_CONN.close()


def patent_spider_data_clean():
    # 去除patent_spider的重复数据（title重复的就对比author和author_college和author_major）
    cursor = MYSQL_ZSTP_CONN.cursor()
    # 需要在终端设置only_full_group_by，否则会报错，参考https://blog.csdn.net/qq_39954916/article/details/120123550?spm=1001.2014.3001.5506
    cursor.execute(
        "select * from(select * ,count(*) as countnumber from patent_spider group by title ,patent_number ,author_id) as A where countnumber >1;")
    data = cursor.fetchall()  # 里面的记录为有重复数据的行，数据本身不重复
    for item in data:
        title = item[0]
        patent_number = item[2]
        patent_id = item[13]
        author_ids = item[12]
        cursor.execute(
            'delete from patent_spider where title="%s" and patent_number="%s" and author_id="%s" and id<>%d' % (
            escape_string(title), patent_number, author_ids, patent_id))
        MYSQL_ZSTP_CONN.commit()
        print(f"完成专利：{title} 重复项的删除")

    cursor.close()
    MYSQL_ZSTP_CONN.close()


if __name__ == '__main__':
    # 数据处理为一次性工作
    # periodical_division_data_clean()
    # article_review_and_entry()
    # patent_review_and_entry()
    # article_spider_data_clean()
    patent_spider_data_clean()
    
