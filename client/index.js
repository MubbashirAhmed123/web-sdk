console.log('in house SDK');

const getBrowserInfo = () => {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        touchSupport: 'ontouchstart' in window,
        cookiesEnabled: navigator.cookieEnabled,
    };
};

const successCb = async (details) => {
    console.log('Geolocation success:', details);
    const latitude = details.coords.latitude
    const longitude = details.coords.longitude

    const cityAndRegion = await fetch(`https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    const result = await cityAndRegion.json()
    console.log(result)



    return {
        latitude,
        longitude,
        city: result.locality,
        state: result.principalSubdivision,
        countryName: result.countryName,
        countryCode: result.countryCode,
    };
};

const errorCb = (err) => {
    console.log('Geolocation error:', err);
    return { latitude: null, longitude: null };
};



const getIpDetails=async()=>{
   const res=await fetch('https://api.ipify.org?format=json')
   const result=await res.json()
   console.log(result)

   const res2=await fetch(`https://ipapi.co/${result.ip}/json`)
   const result2=await res2.json()
   console.log(result2)
   return {
    ip:result2.ip,
    organization:result2.org,
    latitude:result2.latitude,
    longitude:result2.longitude,
    city:result2.city,
    region:result2.region,
    countryName:result2.country_name
   }
   

}
getIpDetails()

const getData = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const locationDetails = await successCb(position);

        const browserInfo = getBrowserInfo();

        const ipDetails=await getIpDetails()

        const res = await fetch('http://localhost:5000/details', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                browserInfo,
                locationDetails,
                ipDetails
            }),
        });

        const result = await res.json();
        console.log(result);
    } catch (error) {
        console.log('Some error occurred:', error);
    }
};

getData();
