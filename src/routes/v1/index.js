import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardRoutes } from './boardRoutes.js';
import { columnRoutes } from './columnRoutes.js';
import { cardRoutes } from './cardRoutes.js';
const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({
        status: 'OK',
        message: 'API v1 is running',
    });
} );


Router.use('/boards', boardRoutes);

Router.use('/columns', columnRoutes);

Router.use('/cards', cardRoutes);
export const APIs_V1 = Router; 