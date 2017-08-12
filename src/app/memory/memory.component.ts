import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-memory',
    templateUrl: './memory.component.html',
    styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit, OnDestroy {
    @Input() memColor;
    @Input() myColor;
    @Input() mySide;
    @Input() myBgColor;
    fontColor: string;
    private id;
    sub: any;
    post: any;
    sortedMemories = [];

    constructor(private route: ActivatedRoute) { }

    updateSortedMemories(ev) {
        this.sortedMemories = ev;
        console.log(this.sortedMemories);
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.post = this.sortedMemories[this.id];
            alert(this.post.title);
        });
    }

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
        if(this.mySide == "dark")
            this.myBgColor = "#222222";
        else
            this.myBgColor = "white";
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
      }
}
