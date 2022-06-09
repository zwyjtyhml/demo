function input_range_changed() {
    //TODO 滑动条变化函数
    document.getElementById('show_article_ra').innerHTML = value;
    // durVal = parseFloat(duration.value);
    // spdVal = parseFloat(speed.value);
    // const durationPercent = parseFloat(durVal, 2) * 100
    // const speedPercent = parseFloat((spdVal / 5), 2) * 100
    // duration.style.backgroundSize = `${durationPercent}%, 100%`
    // speed.style.background = `linear-gradient(to right, #ffa200, white ${speedPercent}%, white`
};

function send_zdyzb_post() {
    //发送自定义指标
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
                $("#showbtn").click(function () {
                    // $("#fromshowbtn").append("<p id='bynamep'>搜索出当前名字的所有人物及其成就</p>");
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



$(function(){
    // $(".zdyzb").hide();
    $("#zdyzbdiv").hide();//自定义指标隐藏
    $("#rank_tab").hide();
    $("#zidingyizhibiao").click(function () {
        $("#zdyzbdiv").toggle();
        if($("#zdyzbdiv").is(":visible")){//与hidden相反的是visible
            $("#zidingyizhibiao").val("点击收起")
        }else {
            $("#zidingyizhibiao").val("点击自定义权重比例")
        }
    });
    $("#submitB1").click(function () {
        // if($("#zdyzbdiv").show()):
        if ($("#zdyzbdiv").is(":hidden")) {
            // if($("input[name='drone']:checked").val()==1)
            //    TODO 不自定义权重的方法
        } else {
            send_zdyzb_post()
        }
    });



    $("#tofindtop").click(function () {
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