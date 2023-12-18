import { Router } from "express"
import { SwipeEngine } from "../controllers/controller-swipe_engine"

const swipeEngineRouter = Router()
swipeEngineRouter.post('/moments/get', SwipeEngine.getMoments)

export default swipeEngineRouter