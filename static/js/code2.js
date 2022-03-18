$(function () {
    // $("#findachieve").hide()
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

                // $("#output").text(data.ss)
                // $("#output").text(data('author_id'))
                $("#toplist").html("");//第二次提交需要清空表格数据
                $(data).each(
                    function (i, values) {
                        //i是index，values是每一行的数据
                        $("#toplist").append(
                            "<tr><td>" + values.author_id + "</td>"//%E6%9C%B1%E7%A3%8A代表朱磊
                            + "<td><a href='/search_achieve?name=" + values.author_name + "'>" + values.author_name + "</ta></td>"
                            // +"<td><a href='/search_achieve' method='post'>"+ values.author_name +"</a></td>"
                            + "<td>" + values.author_college + "</td>"
                            + "<td>" + values.author_major + "</td>"
                            + "<td>" + values.score + "</td></tr>"
                        )
                    }
                )
            }, 'json');
    });


});