import find_posts from "./find_posts"
import { mapSimilaritiesToMoments } from "./format_similarities"
export default async function moment_x_moment(){
   const [similarityMatrix, similrityIndex] = await find_posts()
   return  mapSimilaritiesToMoments(similarityMatrix, similrityIndex)
}