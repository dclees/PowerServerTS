import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';
import { LatestPowerData, shared } from "./shared.js";


const months: string[] = [

    '', 'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'June', 'July', 'Aug',
    'Sept', 'Oct', 'Nov', 'Dec'
];


export class dbMongo {

    dbClient: MongoClient | null = null;
    dbDataBase: Db | null = null;
    dbCollection: Collection | null = null;
    dbCollectionName: string = '--unnamed--';
    dbWriteCount: number = 0;

    constructor() {
        // console.log('dbWriter constructor');
    }

    recreateClient = (collectionName: string) => {

        if (this.dbClient != null) {
            this.dbClient.close();
            this.dbClient, this.dbDataBase, this.dbCollection = null, null, null;
        }
        const username = shared.dbUsername;
        const password = shared.dbPassword;
        const uri = `mongodb+srv://${username}:${password}@cluster0.blobuxb.mongodb.net/?retryWrites=true&w=majority`;

        const options = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }
        this.dbClient = new MongoClient(uri, options);
        this.dbDataBase = this.dbClient.db('Power');
        this.dbCollection = this.dbDataBase.collection(collectionName);
        this.dbCollectionName = collectionName;
    }

    write = async (doc: LatestPowerData) => {

        const collectionName = `${doc.year}${months[doc.month]}`;
        if ((this.dbClient === null) ||             // if we don't have a db client
            (this.dbWriteCount > (2 * 60)) ||       // every hour approx.
            (collectionName !== this.dbCollectionName)) { // if we change month (and therefor year)

            console.log('Recreating dbClient');
            this.recreateClient(collectionName);
            this.dbWriteCount = 0;
            console.log('dbClient created');
        }

        // console.warn(`DB: ${collectionName}:`, JSON.stringify(doc));
        const res = await this.dbCollection?.insertOne(doc);
        // console.log('db result:', res);

        this.dbWriteCount += 1;
    }
}








const testFunc = () => {
    // Replace the uri string with your MongoDB deployment's connection string.
    const username = 'writeonlyuser';
    const password = 'HzEbd7oD5ASPDc3M';
    const uri = `mongodb+srv://${username}:${password}@cluster0.blobuxb.mongodb.net/?retryWrites=true&w=majority`;
    console.log('uri:', uri);
    const client = new MongoClient(uri);

    interface Haiku {
        title: string;
        content: string;
    }

    async function run() {
        try {
            const database = client.db("Power");
            // Specifying a Schema is optional, but it enables type hints on
            // finds and inserts
            const haiku = database.collection<Haiku>("haiku");
            const result = await haiku.insertOne({
                title: "Record of a Shriveled Datum",
                content: "No bytes, no problem. Just insert a document, in MongoDB",
            });
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
}
// testFunc();
