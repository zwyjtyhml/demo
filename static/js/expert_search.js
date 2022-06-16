function search_per_fuc(id) {
    $.get("/draw_graph",
        {
            "id": id.toString()
        },
        function (result) {
            draw(result);
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
    console.log('jhsagj d------------------serwserwser4')

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

//在cy2中画图
function draw_as_add(result) {
    var cy = window.cy = cytoscape({
        container: document.getElementById('cy2'),
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
    console.log('jhsagj d------------------serwserwser4')

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

            var description = $('<ul><li>' + node.data('college') + '</li><li>' + node.data('major') + '</li></ul>');

            // var description =$('<a href="/search_achieve?id='+ node.id()+'" style="color:blue">' + node.data('college')+node.data('major') + '</a>');

            // var description =$('<a href="/search_achieve?id='+ node.id()+'" style="color:blue">' + node.data('college')+node.data('major') + '</a>');

            // var description=$('<input class="btn" type="submit" id="search_per_by_id" name="search_per_by_id" value="' + node.data('name') + '">')
            // var link=$("<input class=\"search_per_by_id_btn\" type=\"submit\" id=" + node.id() + " name=" + node.data('name') + " value=" + node.data('name') + ">")
            // var link=$('<ul><input type="submit">djhfcbgj</ul>')
            // console.log(node.id(),node.data('name'))


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

function add_graph_click(id) {
    $("#cy2").remove();
    $("#person" + id).append("<div id=\"cy2\"></div>");
    $.get("/draw_graph",
        {
            "id": id.toString()
        },
        function (result) {
            //拿到画图的点和边
            draw_as_add(result);
        }, 'json');
}

function show_information(result) {
    $(result).each(function (key, values) {//key是数字0，1，2。。
        $("#person_info").append("<div class='person_div' id=person" + values.id + "></div>");
        // $("#person" + key).append("<div class=\"line_cut\"></div>");
        $("#person" + values.id).append("<div class='per_name'>" + values.name + "</div>");
        $("#person" + values.id).append("<div class='per_college'>单位：" + values.college + "</div>");
        $("#person" + values.id).append("<div class='per_major'>专业：" + values.major + "</div>");
        $("#person" + values.id).append('<input class="scpm3" type="submit" onclick="add_graph_click(' + values.id + ')" value="人物图谱">');
        if (values.articles.length > 0) {
            $("#person" + values.id).append("<div class='per_articles' id=article" + values.id + ">文章：</div>");
            $(values.articles).each(function (i, v) {
                $("#article" + values.id).append('<a href="' + v.date_url + '" class="link" style="color:blue">' + v.title + '</a>')
            });
        }
        if (values.patents.length > 0) {
            $("#person" + values.id).append("<div class='per_patents' id=patent" + values.id + ">专利：</div>");
            $(values.patents).each(function (i, v) {
                //专利数据目前没有url
                $("#patent" + values.id).append('<a href="' + v.url + '" class="link" style="color:blue">' + v.title + '</a>')
            });
        }
    });
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

    var data = document.getElementById('dataid').getAttribute('d');//绑定以获取data值
    if (data !== '') {
        //页面跳转而来的查询人物信息
        //拿到的是id
        // dataJson = JSON.parse(data);
        $.get("/search_achieve",
            {
                "id": data
            },
            function (result) {//这一层函数外包不可以去掉
                show_information(result)
            }, 'json');
        $("#inputpid").val("")
    }
    //人名搜索 展示专家信息
    $("#showbtn").click(function () {
        // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
        // $("#inputprelid").val('')
        // $("#byidp").hide();
        // $("#bynamep").show();
        $("#person_info").html("");//第二次提交需要清空表格数据
        $.post("/search_achieve",
            {
                "name": $("#inputpid").val()
            },
            function (result) {//这一层函数外包不可以去掉
                show_information(result)
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
            }, 'json')
        $("#cy").show()
    });

})