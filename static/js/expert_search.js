function draw(result) {
    // console.log('jhsagj d------------------serwserwser')

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        style: cytoscape.stylesheet()
            .selector('node[label = "person"]').css({
                'background-color': '#6FB1FC',
                'content': 'data(name)'
            }) //节点样式蓝色
            .selector('node[label = "patent"]').css({
                'background-color': '#F5A45D',
                'content': 'data(title)'
            })//橙色
            .selector('node[label = "article"]').css({
                'background-color': '#FFC0CB',
                'content': 'data(title)'
            })//粉色
            .selector('edge[relationship="拥有"]').css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-color': '#ffaaaa',
                'target-arrow-color': '#ffaaaa',
                'content': 'data(relationship)'
            }) //边线样式
            .selector('edge[relationship="关联"]').css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-color': '#A9A9A9',
                'target-arrow-color': '#A9A9A9',
                'content': 'data(relationship)'
            }) //边线样式
            //选中属性
            .selector(':selected').css({
                'background-color': 'black',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black',
                'opacity': 1
            }) //点击后节点与边的样式
            .selector('.faded').css({'opacity': 0.25, 'text-opacity': 0}),
        layout: {name: 'cose', fit: true},  //画布自适应大小
        elements: result.elements//获取的节点
    });

    // //javascript进行数据库连接
    //
    // var con = new ActiveXObject("ADODB.Connection");
    // con.ConnectionString = "DRIVER={MySQL ODBC 5.1 Driver};OPTION=3;SERVER=127.0.0.1;User ID=root;Password=123456;Database=mysql;Port=3306";
    // con.open;
    // var rs = new ActiveXObject("ADODB.Recordset");
    // rs.open("select * from user", con);
    // while (!rs.eof) {
    //     var u = rs.Fields("User");
    //     document.write(u);
    //     rs.moveNext;
    // }
    // rs.close();
    // rs = null;
    // con.close();
    // con = null;
    cy.qtip({
        content: '空白处',
        position: {
            my: 'top center',
            at: 'bottom center'
        },
        show: {
            //event:'click'
            cyBgOnly: true//这是修改前
        },
        style: {
            classes: 'qtip-bootstrap',
            tip: {
                width: 16,
                height: 8
            }
        }
    });

    cy.nodes().forEach(function (ele) {// forEach() 方法对数组的每个元素执行一次提供的函数。
        // ele.ondblclick=function () {
        //     console.log('hgfuyfuytf=======================');
        // };

        ele.qtip({
            content: {
                text: qtipText(ele),
                title: makeTitle(ele)
                //title:'以下是研究方向成果'
                // title: ele.data('label')     //label测试
            },
            style: {
                classes: 'qtip-bootstrap'
            },
            position: {
                my: 'bottom center',
                at: 'top center',
                target: ele
            }
        })
    });

    function makeTitle(node) {
        if (node.data('label') == 'person') {
            return "作者信息"
        } else {
            if (node.data('label') == 'patent')
                return "专利成果"
            if (node.data('label') == 'article')
                return "文章成果"
        }
    }

    function qtipText(node) {
        console.log(node);
        //var description = '<i>' + node.data('lianjie') + '</i>';     //文本格式
        //1. 普通方法无法形成链接
        //var link='<a herf="http://www.w3school.com.cn">w3w3w3</a>'
        if (node.data('label') == 'person') {
            //如果节点的label是Name
            //return "作者信息/作者描述"
            //var description='<i>' + node.data('college') + '</i>'+'<i>' + node.data('major')+ '</i>'

            var description = $('<ul><li><input class="searchbtn2" type="submit" id="' + node.id() + '" name="search_per_by_id" onclick="search_per_fuc(this.id)" value="' + node.data('name') + '"></li><li>' + node.data('college') + '</li><li>' + node.data('major') + '</li></ul>');

            // var description =$('<a href="/search_achieve?id='+ node.id()+'" style="color:blue">' + node.data('college')+node.data('major') + '</a>');

            // var description =$('<a href="/search_achieve?id='+ node.id()+'" style="color:blue">' + node.data('college')+node.data('major') + '</a>');

            // var description=$('<input class="btn" type="submit" id="search_per_by_id" name="search_per_by_id" value="' + node.data('name') + '">')
            // var link=$("<input class=\"search_per_by_id_btn\" type=\"submit\" id=" + node.id() + " name=" + node.data('name') + " value=" + node.data('name') + ">")
            // var link=$('<ul><input type="submit">djhfcbgj</ul>')
            // console.log(node.id(),node.data('name'))

            $(".searchbtn2").click(function () {
                $.get("/search_achieve?id=" + this.id.toString(),
                    function (result) {
                        draw(result);
                    }, 'json');
            })

            return description
        } else {//label是wenzhang或者zhuanli
            var link = $('<a href="' + node.data('date_url') + '" id="link" style="color:blue">' + node.data('title') + '</a>');
            if (node.data('label') == 'article') {
                link = $('<ul><li><p>' + node.data('keywords') + '</p></li><li><a href="' + node.data('date_url') + '" id="link" style="color:blue">' + node.data('title') + '</a></li></ul>')
            }
            //return description + '</p>';
            return link;
        }
    }

    return undefined;
}

