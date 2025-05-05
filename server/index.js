import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']


});

fastify.addHook('onSend', (request, reply, payload, done) => {
    console.log('Response headers:', reply.getHeaders());
    done();
});

fastify.get('/', (req, res) => {

    res.send('in house web sdk.');
});

fastify.post('/details', (req, res) => {
    let data = req.body
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('Request body:', req.body, {ip});
    try {
        res.send(data);
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
});

fastify.listen({ port: 5000 }, (err) => {
    if (err) {
        console.error('Server error:', err);
        process.exit(1);
    }
    console.log('Server running on port 5000');
});
