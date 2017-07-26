import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    term: string  = '';
    items = [];
  constructor() { }

  ngOnInit() {
    this.items = [{ name: "MS#1" }, { name: "MS#2" }, { name: "MS#3" }];
  }

}
