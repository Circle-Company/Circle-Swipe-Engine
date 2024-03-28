import { pre_processing } from './pre-processing'
import { interaction_rate } from './interaction_rate'
import { InteractionQueueProps } from './types'
import { calculeTagsWeight } from './tags_weight'

type ModuleControllerProps = {
    interaction_queue: InteractionQueueProps
}
export async function Modules_Controller({interaction_queue}:ModuleControllerProps) {
    const processed_interactions = await pre_processing(interaction_queue)
    const aditional_features = await interaction_rate(processed_interactions)
    const tags_with_weights = await calculeTagsWeight(processed_interactions, aditional_features)
    return tags_with_weights
}