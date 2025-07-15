import express from 'express';
import asyncExitHook from 'async-exit-hook';
import{CONNECT_DB, GET_DB, CLOSE_DB} from './config/mongodb.js';
import { env } from './config/environment.js';
import { APIs_V1 } from './routes/v1/index.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import cors from 'cors'
import {corsOptions} from './config/cors.js'
const START_SERVER = () => {
    const app = express();
    app.use(cors(corsOptions))
    // enable req.body json data
    app.use(express.json());


    app.use('/v1', APIs_V1);

    app.use(errorHandlingMiddleware);
    if(env.BUILD_MODE === 'production'){
        app.listen(process.env.PORT, () => {
            console.log(`Production: Server running at:${process.env.PORT}/`);
            console.log(`Author: ${env.AUTHOR}`);
        } );  
    }   else {
        app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
            console.log(`Server running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`);
            console.log(`Author: ${env.AUTHOR}`);
        } );
    }

    asyncExitHook(() => {
        console.log('Closing MongoDB connection...');
        CLOSE_DB()
        console.log('MongoDB connection closed');
    })
}   

(async () => {
    try {
        console.log('Connecting to MongoDB...');
        await CONNECT_DB();
        console.log('Connected to MongoDB');
        START_SERVER();
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(0);
    }
}   )();



// CONNECT_DB().then(() => {
//     console.log('Connected to MongoDB');
// }).then(() => {
//     START_SERVER();
// }).catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(0);
// });
