$(function () {

    $.get("/search_achieve",
        // {//连同请求发给后端的数据,暂时没用到
        //     "sentence": $("#input2").val(),
        // },
        function (result) {

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


        }, 'json');

    console.log('jhsagjd------------------serwserwser1')
    $("#showbtn").click(function () {
        console.log('jhsagjd------------------serwserwser2')
        $.get("/search_achieve",
            {//连同请求发给后端的数据,暂时没用到
                "sentence": $("#input2").val(),
            },
            function (result) {

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


            }, 'json');
    });

});