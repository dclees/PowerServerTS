import * as dotenv from 'dotenv'
import express, { Application, Request, Response } from 'express';
import { startSolisData } from './solisData'
import { shared } from './shared';


dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3000;
shared.dbUsername = process.env.DB_USER;
shared.dbPassword = process.env.DB_PASSWORD;
// console.log(`Port: ${port}, User: ${shared.dbUsername}, pwd: ${shared.dbPassword}`);

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
