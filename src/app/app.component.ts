import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',]
})
export class AppComponent implements OnInit{
  chsteam: any;
  chlol: any;
  myVar1 = false;
  myVar2 = false;
  myVar3 = false;
  myVar4 = false;
  name = "";
  constructor() {}
 data!:any

  getValue(val: string){
    this.data = {sourceType:"url",url:val};
  }

  ngOnInit(): void {
  }

  title = 'spw';
}
