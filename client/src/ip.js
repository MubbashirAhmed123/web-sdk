export const getIpDetails = async () => {
    try {
      const res = await fetch('http://ipwho.is/');
      const { ip } = await res.json();
      console.log(ip)
  
      const res2 = await fetch(`https://api.ip2location.io/?key=CECC9F476D3B059724D173177CAE189A&ip=${ip}&format=json`);
      console.log(res2)
      const data = await res2.json();
  
      return {
        ip: data.ip,
        organization: data.org,
        city: data.city,
        region: data.region,
        countryName: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
        isProxy: data.is_proxy,
      };
    } catch (err) {
      console.log('IP', err);
      return null;
    }
  };