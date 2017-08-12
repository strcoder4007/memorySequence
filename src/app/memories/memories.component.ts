import { Component, OnInit, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router} from '@angular/router';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent implements OnInit {
    @Input() myColor;
    @Input() myBgColor;
    @Input() inLogin;
    @Input() isLoggedIn;
    @Input() memColor;
    @Input() hideOptions;
    @Output() emitMemories = new EventEmitter();

    memory: Memory;
    memories =[];
    myTags = [];
    tags: Tags;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    sortedMemories = [];
    screenWidth: any;
    
        
    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {
        
    }

    refreshData(ev) {
          this.processJson();
    }

    gotomem(idx: number) {
        this.router.navigate(['/memory', idx]);
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

    getposts() {
        return this.http.get("assets/data.json").map(res => res.json());
    }

    processJson() {
        this.memories = [];
        this.sortedMemories = [];
        this.getposts().subscribe((posts) => {
            for(var i = 0; i < posts.length; i++){
                this.memory = posts[i];
                this.tags = {
                    name: this.memory.title
                }
                this.myTags.push(this.tags.name);
                this.memory.content = this.sanitizer.bypassSecurityTrustHtml(this.memory.content);
                this.memories.push(this.memory);
            }
            let cnt = 0;
            for(let i = 2015; i < 2064; i++)
                for(let j = 0; j < 12; j++)
                    for(let k = 1; k < 32; k++)
                        for(let x = 0; x < this.memories.length; x++){
                            let date = this.memories[x].time.split(" ");
                            if(parseInt(date[0]) == k && date[1] == this.months[j] && parseInt(date[2]) == i){
                                let hide = false;
                                for(let y = 0; y < this.memories[x].tags.length; y++)
                                    if(this.memories[x].tags[y] == "personal" && !this.isLoggedIn)
                                        hide = true;
                                if(!hide)
                                    this.sortedMemories.unshift(this.memories[x]);
                            }
                        }
        })
    }
    ngOnInit() {
        this.processJson();
        this.emitMemories.emit(this.sortedMemories);
        this.screenWidth = window.screen.width;
    }
}
interface Memory {
    title: string;
    content: any;
    time: string;
    tags: Array<string>;
}
interface Tags {
    name: string;
}