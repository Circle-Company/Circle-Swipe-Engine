import { InteractionProps, actionWeightsProps } from './types'
import sigmoid from '../../math/sigmoid'

type ApplyInteractionWeightsProps = {
    interactions: InteractionProps
}

export function applyInteractionWeights({
    interactions
}: ApplyInteractionWeightsProps){
    const actionWeightsData = require('../../database/action_weights.json')
    const actionWeights: actionWeightsProps = actionWeightsData

    const like = booleanToNumber(interactions.like) * actionWeights.like.weight
    const share = booleanToNumber(interactions.share) * actionWeights.share.weight
    const click_into_moment = booleanToNumber(interactions.click_into_moment) * actionWeights.click_into_moment.weight
    const watch_time =  interactions.watch_time * actionWeights.watch_time.weight
    const click_profile = booleanToNumber(interactions.click_profile) * actionWeights.click_profile.weight
    const comment = booleanToNumber(interactions.comment) * actionWeights.comment.weight
    const like_comment = booleanToNumber(interactions.like_comment) * actionWeights.like_comment.weight
    const pass_to_next = booleanToNumber(interactions.pass_to_next) * actionWeights.pass_to_next.weight
    const show_less_often = booleanToNumber(interactions.show_less_often) * actionWeights.show_less_often.weight
    const report = booleanToNumber(interactions.report) * actionWeights.report.weight

    return {
        like,
        share,
        click_into_moment,
        watch_time,
        click_profile,
        comment,
        like_comment,
        pass_to_next,
        show_less_often,
        report
    }
}

function booleanToNumber(value: boolean): number {
    return value ? 1 : 0
}