const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ping', (req, res) => {
    const clientTime = req.body.clientTime;
    console.log("Received Client Time:", clientTime);

    const serverTime = new Date().toISOString();
    res.json({ serverTime });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
