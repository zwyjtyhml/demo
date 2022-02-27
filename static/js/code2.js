$(function () {

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
                $("#output").text(data('author_id'))
                // $(data).each(
                //     function (i,values){
                //         //i是index，values是每一行的数据
                //         $("#toplist").append(
                //             "<tr><td>"+values.bookid+"</td>"
                //             +"<td><a href='https://start.firefoxchina.cn/'>"+values.bookname+"</ta></td>"
                //             +"<td>"+values.price+"</td>"
                //             +"<td>"+values.author+"</td>"
                //             +"<td>"+values.pic+"</td>"
                //             +"<td>"+values.publish+"</td></tr>"
                //         )
                //     }
                // )
            }, 'json');
    });
});