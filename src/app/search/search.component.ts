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
    @Input('inMemory') inMemory;
    @Input ('showSearch') showSearch;
    @Input ('memoryFeeder') memoryFeeder;
    @Input ('showAllMemories') showAllMemories;

    constructor () {
    }

    testing(cur: string) {
        this.inMemory = !this.inMemory;
        this.showSearch = false;
        for(let i = 0; i < this.posts.length; i++)
            if(this.posts[i].title == cur)
                this.memoryFeeder = this.posts[i];
        this.showAllMemories = false;
    }


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