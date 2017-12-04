import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {InfirmierInterface} from "../dataInterfaces/nurse";

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfirmierComponent implements OnInit {

  @Input("data") private infirmier : InfirmierInterface;


  constructor() {
  }

  ngOnInit() {
  }

}
