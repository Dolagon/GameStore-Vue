function clock() {
    let hours = document.getElementById('hour');
    let minutes = document.getElementById('min');
    let seconds = document.getElementById('sec');

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();

    // 设置格式
    if (h < 10){
        hours.innerHTML = '0' + h;
    }
    else{
        hours.innerHTML = h;
    }
    if (m < 10){
        minutes.innerHTML='0' + m;
    }
    else{
        minutes.innerHTML = m;
    }
    if (s < 10){
        seconds.innerHTML='0' + s;
    }
    else {
        seconds.innerHTML = s;
    }
}
setInterval(clock,1000)      /*1s执行clock函数一次*/
