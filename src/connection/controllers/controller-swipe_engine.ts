import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {Modules_Controller} from '../../modules/modules-controller'
import MomentInteraction from '../../models/moments/moment_interaction-model.js'
import { InternalServerError } from '../../errors'
import { normalizeWatchTime } from '../../modules/pre-processing'
import { calcule_one_negative_interaction_rate, calcule_one_positive_interaction_rate, positive_interaction_rate } from '../../modules/positive_interaction_rate'


export async function getMoments(req:Request, res:Response){
    const data = await Modules_Controller(req.body)
    return res.status(StatusCodes.ACCEPTED).json(data)
}

export async function storeMomentInteraction(req: Request, res: Response){
    const {user_id, moment_owner_id, moment_id, interaction} = req.body
    try{
        console.log(interaction)

        const processed_interaction = {
            like:interaction.like? 1: 0,
            share: interaction.share? 1: 0,
            click_into_moment: interaction.click_into_moment? 1: 0,
            watch_time: normalizeWatchTime(interaction.watch_time, 0) /1000,
            click_profile: interaction.click_profile? 1: 0,
            comment: interaction.comment? 1: 0,
            like_comment: interaction.like_comment? 1: 0,
            pass_to_next: interaction.pass_to_next? 1: 0,
            show_less_often: interaction.show_less_often? 1: 0,
            report: interaction.report? 1: 0
        }
        const stored_interaction = await MomentInteraction.create({
            user_id,
            moment_owner_id,
            moment_id,
            ...interaction,
            negative_interaction_rate: calcule_one_negative_interaction_rate(processed_interaction),
            positive_interaction_rate: calcule_one_positive_interaction_rate(processed_interaction),
            created_at: new Date(),
            updated_at: new Date()
        })
        res.json(stored_interaction).send()
    } catch(err: any) {
        throw new InternalServerError({ message: err.message})
    }
}

export const SwipeEngine = {
    getMoments,
    storeMomentInteraction
}