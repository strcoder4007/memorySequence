import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    term: String  = '';
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
        

    }
}

interface Tags {
    name: string;
}
