import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    items = [];
  constructor() { }

  ngOnInit() {
    this.items = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
  }

}
