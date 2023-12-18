export type userInteractionProps = Array <userInteractionObject> 

export type userInteractionObject = {
    moment_id: number
    user_id: number,
    interaction: InteractionProps,
    informations: InformationsProps
}

export type InteractionProps = {
    like: boolean,
    share: boolean,
    click_into_moment: boolean,
    watch_time: number,
    click_profile: boolean,
    comment: boolean,
    like_comment: boolean,
    pass_to_next: boolean,
    show_less_often:boolean,
    report: boolean
}

export type InformationsProps = {
    tags: string[]
    duration: number
    type: string
    language: string
    country: string    
}

export type featureEngineeringProps = {
    userInteractions: userInteractionProps
}

export type actionWeightsProps = {
    like: {
        sentiment: string,
        weight: number
    },
    share: {
        sentiment: string,
        weight: number
    },
    click_into_moment: {
        sentiment: string,
        weight: number
    },
    watch_time: {
        sentiment: string,
        weight: number
    },
    click_profile: {
        sentiment: string,
        weight: number
    },
    comment: {
        sentiment: string,
        weight: number
    },
    like_comment: {
        sentiment: string,
        weight: number
    },
    pass_to_next: {
        sentiment: string,
        weight: number
    },
    show_less_often: {
        sentiment: string,
        weight: number
    },
    report: {
        sentiment: string,
        weight: number
    }
}