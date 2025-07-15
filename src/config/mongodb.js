import { env } from '~/config/environment.js'

import { MongoClient, ServerApiVersion } from 'mongodb'
const MONGODB_URI = 'mongodb+srv://haonguyenhuu2811:HUUhao2811@cluster0.asi0e6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
console.log(MONGODB_URI)
let trelloDatabase = null;

const mongoClientInsatance = new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
    }
);

export const CONNECT_DB = async () => {
    await mongoClientInsatance.connect()

    trelloDatabase = mongoClientInsatance.db(env.DATABASE_NAME);
}

export const CLOSE_DB = async () => {
    await mongoClientInsatance.close();
}

export const GET_DB = () => {
    if (!trelloDatabase) {
        throw new Error('Database not connected');
    }
    return trelloDatabase;
}