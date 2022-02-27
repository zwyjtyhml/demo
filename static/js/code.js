$(function () {

    // $("#button").click(function()
    // {
    //     $.post("/search", //需要更改
    //         {
    //             "sentence":$("#input_sentence").val(),
    //         },
    //     function(data,status)
    //     {
    //         // alert(data.sentence);
    //         $("#output_sentence").text(data.sentence)
    //     });
    // });

    $("#submitB1").click(function () {


        }
    )

    $("#button2").click(function () {
        $.post("/graph", //需要更改
            {
                "sentence": $("#input2").val(),
            },
            function (result)//result.sentence
            {
                var cy = window.cy = cytoscape
                ({
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
                        //      边属性
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
                        //     选中属性
                        .selector(':selected').css({
                            'background-color': 'black',
                            'line-color': 'black',
                            'target-arrow-color': 'black',
                            'source-arrow-color': 'black',
                            'opacity': 1
                        }) //点击后节点与边的样式
                        .selector('.faded').css({'opacity': 0.25, 'text-opacity': 0}),
                    layout: {name: 'cose', fit: true},  //画布自适应大小
                    elements: result.elements
                });

                // call on core,点击空白处的提醒
                cy.qtip({
//	    content:{
//	        text:'loading...',
//	        ajax:{
//	            url:'https://start.firefoxchina.cn/',
//	            type:'GET'
//	        }
//	    }
                    content: '空白处',
                    position: {
                        my: 'top center',
                        at: 'bottom center'
                    },
                    show: {
//		    event:'click'
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
//				 title:'以下是研究方向成果'
//				 title: ele.data('label')     //label测试
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
                    }
                    return "以下是研究方向成果"
                }

                function qtipText(node) {
                    // console.log(node);

//		  var description = '<i>' + node.data('lianjie') + '</i>';     //文本格式

//           1. 普通方法无法形成链接
//          var link='<a herf="http://www.w3school.com.cn">w3w3w3</a>'

                    if (node.data('label') == 'person') {
                        //如果节点的label是Name
                        //   return "作者信息/作者描述"
                        //   var description='<i>' + node.data('college') + '</i>'+'<i>' + node.data('major')+ '</i>'
                        var description = $('<ul><li>' + node.data('college') + '</li><li>' + node.data('major') + '</li></ul>');
                        return description
                    } else {//label是wenzhang或者zhuanli
                        var link = $('<a href="' + node.data('date_url') + '" id="link" style="color:blue">' + node.data('title') + '</a>');
//		  return description + '</p>';
                        return link;
                    }
                    //======================应该添加条件语句，判断节点类型

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
//        console.log('这就是我想要的哈哈哈哈哈哈');
//    })


            }, 'json');
    });


//   $.get('/graph', function(result)
//   {
//     var cy =window.cy = cytoscape
//     ({
//       container: document.getElementById('cy'),
// 	  style:cytoscape.stylesheet()
//       .selector('node[label = "Name"]').css({'background-color': '#6FB1FC','content': 'data(name)'}) //节点样式蓝色
// //      .selector('node[label = "zhuanli"]').css({'background-color': '#F5A45D','content': 'data(title)'})//橙色
//       .selector('node[label = "zhuanli"]').css({'background-color': '#F5A45D','content': 'data(name)'})//橙色
//       .selector('node[label = "wenzhang"]').css({'background-color': '#FFC0CB','content': 'data(name)'})//粉色
// //      边属性
// 	  .selector('edge[relationship="拥有"]').css({'curve-style': 'bezier','target-arrow-shape': 'triangle','line-color': '#ffaaaa','target-arrow-color': '#ffaaaa','content': 'data(relationship)'}) //边线样式
//
// 	  .selector('edge[relationship="关联"]').css({'curve-style': 'bezier','target-arrow-shape': 'triangle','line-color': '#A9A9A9','target-arrow-color': '#A9A9A9','content': 'data(relationship)'}) //边线样式
// //     选中属性
//       .selector(':selected').css({'background-color': 'black','line-color': 'black','target-arrow-color': 'black','source-arrow-color': 'black','opacity': 1}) //点击后节点与边的样式
//       .selector('.faded').css({'opacity': 0.25,'text-opacity': 0}),
//       layout: { name: 'cose', fit: true },  //画布自适应大小
//       elements: result.elements
// 	});
//
// 	// call on core,点击空白处的提醒
// 	cy.qtip({
// //	    content:{
// //	        text:'loading...',
// //	        ajax:{
// //	            url:'https://start.firefoxchina.cn/',
// //	            type:'GET'
// //	        }
// //	    }
// 		content: '空白处',
// 		position: {
// 			my: 'top center',
// 			at: 'bottom center'
// 		},
// 		show: {
// //		    event:'click'
// 			cyBgOnly: true//这是修改前
// 		},
// 		style: {
// 			classes: 'qtip-bootstrap',
// 			tip: {
// 				width: 16,
// 				height: 8
// 			}
// 		}
// 	});
//
// 	  cy.nodes().forEach(function(ele) {
// 			ele.qtip({
// 			  content: {
// 				text: qtipText(ele),
// 				title:makeTitle(ele)
// //				 title:'以下是研究方向成果'
// //				 title: ele.data('label')     //label测试
// 			  },
// 			  style: {
// 				classes: 'qtip-bootstrap'
// 			  },
// 			  position: {
// 				my: 'bottom center',
// 				at: 'top center',
// 				target: ele
// 			  }
// 			})
// 		  });
//
//         function makeTitle(node) {
//         if(node.data('label')=='Name'){
//             return "以下是作者信息"
//         }
//         else{
//         }
//             return "以下是研究方向成果"
//         }
//
//
// 		function qtipText(node) {
//
// //		  var description = '<i>' + node.data('lianjie') + '</i>';     //文本格式
//
// //           1. 普通方法无法形成链接
// //          var link='<a herf="http://www.w3school.com.cn">w3w3w3</a>'
//
//           if(node.data('label')=='Name'){
//           //如果节点的label是Name
//             return "作者信息/作者描述"
//           }
//           else{//label是wenzhang或者zhuanli
//              var link=$('<a href="'+node.data('lianjie')+'" id="link" style="color:blue">'+node.data('name')+'</a>');
// //		  return description + '</p>';
//             return link;
//           }
//            //======================应该添加条件语句，判断节点类型
//
// 		}
//
//
//
//
//
//
// //	cy.elements().qtip
// //	({ //点击elements处的提醒
// //		content: {//function(){ return 'Example qTip on ele ' + this.id() },
// //			text:'lianjie',
// ////			title:function(){ return '这是专利详情' + this.id() }\
// //            title:function(){return'详情'}
// //			},
// //		position: {
// //			my: 'top center',
// //			at: 'bottom center'
// //		},
// //		style: {
// //			classes: 'qtip-bootstrap',
// //			tip: {
// //				width: 16,
// //				height: 8
// //			}
// //		}
// //	});
//
// ////监听节点的点击事件
// //    cy.on('tap','node',function(evt){
// //        var node =evt.target;
// //        console.log('这就是我想要的哈哈哈哈哈哈');
// //    })
//
//
//
// }, 'json');


});