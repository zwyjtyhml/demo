 $(function(){
    //  $("p") 选取 <p> 元素。
    // $("p.intro") 选取所有 class="intro" 的 <p> 元素。
    // $("p#demo") 选取所有 id="demo" 的 <p> 元素。
     $("#button").click(function()
    {
        $.post("/index",
            {
                "sentence":$("#input_sentence").val(),
            },
        function(data,status)
        {
            // alert(data.sentence);
            $("#output_sentence").text(data.sentence)
        });
    });
})