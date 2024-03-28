export interface GenerateRecommendationsProps {
    interaction_queue: InteractionQueueProps
}

export interface InteractionQueueProps {
    [x: string]: any
    user_id: number,
    length: number,
    period: number,
    data: MomentInteractionProps[]
}

export interface MomentInteractionProps {
    id: number,
    user_id: number,
    tags: TagsProps[],
    duration: number,
    type: "IMAGE" | "VIDEO",
    language: "pt-br" | "en",
    interaction: InteractionProps
}

interface InteractionProps {
    like: boolean,
    share: boolean,
    click_into_moment: boolean,
    watch_time: number,
    click_profile: boolean,
    comment: boolean,
    like_comment: boolean,
    pass_to_next: boolean,
    show_less_often: boolean,
    report: boolean
}

export interface TagsProps {
    id: number,
    name: string
}