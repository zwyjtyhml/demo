function send_zdyzb_post(flag) {
    var dict
    //自定义指标
    if (flag) {
        dict = {
            "research_dir": $("#research_dir").val(),
            "article_ra": $("#article_ra").val(),
            "article_time": $("#article_time").val(),
            "patent_ra": $("#patent_ra").val(),
            "referenced_count_rate": $("#referenced_count").val(),
            "downloaded_count_rate": $("#downloaded_count").val(),
            "show_people_sum":$("#show_people_sum").val(),
        }
    } else {
        // console.log("--------------------------------")
        // console.log($("input[name='drone']:checked").val())
        if ($("input[name='drone']:checked").val() == "arti_more_important") {//重视文章成果
            dict = {
                "research_dir": $("#research_dir").val(),
                "article_ra": 8,
                "article_time": 8,
                "patent_ra": 2,
                "referenced_count_rate": 8,
                "downloaded_count_rate": 8,
                "show_people_sum":$("#show_people_sum").val(),
            }
        } else {
            //重视专利成果
            dict = {
                "research_dir": $("#research_dir").val(),
                "article_ra": 2,
                "article_time": 2,
                "patent_ra": 8,
                "referenced_count_rate": 2,
                "downloaded_count_rate": 2,
                "show_people_sum":$("#show_people_sum").val(),
            }
        }
    }
    //$.post是简写的Ajax函数
    $.post("/get_ranking", dict,
        function (data) {
            topnumber = 1;
            // $("#output").text(data.ss)
            // $("#output").text(data('author_id'))
            $("#rank_tab").show();
            $("#toplist").html("");//第二次提交需要清空表格数据
            $(data).each(//表格展示
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

            //点击人物名字跳转到查询人物专利文章节点的页面
            $(".searchbtn").click(function () {
                // window.location.href="expert_search"; //这是页面跳转方式
                //在新窗口打开方式
                window.open('expert_search?id=' + this.id.toString());
            });
        }, 'json');

}

$(function () {

    // $(".zdyzb").hide();
    $("#zdyzbdiv").hide();//自定义指标隐藏
    $("#rank_tab").hide();
    $("#zidingyizhibiao").click(function () {
        $("#zdyzbdiv").toggle();
        $(".moren").toggle();

        if ($("#zdyzbdiv").is(":visible")) {//与hidden相反的是visible
            $("#zidingyizhibiao").val("点击收起");
            $(".tooltiptext").html("指标值越大表示该指标得分占总分比重越大")
        } else {
            $("#zidingyizhibiao").val("点击自定义权重比例");
            $(".tooltiptext").html("点击设置所选行业的考察指标重要程度，指标值越大表示该指标得分占总分比重越大")
        }
    });
    $("#submitB1").click(function () {//点击生成排名
        if ($("#zdyzbdiv").is(":hidden")) {
            // if($("input[name='drone']:checked").val()==1)
            // 不自定义权重的方法
            send_zdyzb_post(false)
        } else {
            send_zdyzb_post(true)
        }
    });


    // $("#tofindtop").click(function () {
    //     $("#findtop").show();
    //     $("#findachieve").hide();
    // });
    // $("#tosearchachieve").click(function () {
    //     $("#findtop").hide()
    //     $("#findachieve").show();
    //
    //     $("#bynamep").hide();
    //     // $("#inputpid").val("请输入人名或者知网id")
    //
    //     //人名搜索
    //     $("#showbtn").click(function () {
    //         // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有专家及其成就</p>");
    //         $("#inputprelid").val('')
    //         $("#byidp").hide();
    //         $("#bynamep").show();
    //         $.post("/search_achieve",
    //             {
    //                 "name": $("#inputpid").val()
    //             },
    //             function (result) {
    //                 draw(result);
    //             }, 'json');
    //     });
    //
    //     //知网id精确查询
    //     // $("#showbyrelidbtn").click(function () {
    //     //     $("#inputpid").val('')
    //     //     $("#bynamep").hide();
    //     //     $("#byidp").show();
    //     //     $.post("/search_achieve",
    //     //         {
    //     //             "id": $("#inputprelid").val()
    //     //         },
    //     //         function (result) {
    //     //             draw(result);
    //     //         }, 'json')
    //     // });
    // });

});