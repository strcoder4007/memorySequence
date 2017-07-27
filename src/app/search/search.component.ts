import { Component, OnInit } from '@angular/core';
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


    constructor (public http: Http) { }

    getposts() {
        return this.http.get("assets/data.json").map(res => res.json());
    }

    ngOnInit() {

        this.getposts().subscribe((posts) => {
            for(var i = 0; i < posts.length; i++){
                this.tags = {
                    name: posts[i].title
                }
                this.items.push(this.tags);
                this.tags = {
                    name: posts[i].time
                }
                this.items.push(this.tags);
            }
        })
    }
}

interface Tags {
    name: string;
}