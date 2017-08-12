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
    @Input() sortedMemories;
    fontColor: string;
    private id;
    sub: any;
    post: any;

    constructor(private route: ActivatedRoute) { }

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
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            alert(this.id);
        });
        this.post = this.sortedMemories[this.id];
        if(this.mySide == "dark")
            this.myBgColor = "#222222";
        else
            this.myBgColor = "white";
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
      }
}