//	cy.elements().qtip
//	({ //点击elements处的提醒
//		content: {//function(){ return 'Example qTip on ele ' + this.id() },
//			text:'lianjie',
////			title:function(){ return '这是专利详情' + this.id() }\
//            title:function(){return'详情'}
//			},
//		position: {
//			my: 'top center',
//			at: 'bottom center'
//		},
//		style: {
//			classes: 'qtip-bootstrap',
//			tip: {
//				width: 16,
//				height: 8
//			}
//		}
//	});

////监听节点的点击事件
//    cy.on('tap','node',function(evt){
//        var node =evt.target;
//        console.log('这就是');
//    })
$(function () {
    // $("#person_info").hide();

    // if ('{{result_json|safe }}' != '') {
    //     js_object = eval('{{result_json|safe }}');
    //
    //     draw(js_object);
    // }

    //人名搜索 展示专家信息
    $("#showbtn").click(function () {
        // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
        // $("#inputprelid").val('')
        // $("#byidp").hide();
        // $("#bynamep").show();
        $.post("/search_achieve",
            {
                "name": $("#inputpid").val()
            },
            function (result) {//这一层函数外包不可以去掉
                $(result).each(function (key, values) {//key是数字0，1，2。。
                    $("#person_info").append("<div class='person_div' id=person" + key + "></div>");
                    // $("#person" + key).append("<div class=\"line_cut\"></div>");
                    $("#person" + key).append("<div class='per_name'>" + values.name + "</div>");
                    $("#person" + key).append("<div class='per_college'>单位：" + values.college + "</div>");
                    $("#person" + key).append("<div class='per_major'>专业：" + values.major + "</div>");
                    if (values.articles.length > 0) {
                        $("#person" + key).append("<div class='per_articles' id=article" + key + ">文章：</div>");
                        $(values.articles).each(function (i, v) {
                            $("#article" + key).append('<a href="' + v.date_url + '" class="link" style="color:blue">' + v.title + '</a>')
                        });
                    }
                    if (values.patents.length > 0) {
                        $("#person" + key).append("<div class='per_patents' id=patent" + key + ">专利：</div>");
                        $(values.patents).each(function (i, v) {
                            //专利数据目前没有url
                            $("#patent" + key).append('<a href="' + v.url + '" class="link" style="color:blue">' + v.title + '</a>')
                        });
                    }
                });
            }, 'json');
        $("#person_info").show();
        $("#cy").hide();
    });

    //展示图谱
    $("#showbtn2").click(function () {
        $("#person_info").hide();
        $.get("/draw_graph",
            {
                "name": $("#inputpid").val()
            },
            function (result) {
                draw(result)
            },'json')
        $("#cy").show()
    });

})