import { Component, OnInit, Input, Output } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    term: string  = '';
    tags: Tags;
    items = [];

    @Input('items') posts;

    constructor (public http: Http) { }

    ngOnInit() {
        document.getElementById('focusThis').focus();
        for(var i = 0; i < this.posts.length; i++){
            this.tags = {
                name: this.posts[i].title
            }
            this.items.push(this.tags);
            this.tags = {
                name: this.posts[i].time
            }
            this.items.push(this.tags);
        }
    }
}

interface Tags {
    name: string;
}