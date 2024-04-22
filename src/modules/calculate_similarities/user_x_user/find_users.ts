import User from '../../../models/user/user-model.js'
import MomentInteraction from '../../../models/moments/moment_interaction-model.js'
import { cosineSimilarity } from '../../../math/cossineSimilarity'

export default async function findUsers() {
    const usersData = await MomentInteraction.findAll({
        attributes: ['moment_id', 'user_id', 'interaction_rate']
    })
    // Encontre o número total de usuários e momentos
    const moments = [...new Set(usersData.map(user => user.moment_id))];
    const users = [...new Set(usersData.map(user => user.user_id))];

    // Crie uma matriz vazia com as dimensões adequadas
    const formattedMatrix = Array(users.length).fill(0).map(() => Array(moments.length).fill(undefined));

    // Preencha a matriz com os interaction rates correspondentes
    usersData.forEach(({ user_id, moment_id, interaction_rate }) => {
        const userIndex = users.indexOf(user_id);
        const momentIndex = moments.indexOf(moment_id);
        formattedMatrix[userIndex][momentIndex] = interaction_rate;
    });

    console.log(moments, users, formattedMatrix)

    const similarityMatrix: any = [];
    for (let i = 0; i < formattedMatrix.length; i++) {
        const row: any = [];
        for (let j = 0; j < formattedMatrix.length; j++) {
            const similarity = cosineSimilarity(formattedMatrix[i], formattedMatrix[j]);
            row.push(similarity);
        }
        similarityMatrix.push(row);
    }
    return {formattedMatrix, similarityMatrix};
}