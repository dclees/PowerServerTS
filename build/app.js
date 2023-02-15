import express from 'express';
import { startSolisData } from './solisData.js';
import { shared } from './shared.js';
const app = express();
const port = 3000;
app.get('/latest', (req, res) => {
    res.json(shared.latestPowerData);
});
app.get("*", (req, res) => {
    res.status(404).send('Page Not Found');
});
const main = () => {
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
        startSolisData();
    });
};
console.log('Starting solis node app');
main();
