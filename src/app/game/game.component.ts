import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Card } from '../interface/card';
import { Player } from '../interface/player';
import { DeckService } from '../services/deck.service';

export function playersNumber(players: Player[]): ValidatorFn {  
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value.trim()

    if(players.length === 0){
      if(value === ''){
        return {'min': true , 'empty': true };
      }
      return {'min': true };
    } else if(players.length > 4){
      return {'max' : true};
    }
    return {'min': false , 'max' : false};
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent  implements OnInit {
  title = 'BlackJack';

  deckService: DeckService;

  currentPlayerIndex : number = 0;
  
  gameStarted: boolean = false;
  gameEnded: boolean = false;
  delar: Player = new Player('delar', 0, []);
  players: Player[] = [];

  playerName = new FormControl('', [ playersNumber(this.players) ]);
  deck: Card[] = [];
  winner: Player = {
    name: '', hand: [], score: 0
  };



  constructor(deckService : DeckService, public dialog: MatDialog){
    this.deckService = deckService;
  }

  ngOnInit(): void {
  }


  addPlayer(name: string | null) {
    name?.trim();  
    if(name != null && name !== ''){
      
      if(this.players.map(player => player.name  === name)){
        this.players.push(new Player(name));  
      }
    }
  }
  
  removePlayer(index : number){
    this.players.splice(index,1)
  }
  
  async startGame(){
    if(this.players.length > 0 &&  this.players.length < 5){
      await this.deckService.shuffle();
      this.deck = this.deckService.getDeck();
      await this.deal()
      this.currentPlayerIndex = 0;
      this.gameStarted = true;
    }
  }
  
  async deal(){
    for(let j = 0; j < 2 ; ++j){
      if(j == 0){
        this.players.forEach(player => player.hand = [])
      }
      let card = this.deckService.hit();
      if(card !== undefined){
        this.delar =  this.updateScore(card,this.delar);
      }
      for(let i = 0; i< this.players.length ; ++i){
        let card = this.deckService.hit();
        if(card !== undefined){
          this.players[i] = this.updateScore(card,this.players[i]);
        }
      }        
    }
    this.players.length 
  }

  hitPlayer() {
    if(this.players[this.currentPlayerIndex].score < 21){
      let card = this.deckService.hit();
      if(card === undefined){
  
      } else{
        this.players[this.currentPlayerIndex] = this.updateScore(card, this.players[this.currentPlayerIndex])
        if(this.players[this.currentPlayerIndex].score >= 21){
          this.stand()
        }
      }  
    }else{
      this.stand()
    }
  }

  updateScore(card : Card, player : Player){
    if(player.score + card.value > 21){
      if(card.isAce()){
        card.value = 1
      }else{
        let flag = false
        player.hand.forEach(card => {     
          if (!flag && card.isAce() && card.value !== 1){
            card.value = 1;
            player.score -=10;
            flag = true
          }
        })
      }
    }
    player.hand.push(card);
    player.score += card.value
    return player;
  }

  stand(){
    this.currentPlayerIndex +=1;
    if(this.currentPlayerIndex % this.players.length == 0){
        this.hitDelar();
    }
  }

  hitDelar(){
    while(this.delar.score < 17){
        let card = this.deckService.hit();
        if(card === undefined){
        } else{
          this.delar =  this.updateScore(card,this.delar);  
        }
    }
    setTimeout(() => {
    }, 1000)
    this.calculateWinner()
  }

  calculateWinner(): void {
    let highestScore = 0;
    for (let i = 0; i <  this.players.length; i++) {
      if (this.players[i].score <= 21 && this.players[i].score > highestScore) {
        highestScore = this.players[i].score;
        this.winner.name = this.players[i].name;
        this.winner.hand = this.players[i].hand;
        this.winner.score = this.players[i].score;
      }
    }
    if ( this.delar.score <= 21 &&  this.delar.score > highestScore) {
      this.winner.name = 'dealer';
      this.winner.hand = this.delar.hand;
      this.winner.score = this.delar.score;
    }
    this.openDialog();
    this.gameEnded = true;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(WinningDialog, {
      data: this.winner,
    });

    dialogRef.afterClosed().subscribe(playAgain => {
      this.resetGame(playAgain);
    });
  }

  resetGame(playAgain = false) {
    this.delar.hand=[]
    this.delar.score = 0;
    this.deckService.reset()
    if(!playAgain){
      while(this.players.length > 0){
        this.players.pop()
      }
      this.gameStarted= false;
    }else{
      for (let i = 0; i <  this.players.length; i++) {
        this.players[i].hand = [];
        this.players[i].score = 0;
      }
      this.startGame();
    }
    this.gameEnded = false;
  }
}

@Component({
  selector: 'wining-dialog',
  templateUrl: 'wining-dialog.html',
})
export class WinningDialog {
  constructor(
    public dialogRef: MatDialogRef<WinningDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Player,
  ) {}

  nextRound(playAgain = false): void {
    this.dialogRef.close(playAgain);
  }
}
