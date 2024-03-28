import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {Modules_Controller} from '../../modules/modules-controller'

export async function getMoments(req:Request, res:Response) {
    const data = await Modules_Controller(req.body)
    return res.status(StatusCodes.ACCEPTED).json(data)
}

export const SwipeEngine = {
    getMoments: getMoments
}