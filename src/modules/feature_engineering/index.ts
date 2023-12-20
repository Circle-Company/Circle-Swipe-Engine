import { featureEngineeringProps } from './types'
import { applyInteractionWeights } from './apply_weights'
import objectToCSV from '../../middlewares/obj_to_csv'
import syntacticAnalyser from './syntactic_analyser'

export function Feature_Engineering({
    userInteractions,
}: featureEngineeringProps) {

    const matrix = userInteractions.map((i, index) => {

        const interaction = applyInteractionWeights({ interactions: i.interaction})

        const tags = i.informations.tags.map((tag, index) => {
            return syntacticAnalyser({word: tag})
        })

        return {
            interaction,
            informations: {
                tags: tags,
                duration: i.informations.duration,
                type: i.informations.type == "video"? 1 : 0,
                language : i.informations.language == 'en'? 0 : 1,
                country: i.informations.country == 'US'? 0 : 1

            }
        }
    })
    return matrix
}

