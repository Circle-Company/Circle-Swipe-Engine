export async function interaction_rate(processed_interactions : any) {
    const interactionWeights = require('../database/action_weights.json')
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