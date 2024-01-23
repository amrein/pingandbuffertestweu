const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ping', (req, res) => {
    // Set headers to prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');

    const clientTime = new Date(req.body.clientTime).getTime();
    const serverTime = new Date().getTime();
    const timeDifference = serverTime - clientTime;

    // Get client's IP address
    // Note: 'x-forwarded-for' is used if behind a proxy like in many cloud environments
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`Client IP: ${clientIP}, Time Difference: ${timeDifference}ms`);

    const randomData = generateRandomData(128); // Generate 128 bytes of of random data
    res.json({ serverTime: new Date().toISOString(), data: randomData });
});

function generateRandomData(size) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let data = new Array(size);
    for (let i = 0; i < size; i++) {
        data[i] = characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return data.join('');
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
