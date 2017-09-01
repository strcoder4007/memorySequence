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
    adj = [];
    allTags = [];

    @Input('items') posts;
    @Input('inMemory') inMemory;
    @Input ('showSearch') showSearch;
    @Input ('memoryFeeder') memoryFeeder;
    @Input ('showAllMemories') showAllMemories;

    constructor () {
    }


    ngOnInit() {
        document.getElementById('focusThis').focus();

        //getting all tags
        for(let i = 0; i < this.posts.length; i++) {
            for(let j = 0; j < this.posts[i].tags.length; j++) {
                this.allTags.push(this.posts[i].tags[j]);
            }
        }
        //filter to unique tags
        this.allTags = this.allTags.filter((v, i, a) => a.indexOf(v) === i);

        //initaizing adj with all tags;
        for(let i = 0; i < this.allTags.length; i++) {
            this.adj[this.allTags[i]] = [];
        }

        //filling adj[tag] with titles and then filtering them to unique
        for(let i = 0; i < this.posts.length; i++)
            for(let j = 0; j < this.posts[i].tags.length; j++) {
                this.tags = {
                    name: this.posts[i].title
                }
                this.adj[this.posts[i].tags[j]].push(this.tags);
            }

        for(let j = 0; j < this.allTags.length; j++) {
            this.adj[this.allTags[j]] = this.adj[this.allTags[j]].filter((v, x, a) => a.indexOf(v) === x);
            console.log(this.adj[this.allTags[j]]);
        }

        

    }
}

interface Tags {
    name: string;
}