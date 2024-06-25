import MomentInteraction from '../models/moments/moment_interaction-model.js'

import { pre_processing } from './pre-processing'
import { positive_interaction_rate } from './positive_interaction_rate'
import { InteractionQueueProps } from './types' 
import { calculeTagsWeight } from './tags_weight'
import calculate_similarities from './calculate_similarities'
import interaction_tags_algorithm from './interaction_tags_algorithm'
import negative_content_algorithm from './negative_content_algorithm'
import cold_start_algorithm from './cold_start'
import { InteractedMomentsIdsList } from './interacted_moments_ids_list'
import { AleatoryMomentFinder } from './aleatory_moment_finder'

type ModuleControllerProps = { 
    interaction_queue: InteractionQueueProps
}
export async function Modules_Controller({interaction_queue}:ModuleControllerProps) {
    let coldStartMode: boolean
    let userHasInteractions: boolean

    if(interaction_queue.data) {
        if(interaction_queue.data.length > 0) {
            await Promise.all(interaction_queue.data.map(async (item: any) => {
                const interaction: any = item.interaction
                const processed_interaction = {
                    like: Number(interaction.liked),
                    share: Number(interaction.shared),
                    click_into_moment: Number(interaction.clickIntoMoment),
                    watch_time: normalizeWatchTime(interaction.watchTime, 0) /1000,
                    click_profile: Number(interaction.clickProfile),
                    comment: Number(interaction.commented),
                    like_comment: Number(interaction.likeComment),
                    pass_to_next: Number(interaction.skipped),
                    show_less_often: Number(interaction.showLessOften),
                    report: Number(interaction.reported)
                }
                const negative_interaction_rate = calcule_one_negative_interaction_rate(processed_interaction)
                const positive_interaction_rate = calcule_one_positive_interaction_rate(processed_interaction)

                console.log(negative_interaction_rate, positive_interaction_rate)
                await MomentInteraction.create({
                    user_id: interaction_queue.user_id,
                    moment_owner_id: item.userId,
                    moment_id: item.id,
                    like: interaction.liked,
                    share: interaction.shared,
                    click_into_moment: interaction.clickIntoMoment,
                    watch_time: normalizeWatchTime(interaction.watchTime, 0) /1000,
                    click_profile: interaction.clickProfile,
                    comment: interaction.commented,
                    like_comment: interaction.likeComment,
                    pass_to_next: interaction.skipped,
                    show_less_often: interaction.showLessOften,
                    report: interaction.reported,
                    negative_interaction_rate: calcule_one_negative_interaction_rate(processed_interaction),
                    positive_interaction_rate: calcule_one_positive_interaction_rate(processed_interaction),
                    created_at: new Date(),
                    updated_at: new Date()
                })                
            }))

            coldStartMode = false
            userHasInteractions = true
        } else {
            const userInteractions = await MomentInteraction.findOne({
                where: {user_id: interaction_queue.user_id},
            })
            if(userInteractions) {userHasInteractions = true; coldStartMode = false}
            else {userHasInteractions = false; coldStartMode = true}      
        }
    }
    else { coldStartMode = true, userHasInteractions = false }

    if(coldStartMode) return await cold_start_algorithm()
    else {
        const interacted_moments_list = await InteractedMomentsIdsList({user_id: interaction_queue.user_id})
        const calculated_similarities = await calculate_similarities()
        const processed_interactions = await pre_processing(interaction_queue)
        const aditional_features = await positive_interaction_rate(processed_interactions)
        const tags_with_weights = await calculeTagsWeight(processed_interactions, aditional_features)
        const posts_from_tags = await interaction_tags_algorithm({
            tags_with_weights,
            users_similarity: calculated_similarities.users_similarity,
            interaction_queue,
            interacted_moments_list
        })
        const negative_post = await negative_content_algorithm({
            users_similarity: calculated_similarities.users_similarity,
            interaction_queue,
            interacted_moments_list
        })

        const returnMomentsList = [posts_from_tags, negative_post].filter(item => item !== null)

        return await AleatoryMomentFinder({quantity: 10, interacted_moments_list})
        //else return returnMomentsList
    }
}