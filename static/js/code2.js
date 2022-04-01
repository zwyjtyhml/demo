function draw(result) {
    console.log('jhsagj d------------------serwserwser')

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
            return "以下是研究方向成果"
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
            var description = $('<ul><li>' + node.data('college') + '</li><li>' + node.data('major') + '</li></ul>');
            return description
        } else {//label是wenzhang或者zhuanli
            var link = $('<a href="' + node.data('date_url') + '" id="link" style="color:blue">' + node.data('title') + '</a>');
            //return description + '</p>';
            return link;
        }
    }

    return undefined;
}



$(function () {
    $("#findachieve").hide();
    $("#submitB1").click(function () {
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
                    console.log('藏住了藏住了');
                    $("#findachieve").show();
                    $("#bynamep").hide();
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

                    //id精确查询
                    $("#showbyrelidbtn").click(function () {

                        $("#bynamep").hide();
                        $("#byidp").show();
                        $.post("/search_achieve",
                            {
                                "id":$("#inputprelid").val()
                            },
                        function (result) {
                            draw(result);
                        }, 'json')
                    });


                });

            }, 'json');
    });

    $("#tofindtop").click(function (){
        $("#findtop").show();
        $("#findachieve").hide();
    });
    $("#tosearchachieve").click(function () {
        $("#findtop").hide()
        $("#findachieve").show();

        $("#bynamep").hide();
        $("#inputpid").val("请输入人名或者知网id")

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

        //id精确查询
        $("#showbyrelidbtn").click(function () {
            $("#inputpid").val('')
            $("#bynamep").hide();
            $("#byidp").show();
            $.post("/search_achieve",
                {
                    "id": $("#inputprelid").val()
                },
                function (result) {
                    draw(result);
                }, 'json')
        });
    });

});

