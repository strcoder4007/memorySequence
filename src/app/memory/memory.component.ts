import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-memory',
    templateUrl: './memory.component.html',
    styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit, AfterViewInit {
    @Input() memColor;
    @Input() myColor;
    @Input() mySide;
    @Input() myBgColor;
    @Input() sortedMemories;
    fontColor: string;
    private id;
    sub: any;
    post: any;
    
    constructor(private route: ActivatedRoute) {}

    hoverIn(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myBgColor;
        document.getElementById(junk.id).style.background = this.myColor;            
    }
    hoverOut(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myColor;
        document.getElementById(junk.id).style.background = this.myBgColor;
    }

    ngOnInit() {
        let curUrl = (window.location+'').split('/');
        let idx = parseInt(curUrl[curUrl.length-1]);
        this.post = this.sortedMemories[idx];
        if(this.mySide == "dark")
            this.myBgColor = "#222222";
        else
            this.myBgColor = "white";
    }
    ngAfterViewInit() {
    }
}
