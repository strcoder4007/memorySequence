import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-memory',
    templateUrl: './memory.component.html',
    styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {
    @Input() post;
    @Input() memColor;
    @Input() myColor;
    @Input() mySide;
    @Input() bgColor;
    fontColor: string;
    constructor() { }

    ngOnInit() {
        if(this.mySide == "dark"){
            this.bgColor = "#222222";
        }
        else{
            this.bgColor = "white";
        }
    }

}
