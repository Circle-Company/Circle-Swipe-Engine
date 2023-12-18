import { StatusCodes } from 'http-status-codes';
import {Modules_Controller} from '../../modules/modules-controller'

export function getMoments(req:any, res:any) {
    const data = Modules_Controller(req.body)
    
    return res.status(StatusCodes.ACCEPTED).json(data)
}

export const SwipeEngine = {
    getMoments: getMoments
}