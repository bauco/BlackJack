import { Card } from "./card";

export class Player {
    name!:string;
    score!:number;
    hand!:Card[];
    constructor(name: string, score: number = 0, hand: Card[] = []){
        this.name = name;
        this.score = score
        this.hand = hand
    }
}
