import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError.js';
import { cardService } from '~/services/cardService.js';

const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdCard);
    } catch (error) {
        next(error);

    }

}


export const cardController = {
    createNew
}