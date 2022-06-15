// const duration = document.getElementById('article_ra');
// const speed = document.getElementById('speed');//渐变样式
function changeV(id) {
    // console.log(id)
    const duration = document.getElementById(id);
    durVal = parseFloat(duration.value);
    $("#show_"+id).html(durVal);
    // spdVal = parseFloat(speed.value);
    const durationPercent = parseFloat(durVal, 2) * 10;
    // const speedPercent = parseFloat((spdVal / 5), 2) * 100
    duration.style.backgroundSize = `${durationPercent}%, 100%`;
    // speed.style.background = `linear-gradient(to right, #ffa200, white ${speedPercent}%, white`
};