var date = new Date();

var getFullYear = function(value) {
    let isUnder;
    if (value == "year") {
        let year = String(date.getFullYear());
        return year;

    } else if (value == "month") {//month는 한달씩 늦게 나오므로 +1해줘야한다.
        let month = date.getMonth() + 1;
        isUnder = month < 10 ? "0" + month : month;
        return String(isUnder);

    } else if (value == "date") {
        let dating = date.getDate();
        isUnder = dating < 10 ? "0" + dating : dating;
        return String(isUnder);

    } else if (value == "hour") {
        let hour = date.getHours(); //10 22
        let min = date.getMinutes();

        if (hour < 10) {
            if (min < 40) {
                return String("0" + hour - 1 + "00");
            } else {
                return String("0" + hour + "00");
            }

        } else {
            if (min < 40) {
                return String(hour - 1 + "00");
            } else {
                return String(hour + "00");
            }
        }
    }
}

let bDate, bTime, nx, ny;
let getCoordinate = prompt("좌표를 입력해주세요 x, y");

bDate = getFullYear("year") + getFullYear("month") + getFullYear("date");
bTime = getFullYear("hour");
nx = String(getCoordinate.split(',')[0]);
ny = String(getCoordinate.split(',')[1]);

var xhr = new XMLHttpRequest();
//원형 url, key원형

//api key값

var url3 = url + 'getUltraSrtNcst' //초단기실황조회
var key3 = key;

key3 += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
key3 += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('14');
key3 += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML');
key3 += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(bDate);
key3 += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(bTime);
//인천 계양구 계산4동
key3 += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(nx);
key3 += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(ny);

xhr.open('GET', url3 + key3, true);
xhr.onreadystatechange = function () { //?
    if (this.readyState == 4 && this.status == 200) {
        addCategoryValue(this.responseXML).then(function (value) {
            innerHtml(value);
        });
    }
}
xhr.send('');
const category = {
    T1H: ['기온', 'undefined'],
    RN1: ['1시간 강수량', "undefined"],
    PTY: ['강수형태', "undefined"],
    REH: ['습도', "undefined"],
    UUU: ['풍속(동서성분)', "undefined"],
    VVV: ['풍속(남북성분)', "undefined"],
    VEC: ['풍향', "undefined"],
    WSD: ['풍속', "undefined"],
}
var addCategory = function (ct, value) {
    category[ct][1] = value;// 전역에 있는 카테고리리설트를 쓴다.
}
var getHeadCount = function (name) {
    return Object.keys(name).length;
}


function addCategoryValue(xmlDOM) {
    let item = xmlDOM.getElementsByTagName('item');

    for (let i = 0; i < getHeadCount(category); i++) {

        let ct = xmlDOM.getElementsByTagName('category')[i].childNodes[0].nodeValue;//category
        let fcstValue = xmlDOM.getElementsByTagName('obsrValue')[i].childNodes[0].nodeValue;//fcV

        addCategory(ct, fcstValue);
    }
    return new Promise(function (resolve) {
        console.log(category);
        resolve(category);
    })
}
const kindOfPTY = {
    0: ['없음'],
    1: ['비'],
    2: ['비/눈'],
    3: ['눈'],
    4: ['빗방울'],
    5: ['빗방울날림'],
    6: ['눈날림']
}
function innerHtml(value) {
    //여기서부턴 바로 위 func()함수가 비동기처리되서 건너뛰고 147번줄부터 실행되서 category객체를 이용한 값들이 undefined..
    //html로 표현
    document.getElementById("weather-container").innerHTML =
        `<div class="weather-box-blur"></div>
            <div class="weather-box-left">
                <p>${value['T1H'][1]}도</p>
                </div>
                <div class="weather-box-right">
                    <div class="weather-box-right-aboveBox">
                        <span>인천 계양구<span>
                    </div>
                    <div class="weather-box-right-underBox">
                        <span>${value['REH'][0]}: ${value['REH'][1]}%</span>
                        <span>${value['PTY'][0]}: ${kindOfPTY[Number(value['PTY'][1])]}</span>
                        <span>${value['WSD'][0]}: ${value['WSD'][1]}</span>
                    </div>
                </div>
                `
}