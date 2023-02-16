import * as dotenv from 'dotenv'
import express, { Application, Request, Response } from 'express';
import { startSolisData } from './solisData.js'
import { shared } from './shared.js';


dotenv.config()
const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Power World!');
});

app.get('/latest', (req: Request, res: Response) => {
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
}

main();
