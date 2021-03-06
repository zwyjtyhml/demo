function search_per_fuc(id){
    $.get("/search_achieve?id=" + id.toString(),
            function (result) {
                draw(result);
            }, 'json');
}

function send_zdyzb_post() {//发送自定义指标
    //$.post是简写的Ajax函数
        $.post("/get_ranking",
            {
                "research_dir": $("#research_dir").val(),
                "article_ra": $("#article_ra").val(),
                "article_time": $("#article_time").val(),
                "patent_ra": $("#patent_ra").val(),
                "referenced_count_rate": $("#referenced_count").val(),
                "downloaded_count_rate": $("#downloaded_count").val(),
            },
            function (data) {
                topnumber = 1;
                // $("#output").text(data.ss)
                // $("#output").text(data('author_id'))
                $("#toplist").html("");//第二次提交需要清空表格数据
                $(data).each(
                    function (i, values) {
                        //i是index，values是每一行的数据
                        $("#toplist").append(
                            // "<tr><td>" + values.author_id + "</td>"//%E6%9C%B1%E7%A3%8A代表朱磊
                            "<tr><td>" + topnumber + "</td>"
                            // + "<td><a href='/search_achieve?name=" + values.author_name + "'>" + values.author_name + "</ta></td>"
                            + "<td><input class=\"searchbtn\" type=\"submit\" id=" + values.author_id + " name=" + values.author_name + " value=" + values.author_name + "></td>"
                            // +"<td><a href='/search_achieve' method='post'>"+ values.author_name +"</a></td>"
                            + "<td>" + values.author_college + "</td>"
                            + "<td>" + values.author_major + "</td>"
                            + "<td>" + values.score + "</td></tr>"
                        );
                        topnumber = topnumber + 1;
                    }
                );

                //跳转到查询人物专利文章节点的页面
                $(".searchbtn").click(function () {
                    $("#findtop").hide();
                    $("#findachieve").show();
                    $("#bynamep").hide();
                    $("#byidp").hide();
                    // $("#byidp").hide();
                    //修改input的value值
                    $("#inputpid").val(this.name)
                    console.log(this.name)
                    $.get("/search_achieve?id=" + this.id.toString(),
                        function (result) {
                            draw(result);
                        }, 'json');

                    //人名搜索
                    $("#showbtn").click(function (){
                        // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
                        $("#byidp").hide();
                        $("#bynamep").show();
                        $.post("/search_achieve",
                            {
                                "name":$("#inputpid").val()
                            },
                        function (result) {
                            draw(result);
                        }, 'json');
                    });

                    //知网id精确查询
                    // $("#showbyrelidbtn").click(function () {
                    //
                    //     $("#bynamep").hide();
                    //     $("#byidp").show();
                    //     $.post("/search_achieve",
                    //         {
                    //             "id":$("#inputprelid").val()
                    //         },
                    //     function (result) {
                    //         draw(result);
                    //     }, 'json')
                    // });


                });

            }, 'json');
}

function send_moren_post() {
    $.post("/get_ranking",
            {
                "research_dir": $("#research_dir").val(),
                "moren":true
            },
            function (data) {
                topnumber = 1;
                // $("#output").text(data.ss)
                // $("#output").text(data('author_id'))
                $("#toplist").html("");//第二次提交需要清空表格数据
                $(data).each(
                    function (i, values) {
                        //i是index，values是每一行的数据
                        $("#toplist").append(
                            // "<tr><td>" + values.author_id + "</td>"//%E6%9C%B1%E7%A3%8A代表朱磊
                            "<tr><td>" + topnumber + "</td>"
                            // + "<td><a href='/search_achieve?name=" + values.author_name + "'>" + values.author_name + "</ta></td>"
                            + "<td><input class=\"searchbtn\" type=\"submit\" id=" + values.author_id + " name=" + values.author_name + " value=" + values.author_name + "></td>"
                            // +"<td><a href='/search_achieve' method='post'>"+ values.author_name +"</a></td>"
                            + "<td>" + values.author_college + "</td>"
                            + "<td>" + values.author_major + "</td>"
                            + "<td>" + values.score + "</td></tr>"
                        );
                        topnumber = topnumber + 1;
                    }
                );

                //跳转到查询人物专利文章节点的页面
                $(".searchbtn").click(function () {
                    $("#findtop").hide();
                    $("#findachieve").show();
                    $("#bynamep").hide();
                    $("#byidp").hide();
                    // $("#byidp").hide();
                    //修改input的value值
                    $("#inputpid").val(this.name)
                    console.log(this.name)
                    $.get("/search_achieve?id=" + this.id.toString(),
                        function (result) {
                            draw(result);
                        }, 'json');

                    //人名搜索
                    $("#showbtn").click(function (){
                        // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
                        $("#byidp").hide();
                        $("#bynamep").show();
                        $.post("/search_achieve",
                            {
                                "name":$("#inputpid").val()
                            },
                        function (result) {
                            draw(result);
                        }, 'json');
                    });

                    //知网id精确查询
                    // $("#showbyrelidbtn").click(function () {
                    //
                    //     $("#bynamep").hide();
                    //     $("#byidp").show();
                    //     $.post("/search_achieve",
                    //         {
                    //             "id":$("#inputprelid").val()
                    //         },
                    //     function (result) {
                    //         draw(result);
                    //     }, 'json')
                    // });


                });

            }, 'json');
}


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

    cy.nodes().forEach(function (ele) {
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
            if (node.data('label')=='patent')
                return "专利成果"
            if (node.data('label')=='article')
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

            var description = $('<ul><li><input class="searchbtn2" type="submit" id="'+ node.id()+'" name="search_per_by_id" onclick="search_per_fuc(this.id)" value="' + node.data('name') + '"></li><li>' + node.data('college') + '</li><li>' + node.data('major') + '</li></ul>');

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
            if (node.data('label') == 'article'){
                link=$('<ul><li><p>'+node.data('keywords')+'</p></li><li><a href="' + node.data('date_url') + '" id="link" style="color:blue">' + node.data('title') + '</a></li></ul>')
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
    $("#findachieve").hide();
    $("#zdyzbdiv").hide();
    $("#zidingyizhibiao").click(function () {
        $("#zdyzbdiv").toggle();

    });
    $("#submitB1").click(function () {
        // if($("#zdyzbdiv").show()):
        if($("#zdyzbdiv").is(":hidden")){
            // if($("input[name='drone']:checked").val()==1)
        }else{
            send_zdyzb_post()
        }



    });

    $("#tofindtop").click(function (){
        $("#findtop").show();
        $("#findachieve").hide();
    });
    $("#tosearchachieve").click(function () {
        $("#findtop").hide()
        $("#findachieve").show();

        $("#bynamep").hide();
        // $("#inputpid").val("请输入人名或者知网id")

        //人名搜索
        $("#showbtn").click(function () {
            // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
            $("#inputprelid").val('')
            $("#byidp").hide();
            $("#bynamep").show();
            $.post("/search_achieve",
                {
                    "name": $("#inputpid").val()
                },
                function (result) {
                    draw(result);
                }, 'json');
        });

        //知网id精确查询
        // $("#showbyrelidbtn").click(function () {
        //     $("#inputpid").val('')
        //     $("#bynamep").hide();
        //     $("#byidp").show();
        //     $.post("/search_achieve",
        //         {
        //             "id": $("#inputprelid").val()
        //         },
        //         function (result) {
        //             draw(result);
        //         }, 'json')
        // });
    });

});

