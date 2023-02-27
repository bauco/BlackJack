import { Injectable } from '@angular/core';
import { Card } from '../interface/card';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  isShuffling: boolean = false;
  getDeck(): Card[] {
    return this.cards;
  }

  cards: Card[] = []
  suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

  constructor() { 
    this.cards = [];
    this.reset();
    this.shuffle();
  }

  reset(): void {
    this.cards = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
        let value = parseInt(rank);
        if (isNaN(value)) {
          if (rank === 'ace') {
            value = 11;
          } else {
            //  'Jack', 'Queen', 'King'
            value = 10;
          }
        }
        const imageUrl = `assets\\cards\\${rank}_of_${suit}.png`;
        this.cards.push(new Card(suit,rank,value,imageUrl));
      }
    }
  }

  async shuffle(): Promise<void> {
    if (!this.isShuffling) {
      this.isShuffling = true;
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
      this.isShuffling = false;
    }
  }
  
  hit(): Card | undefined {
    if (!this.isShuffling) {
      return this.cards.shift();
    }else{
      return undefined;
    }
  }

  
}
