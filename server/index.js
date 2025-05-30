import Fastify from "fastify";
import cors from '@fastify/cors';
import { UAParser } from "ua-parser-js";
import os from 'os';
import path, { dirname } from "path";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";

const fastify = Fastify({ logger: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
})


fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
});



const getIpDetails = async (req) => {

    // const myIp = await fetch('https://api.ipify.org?format=json');
    // const { ip } = await myIp.json();
    // console.log(ip)

    const ip=getUserIp(req)

    const res = await fetch(`https://proxycheck.io/v2/${ip}?vpn=1&asn=1`);
    let ipD = await res.json()
    // return ipD
    if (ipD[ip].type === "VPN") return { ...ipD, vpn: true, ipAddress: ip }
    return { ...ipD, vpn: false, ipAddress: ip }
}

fastify.get('/', (_, res) => {
    res.sendFile('index.html')
})

fastify.get('/ip', async (req, res) => {

    const ip = getUserIp(req)
    res.status(200).send({ ip });

})


fastify.post('/details', async (req, res) => {
    const { browserInfo, deviceInfo, madeDetails } = req.body;
    const sessionId = Date.now().toString()


    const ua = UAParser(browserInfo.userAgent);

    let ipDetails = await getIpDetails(req);

    deviceInfo.vendor = ua.device.vendor || null;
    deviceInfo.model = ua.device.model || null;
    deviceInfo.osName = ua.os.name || null;
    deviceInfo.osVersion = ua.os.version || null;

    browserInfo.browserName = ua.browser.name || null;
    browserInfo.browserVersion = ua.browser.version || null;

    Object.assign(madeDetails, {
        browser: ua.browser.name || null,
        manufacturer: ua.device.vendor || null,
        os: ua.os.name || null,
        osVersion: ua.os.version || null,
        cpuArchitecture: os.arch(),
        userAgent: ua.ua,
    });



    const webSdkData = {
        ...req.body,
        url : `${req.protocol}://${req.hostname}${req.originalUrl}`,

        ipDetails,
        sessionId
    }
    console.log(webSdkData)


    try {
        res.send({ sessionId,webSdkData });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
})


// fastify.get('/get-web-sdk-data/:sessionId', async (req, res) => {
//     const { sessionId } = req.params;
//     const data = await redis.get(sessionId);
//     if (!data) return res.status(404).send({ error: "Session not found" });

//     res.send(JSON.parse(data));
// })


const getUserIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    return ip
}

fastify.listen({ port: 5000 }, (err) => {
    if (err) {
        process.exit(1);
    }
    console.log('Server running on http://localhost:5000');
})