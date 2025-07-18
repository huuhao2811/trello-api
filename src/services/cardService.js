import { cardModel } from "~/models/cardModel.js";
import { columnModel } from "~/models/columnModel.js";
const createNew = async (reqBody) => {
    try {
        const newCard = {
            ...reqBody
        }
        const createdCard = await cardModel.createNew(newCard);
        const getNewCard = await cardModel.findOnebyId(createdCard.insertedId);
        if(getNewCard){
            await columnModel.pushCardOrderIds(getNewCard)
        }
        return getNewCard;
    } catch (error) {
        throw error
    }
}

export const cardService = {
    createNew
}