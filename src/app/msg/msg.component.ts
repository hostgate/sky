import { Component, OnInit,Inject } from '@angular/core';
import {MD_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.css']
})
export class MsgComponent implements OnInit {

  constructor(@Inject(MD_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
