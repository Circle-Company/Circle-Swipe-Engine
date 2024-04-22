import sigmoid from "../math/sigmoid";
const interactionWeights = require('../data/action_weights.json')
export async function interaction_rate(processed_interactions : any) {
    const interactions_vector = processed_interactions.processed_interactions.map(interaction => {
        let totalInteractions = 0
        Object.keys(interaction.interaction).forEach(action => {
            if (interaction.interaction[action]) {
                totalInteractions += interactionWeights[action].weight || 0;
            }
        })
        return {
            moment_id: interaction.id,
            moment_owner_id: interaction.user_id,
            interaction_rate: totalInteractions / 10
        }
    })
    return {
        user_id: processed_interactions.user_id,
        tags_vector: processed_interactions.tags_vector,
        interations_vector: interactions_vector,
        
    }
}

export function calcule_one_interaction_rate(processed_interaction: any): number{
    const interaction_with_weights = {
        like:processed_interaction.like * interactionWeights.like.weight,
        share: processed_interaction.share * interactionWeights.share.weight,
        click_into_moment: processed_interaction.click_into_moment * interactionWeights.click_into_moment.weight,
        watch_time: processed_interaction.watch_time * interactionWeights.watch_time.weight,
        click_profile: processed_interaction.click_profile * interactionWeights.click_profile.weight,
        comment: processed_interaction.comment * interactionWeights.comment.weight,
        like_comment: processed_interaction.like_comment * interactionWeights.like_comment.weight,
        pass_to_next: processed_interaction.pass_to_next * interactionWeights.pass_to_next.weight,
        show_less_often: processed_interaction.show_less_often * interactionWeights.show_less_often.weight,
        report: processed_interaction.report * interactionWeights.report.weight
    }

    let total: number[] = [];
    Object.keys(interaction_with_weights).forEach(action => {
        total.push(interaction_with_weights[action]);
    })
    return Number(sigmoid(total.reduce((acc, cur) => acc + cur, 0)/10))
}