import { InteractionQueueProps } from "./types";

interface Tag { id: number, name: string }

const MAX_DURATION = 60 * 1000 // 60 seconds

function encodeContentType(type: string): number[]{
    const types = ["IMAGE", "VIDEO"] // Lista de tipos de conteúdo
    const encoded = Array(types.length).fill(0) // Vetor de zeros inicial
    const index = types.indexOf(type) // Índice do tipo de conteúdo
    if (index !== -1) encoded[index] = 1 // Define o índice correspondente como 1
    return encoded;    
}

function normalizeDuration(duration: number): number {
    if(duration == 0) return 1
    else return duration / MAX_DURATION
}

function encodeLanguage(language: string): number[] {
    const languages = ["pt-br", "en-us", "es-es"] // Lista de idiomas
    const encoded = Array(languages.length).fill(0) // Vetor de zeros inicial
    const index = languages.indexOf(language) // Índice do idioma
    if (index !== -1) encoded[index] = 1 // Define o índice correspondente como 1
    return encoded;
}

function normalizeWatchTime(watchTime: number, duration: number): number {
    if(duration == 0) return watchTime
    else return watchTime / duration
}


export async function pre_processing (i: InteractionQueueProps){
    const tags: Tag[] = []
    await i.data.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => { tags.push(tag) })
        }
    })

    const processed_interactions = i.data.map((item) => {
        return {
            id: item.id,
            user_id: item.user_id,
            encode_content_type: encodeContentType(item.type),
            normalized_duration: normalizeDuration(item.duration),
            encoded_language: encodeLanguage(item.language),
            tags: item.tags.map((item) => {return item.id}),
            interaction: {
                like:item.interaction.like? 1: 0,
                share: item.interaction.share? 1: 0,
                click_into_moment: item.interaction.click_into_moment? 1: 0,
                watch_time: normalizeWatchTime(item.interaction.watch_time, item.duration),
                click_profile: item.interaction.click_profile? 1: 0,
                comment: item.interaction.comment? 1: 0,
                like_comment: item.interaction.like_comment? 1: 0,
                pass_to_next: item.interaction.pass_to_next? 1: 0,
                show_less_often: item.interaction.show_less_often? 1: 0,
                report: item.interaction.report? 1: 0
            }
        }
    })

    function calculeTagVector(tags: Tag[]): { tfidf: number, id: number }[] {
        const tagData: { [key: string]: { id: number, tf: number } } = {}
        tags.forEach((tag) => {
            if (!(tag.name in tagData)) tagData[tag.name] = { id: tag.id, tf: 0 }
            tagData[tag.name].tf++
        })
        return Object.keys(tagData).map(tagName => {
            const { id, tf } = tagData[tagName]
            const tagCount = tags.filter(t => t.name === tagName).length
            const tfidf = (tf / tags.length) * Math.log(tags.length / tagCount)
            return { tfidf, id }
        })
    }
    return {
        user_id: i.user_id,
        tags_vector: calculeTagVector(tags),
        processed_interactions, 
        moment_tags_ids_vector: processed_interactions.map((i) => {return {id: i.id, tags: i.tags.map((t) => {return {id: t}})}})
    }
}