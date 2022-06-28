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
        zoom: 1, // 图表的初始缩放级别.可以设置options.minZoom和options.maxZoom设置缩放级别的限制.
        pan: {x: 0, y: 0}, // 图表的初始平移位置.
        // interaction options:
        minZoom: 0.5, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
        maxZoom: 3, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
        zoomingEnabled: true, // 是否通过用户事件和编程方式启用缩放图形.
        userZoomingEnabled: true, // 是否允许用户事件(例如鼠标滚轮,捏合缩放)缩放图形.对此缩放的编程更改不受此选项的影响.
        panningEnabled: true, // 是否通过用户事件和编程方式启用平移图形.
        userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
        boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
        selectionType: 'single', // 一个字符串，指示用户输入的选择行为.对于'additive',用户进行的新选择将添加到当前所选元素的集合中.对于'single',用户做出的新选择成为当前所选元素的整个集合.
        touchTapThreshold: 8, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
                              // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        desktopTapThreshold: 4, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
                                // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        // autolock: false, // 默认情况下是否应锁定节点(根本不可拖动,如果true覆盖单个节点状态).
        // autoungrabify: false, // 默认情况下节点是否不允许被拾取(用户不可抓取,如果true覆盖单个节点状态).
        // autounselectify: false, // 默认情况下节点是否允许被选择(不可变选择状态,如果true覆盖单个元素状态).
        // rendering options:
        // headless: false, // true:空运行,不显示不需要容器容纳.false:显示需要容器容纳.
        // styleEnabled: true, // 一个布尔值,指示是否应用样式.
        // hideEdgesOnViewport: true, // 渲染提示,设置为true在渲染窗口时,不渲染边.例如,移动某个顶点时或缩放时,边信息会被临时隐藏,移动结束后,边信息会被执行一次渲染.由于性能增强,此选项现在基本上没有实际意义.
        // hideLabelsOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        // textureOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        // motionBlur: true, // 渲染提示,设置为true使渲染器使用运动模糊效果使帧之间的过渡看起来更平滑.这可以增加大图的感知性能.由于性能增强,此选项现在基本上没有实际意义.
        // motionBlurOpacity: 0.2, // 当motionBlur:true,此值控制运动模糊帧的不透明度.值越高,运动模糊效果越明显.由于性能增强,此选项现在基本上没有实际意义.
        // wheelSensitivity: 0.3, // 缩放时更改滚轮灵敏度.这是一个乘法修饰符.因此,0到1之间的值会降低灵敏度(变焦较慢),而大于1的值会增加灵敏度(变焦更快).
        // pixelRatio: 'auto', // 使用手动设置值覆盖屏幕像素比率(1.0建议,如果已设置).这可以通过减少需要渲染的有效区域来提高高密度显示器的性能,
        //                     // 尽管在最近的浏览器版本中这是不太必要的.如果要使用硬件的实际像素比,可以设置pixelRatio: 'auto'(默认).
        // // DOM容器,决定内容展示的位置,方式一(原生):document.getElementById('xx'),方式二(jQuery):$('#xx')

        container: document.getElementById('cy'),
        // layout: {name: 'random'},//这种情况下线会很长不好看
        style: cytoscape.stylesheet()
            .selector('node[label = "person"]').css({
                'background-color': '#6FB1FC',
                'font-size': '11pt',
                'content': 'data(name)'
            }) //节点样式蓝色
            .selector('node[label = "patent"]').css({
                'background-color': '#F5A45D',
                'font-size': '11pt',
                'content': 'data(title)'
            })//橙色
            .selector('node[label = "article"]').css({
                'background-color': '#FFC0CB',
                'font-size': '11pt',
                'content': 'data(title)'
            })//粉色
            .selector('edge[relationship="拥有"]').css({
                'curve-style': 'bezier',
                'font-size': '10pt',
                'target-arrow-shape': 'triangle',
                'line-color': '#ffaaaa',
                'target-arrow-color': '#ffaaaa',
                'content': 'data(relationship)'
            }) //边线样式
            .selector('edge[relationship="关联"]').css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'font-size': '10pt',
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
        zoom: 0.8, // 图表的初始缩放级别.可以设置options.minZoom和options.maxZoom设置缩放级别的限制.
        pan: {x: 0, y: 0}, // 图表的初始平移位置.
        // interaction options:
        minZoom: 0.8, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
        maxZoom: 2, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
        container: document.getElementById('cy2'),
        style: cytoscape.stylesheet()
            .selector('node[label = "person"]').css({
                'background-color': '#6FB1FC',
                'font-size': '11pt',
                'content': 'data(name)'
            }) //节点样式蓝色
            .selector('node[label = "patent"]').css({
                'background-color': '#F5A45D',
                'font-size': '11pt',
                'content': 'data(title)'
            })//橙色
            .selector('node[label = "article"]').css({
                'background-color': '#FFC0CB',
                'font-size': '11pt',
                'content': 'data(title)'
            })//粉色
            .selector('edge[relationship="拥有"]').css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'width': '0.5px', /*线条宽度,无效果*/
                'line-color': '#ffaaaa',
                'font-size': '10pt',
                'target-arrow-color': '#ffaaaa',
                'content': 'data(relationship)'
            }) //边线样式
            .selector('edge[relationship="关联"]').css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'font-size': '10pt',
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
                if (i > 0) {
                    $("#article" + values.id).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                }
                $("#article" + values.id).append('<a href="' + v.date_url + '" class="link" style="color:blue">[' + (i + 1).toString() + ']' + v.title + '[J].' + v.sourse + ',' + v.date + '</a></br>')
            });
        }
        if (values.patents.length > 0) {
            $("#person" + values.id).append("<div class='per_patents' id=patent" + values.id + ">专利：</div>");
            $(values.patents).each(function (i, v) {
                if (i > 0) {
                    $("#patent" + values.id).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                }
                //专利数据目前没有url
                $("#patent" + values.id).append('<a href="' + v.url + '" class="link" style="color:blue">[' + (i + 1).toString() + ']' + v.title + '[P].' + v.patent_applicant + '.' + v.publication_number + ',' + v.patent_date + '</a></br>')
            });
        }
    });
}

$(function () {
    // $("#person_info").hide();
    $("#li_two").css('background-color', '#B8B8DC');
    // $("#li_one").css('background-color', '#CCDDFF');
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