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
            serverResponse.innerHTML = `<p>Successfully fetch the data.... </br>${JSON.stringify(result.webSdkData)}</p>`
            localStorage.setItem('sdk-data', JSON.stringify(result.webSdkData))
        } else {
            serverResponse.innerHTML = `<p>Some error occured.</p>`

        }
    } catch (error) {
        alert('error while getting data ', error);
        return null;
    }
}

// form.onsubmit = (e) => {
//     e.preventDefault()
//     if (userid.value === "") {
//         alert('user id is required.')
//         return
//     }

//     collectUserDetails()

// }


// document.onloadstart=()=>{
    // collectUserDetails()

// }



// async function detectVPNUsage() {
//     const leakedIPs = new Set();
//     let vppn=false
  
//     const rtc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
//     });
//     rtc.createDataChannel("");
  
//     rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
  
//     rtc.onicecandidate = async (event) => {
//       if (event.candidate) {
//         const ipRegex = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/;
//         const ipMatch = event.candidate.candidate.match(ipRegex);
//         if (ipMatch) {
//           leakedIPs.add(ipMatch[1]);
//         }
//       } else {
//         // All ICE candidates received
//         const publicIP = await fetch("https://api.ipify.org?format=json")
//           .then(res => res.json())
//           .then(data => data.ip);
  
//         console.log("Public IP (via API):", publicIP);
//         console.log("Leaked IPs (via WebRTC):", Array.from(leakedIPs));
  
//         const isVPN = !leakedIPs.has(publicIP);
//         vppn=isVPN
  
//       }
//     };
//     return vppn
    
//   }

    window.onload=collectUserDetails()






// export function encodeToBase64(data) {
//     const jsonString = JSON.stringify(data);
//     return btoa(unescape(encodeURIComponent(jsonString)));
// }

