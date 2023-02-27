import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../interface/card';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {

  hit() {
    this.hitPlayer.emit();
  }
  stand() {
    this.playerStand.emit();
  }
  @Input() cards! : Card[];
  @Output() hitPlayer = new EventEmitter<void>();
  @Output() playerStand = new EventEmitter<void>(); 

}
