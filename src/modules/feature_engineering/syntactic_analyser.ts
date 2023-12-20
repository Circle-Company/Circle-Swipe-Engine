import LetterConversor from "./letter_conversor"
import sigmoid from "../../math/sigmoid"

type SyntacticAnalyserProps = {
    word: string
}

export default function syntacticAnalyser({ word }: SyntacticAnalyserProps) {

    const splitted_word = word.split('')
    const matrix = splitted_word.map((letter) => { return LetterConversor({letter}) })
    const  arr = matrix.map((w, index) => {
        var weight = matrix.length - index 
        return Number(w) * weight
    })

    const sum_arr: number = (arr.reduce((acumulador, numero) => acumulador + numero, 0))/100
    
    return Number(sigmoid(sum_arr).toFixed(4))
}