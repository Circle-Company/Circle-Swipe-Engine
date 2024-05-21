import Interaction from '../../models/moments/moment_interaction-model.js'
import { InteractionQueueProps } from "../types"

type NegativeContentAlgorithmProps = {
    users_similarity: Array<Array<number>>
    interaction_queue: InteractionQueueProps
}

export default async function negative_content_algorithm({
    users_similarity, interaction_queue
}: NegativeContentAlgorithmProps): Promise<any> {
    // Ajustar o índice para zero-based
    const zeroIndex = interaction_queue.user_id - 1

    // Obter a linha de similaridade para o usuário especificado
    const userSimilarities = users_similarity[zeroIndex]

    // Criar uma lista de pares (usuário, similaridade), excluindo a similaridade do usuário consigo mesmo
    const similarUsers = userSimilarities
        .map((similarity, index) => ({ user_id: index + 1, similarity })) // Ajustar o índice para começar em 1
        .filter(pair => pair.user_id !== interaction_queue.user_id) // Excluir a similaridade do usuário consigo mesmo

    // Ordenar a lista pela similaridade em ordem decrescente
    similarUsers.sort((a, b) => b.similarity - a.similarity)

    const similarUsersInteractions = await Promise.all(
        similarUsers.map(async(user) => {
            return await Interaction.findAll({
                where: { user_id: user.user_id },
                attributes: ['negative_interaction_rate', 'user_id', 'moment_id']
            })
        })
    )

    const allInteractions = similarUsersInteractions.flat()

    // Agrupar as interações por user_id e moment_id
    const interactionMap: { [key: string]: { total: number; count: number } } = {}

    allInteractions.forEach((interaction) => {
        const key = `${interaction.user_id}-${interaction.moment_id}`
        if (!interactionMap[key]) interactionMap[key] = { total: 0, count: 0 }
        interactionMap[key].total += interaction.negative_interaction_rate
        interactionMap[key].count += 1
    });

    // Calcular a média das interações
    const averagedInteractions = Object.entries(interactionMap).map(([key, value]) => {
        const [user_id, moment_id] = key.split('-').map(Number)
        return {
            user_id,
            moment_id,
            negative_interaction_rate_average: value.total / value.count,
        }
    })

    // Agrupar por moment_id e adicionar similaridade
    const groupedByMomentId: { [key: number]: { user_id: number, negative_interaction_rate_average: number, similarity: number }[] } = {}

    averagedInteractions.forEach(interaction => {
        const { moment_id, user_id, negative_interaction_rate_average } = interaction
        if (!groupedByMomentId[moment_id]) groupedByMomentId[moment_id] = []
        const user_similarity = similarUsers.find(item => item.user_id === user_id)?.similarity || 0
        groupedByMomentId[moment_id].push({ user_id, negative_interaction_rate_average, similarity: user_similarity })
    })

    // Transformar em um array de GroupedInteractions
    const momentsInteractions = Object.entries(groupedByMomentId).map(([moment_id, interactions]) => ({
        moment_id: Number(moment_id),
        interactions
    }));

    // Ordenar pelo moment_id
    momentsInteractions.sort((a, b) => a.moment_id - b.moment_id)

    /**
       multiplicar a similaridade pela negative_interaction_rate_average para ser o score
       score = similarity * negative_interaction_rate_average
    */
    const scoredMoments = momentsInteractions.map((moment) => {
        const scores = moment.interactions.map((interaction) => {
            return interaction.similarity * interaction.negative_interaction_rate_average
        })
        const score = scores.reduce((acc, val) => acc + val, 0) / scores.length
        return { moment_id: moment.moment_id, score }
    })

    //retornar o Id do moment com o maior score
    const momentIdWithHighestScore = scoredMoments.reduce((max, moment) => {
        return (moment.score > max.score) ? moment : max
    }).moment_id

    return momentIdWithHighestScore
}
