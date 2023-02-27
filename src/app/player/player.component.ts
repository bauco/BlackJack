import { Component, Input } from '@angular/core';
import { Card } from '../interface/card';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() hand: Card[] = [];
  @Input() name: string ='';
  @Input() score: number =0;
  constructor(){
  }

}
