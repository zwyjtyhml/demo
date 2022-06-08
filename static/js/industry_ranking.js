$(function () {
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