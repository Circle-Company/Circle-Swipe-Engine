type EngagementEmbeddingProps = {
    statistics: {
        likes: number;
        shares: number;
        clicksIntoMoment: number;
        watchTime: number; // miliseconds
        clicksProfile: number;
        comments: number;
        views: number;
        skips: number;
        showLessOften: number;
        report: number;
    };
    metadata: {
        totalDuration: number; // miliseconds
        createdAt: string;
    };
};

// Função para calcular o embedding de engajamento com normalização por log e watch time baseado na duração total do post
export function getEngagementEmbedding({
    statistics,
    metadata,
}: EngagementEmbeddingProps) {
    const {
        likes,
        shares,
        clicksIntoMoment,
        watchTime,
        clicksProfile,
        comments,
        views,
        skips,
        showLessOften,
        report,
    } = statistics;

    const { totalDuration } = metadata;

    // Normalizando com logaritmo natural (log base e)
    const normalizedLikes = Math.log1p(likes); // log(likes + 1)
    const normalizedShares = Math.log1p(shares); // log(shares + 1)
    const normalizedClicksIntoMoment = Math.log1p(clicksIntoMoment); // log(clicksIntoMoment + 1)
    const normalizedClicksProfile = Math.log1p(clicksProfile); // log(clicksProfile + 1)
    const normalizedComments = Math.log1p(comments); // log(comments + 1)
    const normalizedViews = Math.log1p(views); // log(views + 1)
    const normalizedSkips = Math.log1p(skips); // log(skips + 1)
    const normalizedShowLessOften = Math.log1p(showLessOften); // log(showLessOften + 1)
    const normalizedReports = Math.log1p(report); // log(reports + 1)

    // Normalizar o watchTime com base na duração total do post
    const normalizedWatchTime =
        totalDuration > 0 ? watchTime / totalDuration : 0;

    // Combina todos os valores normalizados em um vetor de embedding
    return [
        normalizedLikes,
        normalizedShares,
        normalizedClicksIntoMoment,
        normalizedWatchTime,
        normalizedClicksProfile,
        normalizedComments,
        normalizedViews,
        normalizedSkips,
        normalizedShowLessOften,
        normalizedReports,
    ];
}
