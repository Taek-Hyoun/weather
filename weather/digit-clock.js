let ele = document.querySelector('#digit-clock-container #demo');

function getTime(){
    const date = new Date();
    let h = modify(date.getHours());
    let m = modify(date.getMinutes());
    let s = modify(date.getSeconds());

    ele.innerHTML = "현재시간 : " + h + ":" + m + ":" + s;
}
setInterval(() => {
    getTime();
}, 1000);

function modify(value){
    if(value < 10){
        return "0" + value;
    }
    return value;
}