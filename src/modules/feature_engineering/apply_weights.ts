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

    const like = Number( sigmoid( booleanToNumber(interactions.like) * actionWeights.like.weight ).toFixed(4))
    const share = Number(sigmoid( booleanToNumber(interactions.share) * actionWeights.share.weight ).toFixed(4))
    const click_into_moment = Number(sigmoid( booleanToNumber(interactions.click_into_moment) * actionWeights.click_into_moment.weight ).toFixed(4))
    const watch_time =  Number(sigmoid( interactions.watch_time * actionWeights.watch_time.weight ).toFixed(4))
    const click_profile = Number(sigmoid( booleanToNumber(interactions.click_profile) * actionWeights.click_profile.weight ).toFixed(4))
    const comment = Number(sigmoid( booleanToNumber(interactions.comment) * actionWeights.comment.weight ).toFixed(4))
    const like_comment = Number(sigmoid( booleanToNumber(interactions.like_comment) * actionWeights.like_comment.weight ).toFixed(4))
    const pass_to_next = Number(sigmoid( booleanToNumber(interactions.pass_to_next) * actionWeights.pass_to_next.weight ).toFixed(4))
    const show_less_often = Number(sigmoid( booleanToNumber(interactions.show_less_often) * actionWeights.show_less_often.weight ).toFixed(4))
    const report = Number(sigmoid( booleanToNumber(interactions.report) * actionWeights.report.weight ).toFixed(4))

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