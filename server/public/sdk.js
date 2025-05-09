import { getBrowserInfo } from "./browser.js";
import { detectPlatform, getDeviceType, madeInfo } from "./device.js";
import { getIpDetails } from "./ip.js";
import { getLocationFromGeolocation } from "./location.js";

const userid = document.getElementById('userid')
const serverResponse = document.getElementById('serverResponse')
const form = document.getElementById('form')

let locationDetails = null;
try {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
    locationDetails = await getLocationFromGeolocation(position.coords);
} catch (geoErr) {
    alert('location denied.')
    console.log('location denied.');
}


export async function collectUserDetails() {
    try {
        const deviceInfo = getDeviceType();
        const browserInfo = getBrowserInfo();
        const madeDetails = madeInfo();
        // const ipDetails=await getIpDetails()
        // console.log(ipDetails)

        const platform = detectPlatform();




        const payload = {
            timestamp: new Date().toISOString(),
            platform,
            deviceInfo,
            browserInfo,
            // ipDetails
            locationDetails,
            madeDetails,
        };

        const res = await fetch('https://web-sdk-eosin.vercel.app/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });


        if (res.ok) {
            const result = await res.json();
            console.log('server response', result);
            serverResponse.innerHTML = `<p>Successfully fetch th data.... </br>${JSON.stringify(result.webSdkData)}</p>`
            localStorage.setItem('sdk-data', JSON.stringify(result.webSdkData))
        } else {
            serverResponse.innerHTML = `<p>Some error occured.</p>`

        }
    } catch (error) {
        console.error('error while getting data ', error);
        return null;
    }
}

form.onsubmit = (e) => {
    e.preventDefault()
    if (userid.value === "") {
        alert('user id is required.')
        return
    }

    collectUserDetails()

}




// export function encodeToBase64(data) {
//     const jsonString = JSON.stringify(data);
//     return btoa(unescape(encodeURIComponent(jsonString)));
// }

