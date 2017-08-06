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


    hoverIn(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.bgColor;
        document.getElementById(junk.id).style.background = this.myColor;            
    }
    hoverOut(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myColor;
        document.getElementById(junk.id).style.background = this.bgColor;
    }

    ngOnInit() {
        if(this.mySide == "dark"){
            this.bgColor = "#222222";
        }
        else{
            this.bgColor = "white";
        }
    }

}
