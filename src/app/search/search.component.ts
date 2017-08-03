import { Component, OnInit, Input} from '@angular/core';

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

    constructor () { }

    ngOnInit() {
        document.getElementById('focusThis').focus();
        for(var i = 0; i < this.posts.length; i++){
            this.tags = {
                name: this.posts[i].title
            }
            this.items.push(this.tags);
        }

    }
}

interface Tags {
    name: string;
}