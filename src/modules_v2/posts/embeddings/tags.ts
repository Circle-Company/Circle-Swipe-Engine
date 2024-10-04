import * as natural from "natural";

export function getTagsEmbedding(tags: string[]): number[] {
    // Criar o vetor TF-IDF
    const tfidf = new natural.TfIdf();

    // Adicionar as tags como documentos ao TF-IDF
    tags.forEach((tag) => tfidf.addDocument(tag));

    // Inicializar um vetor para armazenar os valores TF-IDF resultantes
    let combinedEmbedding: number[] = [];

    // Para cada tag, listar os termos e seus valores TF-IDF
    tags.forEach((tag, index) => {
        // Obter os termos e TF-IDF do documento no índice da tag
        const terms = tfidf.listTerms(index);

        // Se for o primeiro documento (primeira tag), inicializa o vetor com zeros
        if (combinedEmbedding.length === 0) {
            combinedEmbedding = Array(terms.length).fill(0);
        }

        // Adicionar os valores TF-IDF de cada termo ao vetor de embedding
        terms.forEach((term, termIndex) => {
            combinedEmbedding[termIndex] += term.tfidf;
        });
    });

    // Normalizar o embedding final (se necessário)
    const totalWeight = combinedEmbedding.reduce((acc, val) => acc + val, 0);
    if (totalWeight > 0) {
        combinedEmbedding = combinedEmbedding.map((val) => val / totalWeight);
    }

    return combinedEmbedding;
}
