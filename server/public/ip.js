export const getIpDetails = async () => {

  const myIp = await fetch('https://api.ipify.org?format=json');
  const { ip } = await myIp.json();

  const res = await fetch(`https://proxycheck.io/v2/${ip}?vpn=1&asn=1`);
  let ipD = await res.json()
  // return ipD
  if (ipD[ip].type == "Business") return { ...ipD, vpn: false, ipAddress: ip }
  return { ...ipD, vpn: true, ipAddress: ip }
}