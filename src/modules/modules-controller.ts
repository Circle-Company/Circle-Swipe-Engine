import { pre_processing } from './pre-processing'
import { positive_interaction_rate } from './positive_interaction_rate'
import { InteractionQueueProps } from './types' 
import { calculeTagsWeight } from './tags_weight'
import calculate_similarities from './calculate_similarities'

type ModuleControllerProps = { 
    interaction_queue: InteractionQueueProps
}
export async function Modules_Controller({interaction_queue}:ModuleControllerProps) {
    const calculated_similarities = await calculate_similarities()
    const processed_interactions = await pre_processing(interaction_queue)
    const aditional_features = await positive_interaction_rate(processed_interactions)
    const tags_with_weights = await calculeTagsWeight(processed_interactions, aditional_features)
    return {calculated_similarities, processed_interactions, aditional_features, tags_with_weights}
}