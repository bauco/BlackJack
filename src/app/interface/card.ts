export class Card {
    suit!: string;
    rank!: string;
    value!: number;
    image!: string;
    constructor(suit: string, rank: string, value: number, image: string){
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.image = image;
    }
    isAce(){
        return this.rank === 'ace'
    }
}
