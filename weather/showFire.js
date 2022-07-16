var dating = new Date();

var xhr = new XMLHttpRequest();

queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
queryParams += '&' + encodeURIComponent('resultType') + '=' + encodeURIComponent('XML');
queryParams += '&' + encodeURIComponent('ocrn_ymd') + '=' + encodeURIComponent('20220714');

xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        func(this.responseXML).then(function (value) {
            innerHTML(value);
        });
    }
};

xhr.send('');
function func(value) {
    return new Promise(function (resolve) {
        resolve(value);
    })
}
const getOcBysidoFireSmrzPcnd = {
    FALS_DCLR_MNB: ['허위신고건수', null],
    FIRE_PROG_MNB: ['화재진행건수', null],
    FIRE_RCPT_MNB: ['화재접수건수', null], //
    FLSRP_PRCS_MNB: ['오보처리건수', null], //
    LOAD_DT: ['적재일시', null],
    OCRN_YMD: ['발생일자', null],
    SIDO_CD: ['시도코드', null],
    SIDO_NM: ['시도명', null],
    SLF_EXTSH_MNB: ['자체진화건수', null],//
    STN_END_MNB: ['상황종료건수', null],//
}
function addValue(key, value) {
    getOcBysidoFireSmrzPcnd[key][1] = value;
}
function innerHTML(value) {
    let item = value.getElementsByTagName('item');

    let obj = {
        fire: [null, null],
        flsrp: [null, null],
        slf: [null, null],
    }
    //객체에 인천관련 값을 찾아서 저장한다.
    for (let i = 0; i < item.length; i++) {
        if (value.getElementsByTagName('SIDO_NM')[i].childNodes[0].nodeValue == '인천광역시') {
            obj['fire'][0] = value.querySelector('FIRE_RCPT_MNB').tagName//태그네임
            obj['flsrp'][0] = value.querySelector('FLSRP_PRCS_MNB').tagName//태그네임
            obj['slf'][0] = value.querySelector('SLF_EXTSH_MNB').tagName//태그네임

            obj['fire'][1] = value.getElementsByTagName('FIRE_RCPT_MNB')[i].childNodes[0].nodeValue;
            obj['flsrp'][1] = value.getElementsByTagName('FLSRP_PRCS_MNB')[i].childNodes[0].nodeValue;
            obj['slf'][1] = value.getElementsByTagName('SLF_EXTSH_MNB')[i].childNodes[0].nodeValue;

            for (let i = 0; i < 3; i++) {
                let key = Object.keys(obj); //배열로서 키값이 반환된다.
                addValue(obj[key[i]][0], obj[key[i]][1]);
            }
        }

    }
    document.getElementById('show-weather-container').innerHTML =
        `
            <h2>인천광역시 화재건수</h2>
            <h2>${dating}</h2>
            <div>
                <p>화재처리건수 : ${getOcBysidoFireSmrzPcnd[obj['fire'][0]][1]}</p>
                <p>오보처리건수 : ${getOcBysidoFireSmrzPcnd[obj['flsrp'][0]][1]}</p>
                <p>자체진화건수 : ${getOcBysidoFireSmrzPcnd[obj['slf'][0]][1]}</p>
            </div>
        `
}