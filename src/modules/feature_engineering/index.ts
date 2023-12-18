import { featureEngineeringProps } from './types'
import { applyInteractionWeights } from './apply_weights'
import objectToCSV from '../../middlewares/obj_to_csv'

export function Feature_Engineering({
    userInteractions
}: featureEngineeringProps) {

    const matrix = userInteractions.map((i, index) => {
        return applyInteractionWeights({ interactions: i.interaction})
    })
    return matrix
}

