// import http, { globalAgent } from 'http';
import axios from 'axios';
import { shared } from './shared';

let solisConfig = {
    // haveSolisAuthorisation: false,
    solisAddress: '192.168.1.180',

    solisAuthorization: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' },
}


function getValue(s: String): [boolean, number] {

    let bGotData = false;
    let res = 0;
    const parts = s.split('"');
    if (parts.length == 3) {
        res = parseFloat(parts[1]);
        if (isNaN(res)) {
            console.log(`NaN: ${parts} from ${s}`);
            res = 0;
        } else {
            bGotData = (res != 0);
        }
    }
    return [bGotData, res];
}

function parseSolisData(s: String): [boolean, number, number] {

    let bGotNow = false;
    let bGotToday = false;
    let powerNow: number = 0;
    let powerToday: number = 0;

    const arr = s.split("\r\n");
    arr.forEach(el => {

        if (el.startsWith('var ')) {

            if (el.includes('webdata_now_p'))
                [bGotNow, powerNow] = getValue(el);
            else if (el.includes('webdata_today_e'))
                [bGotToday, powerToday] = getValue(el);
        }
    })
    return [bGotNow && bGotToday, powerNow, powerToday]; // as const;
}

async function sleep(secs: number) {
    // console.log('Going to sleep');
    await new Promise(resolve => setTimeout(resolve, secs * 1000));
    // console.log('Awaken');
}

async function getSolisData() {

    // console.log('Getting Solis Data');
    let powerNow = 0;
    let energyToday = 0;
    let bGotData = false;
    const [year, month, day,
            hour, mins, secs] = getDateAndTime();

    // When this fails authorization
    // curl -H "Authorization: Basic YWRtaW46YWRtaW4=" -v http://192.168.1.239:80


    const endPoint = `http://${solisConfig.solisAddress}/status.html`;
    const config = {
        method: 'get',
        url: endPoint,
        headers: solisConfig.solisAuthorization, // { 'Authorization': "Basic YWRtaW46YWRtaW4=" },
    }
    const response = await axios(config);
    if (response.status == 200) {

        const body = await response.data.toString();
        // console.log(body.slice(0, 200));
        [bGotData, powerNow, energyToday] = parseSolisData(body);

        if (bGotData) {
            const date = `${year}/${month}/${day}`;
            const time = `${hour}:${mins}:${secs}`;
            console.log(`Data: ${date} at ${time} Power-Now  : ${powerNow} Watts, Power-Today: ${energyToday} kWHr`);

            energyToday *= 1000; // to make it WattHrs
            shared.latestPowerData = {
                year, month, day,
                hour, mins, secs,
                powerNow,
                energyToday
            };
            shared.dbWriter.write(shared.latestPowerData);
        }

    } else {
        console.log('No data')
        const d = new Date();
        console.error(`[ERROR]: Failed to get Solis Data: ${response.status} at ${d}`); // <<${response.statusText}>>`);
        // globals.haveSolisAuthorisation = (response.status !== 401);
        // console.log('Authorization currently: ', globals.haveSolisAuthorisation);
    }
    // console.log('Setting Solis Data to dBase:')
}

async function waitForHalfMinute() {

    const now = new Date();
    const secs = now.getSeconds();
    const sleepSecs = (secs < 30) ? 30 - secs : 60 - secs;
    console.log('Waiting for half-minute:', sleepSecs, 'seconds until start');
    await sleep(sleepSecs);
    // console.log('On half minute');
}

function getDateAndTime(): [number, number, number, number, number, number] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();

    // const dateStr = `${sYear}/${sMnth}/${sDay}`;
    // const timeStr = `${sHrs}:${sMins}:${sSecs}`;
    // return [dateStr, timeStr];

    return [year, month, day, hour, mins, secs];
}

function doGetSolisData() {
    getSolisData()
        .catch(reason => {
            console.log('GetSolis failed '); //, reason);
        })
}

export async function startSolisData(): Promise<void> {

    waitForHalfMinute()
        .then(() => {
            doGetSolisData();
            setInterval(doGetSolisData,30 * 1000);
        })
}

// export async function doSolisAuthorization() {

//     globals.haveSolisAuthorisation = false;
//     const get_options = {
//         host: globals.solisAddress,      // 'httpbin.org', //
//         port: '80',
//         path: '/',
//         method: 'GET',
//         headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }
//     };

//     console.log('Doing Solis Authorization:');
//     http.get(get_options, res => {

//         let data = '';
//         console.log('Status Code:', res.statusCode);

//         res.on('data', chunk => {
//             data += chunk;
//             // console.log('rec: ', chunk.length);
//         });

//         res.on('end', () => {
//             console.log('Response ended: ', data.slice(0, 20).toString(), '...');

//             globals.haveSolisAuthorisation = (res.statusCode === 200);
//             console.log('Authorization: ', globals.haveSolisAuthorisation);
//         });
//     }).on('error', err => {
//         console.log('Error: ', err.message);
//     });
//     console.log('Authorization Done');
// }
