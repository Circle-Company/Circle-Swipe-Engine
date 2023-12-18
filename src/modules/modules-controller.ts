import { Feature_Engineering } from './feature_engineering'

export function Modules_Controller(user_interactions:any) {

    return Feature_Engineering({
        userInteractions: user_interactions
    })
}