import { Component, Input } from '@angular/core';
import { Card } from '../interface/card';

@Component({
  selector: 'app-dealr',
  templateUrl: './dealr.component.html',
  styleUrls: ['./dealr.component.scss']
})
export class DealrComponent {
  @Input() hand: Card[] = [];
  constructor(){

  }
}
