import { Component, OnInit, SecurityContext, Input, Output, EventEmitter, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router} from '@angular/router';
import 'rxjs/Rx';

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
    @Output() emitMemory = new EventEmitter();

    memory: Memory;
    memories =[];
    myTags = [];
    tags: Tags;
    dataUrl: string;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    sortedMemories = [];
    allMemories = [];
    someMemories = [];
    screenWidth: any;
    finalUrl: string;
    level = 0;
    urlArgslen: Number;
    locprodUrl: String;
        
    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {
        
    }

    refreshData(ev) {
        if(!ev)
            this.level = 1;
        this.isLoggedIn = ev;
        this.processJson();
    }

    gotomem(idx: number) {
        this.emitMemory.emit(idx);
    }

    hoverIn(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myBgColor;
        document.getElementById(junk.id).style.background = this.myColor;
        //changing style of the tinyDate
        document.getElementById("tinyDate"+junk.id).style.color = this.myColor;
        document.getElementById("tinyDate"+junk.id).style.background = this.myBgColor;
        document.getElementById("tinyDate"+junk.id).style.display = "inherit";
    }
    hoverOut(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myColor;
        document.getElementById(junk.id).style.background = this.myBgColor;
        document.getElementById("tinyDate"+junk.id).style.display = "none";
    }

    getposts() {
        this.dataUrl = "https://api.onedrive.com/v1.0/shares/u!" + btoa(this.locprodUrl+"?v="+Math.random())+"/root?expand=children";
        return this.http.get(this.dataUrl).map(res => res.json());
    }

    getfinalposts(myLink: string) {
        return this.http.get(myLink).map(res => res.json());
    }

    processJson() {
        this.memories = [];
        this.someMemories = [];
        this.sortedMemories = [];
        this.allMemories = [];
        this.getposts().flatMap(metaJson => {
            if(localStorage.getItem("lastModified") == metaJson['lastModifiedDateTime']) {
                if(this.isLoggedIn && this.level == 2) {
                    this.sortedMemories = JSON.parse(localStorage.getItem("sortedMemoriesPrivate"));
                    return;
                }
                else if(this.isLoggedIn && this.level == 1) {
                    console.log("should continue to populate private list");
                }
                else if(!this.isLoggedIn) {
                    this.sortedMemories = JSON.parse(localStorage.getItem("sortedMemoriesPublic"));
                    return;
                }
            }
            ++this.level;
            localStorage.setItem("lastModified", metaJson['lastModifiedDateTime']);
            let myString = JSON.stringify(metaJson);
            let myIdx = myString.search("createdBy");
            this.finalUrl = myString.substring(25, myIdx-3);
            let myLink = this.finalUrl;
            return this.getfinalposts(myLink);
        }).subscribe(posts => {
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
            for (let i = 2015; i < 2064; i++)
                for (let j = 0; j < 12; j++)
                    for (let k = 1; k < 32; k++)
                        for (let x = 0; x < this.memories.length; x++){
                            let date = this.memories[x].time.split(" ");
                            if (parseInt(date[0]) == k && date[1] == this.months[j] && parseInt(date[2]) == i){
                                let hide = false;
                                for(let y = 0; y < this.memories[x].tags.length; y++)
                                    if(this.memories[x].tags[y] == "personal")
                                        hide = true;
                                if(!hide)
                                    this.someMemories.unshift(this.memories[x]);   
                                this.allMemories.unshift(this.memories[x]);
                            }
                        }
            this.isLoggedIn ? this.sortedMemories = this.allMemories : this.sortedMemories = this.someMemories;
            for (let i = 0; i < this.sortedMemories.length; i++) {
                const junk = this.sortedMemories[i].content.changingThisBreaksApplicationSecurity.split(' ');
                let words = 0;
                for (let j = 0; j < junk.length; j++) {
                    if (junk[j].length > 2) {
                        ++words;
                    }
                }
                this.sortedMemories[i].words = words;
            }
            if(this.isLoggedIn)
                localStorage.setItem("sortedMemoriesPrivate", JSON.stringify(this.allMemories));
            localStorage.setItem("sortedMemoriesPublic", JSON.stringify(this.someMemories));
            this.emitMemories.emit(this.sortedMemories);
            let curUrl = (window.location+'').split('/');
            let idx = parseInt(curUrl[curUrl.length-1]);
            if(curUrl.length >= this.urlArgslen)
                this.gotomem(idx);
        })
    }
    ngOnInit() {
        if (isDevMode()) {
            this.urlArgslen = 5;
            this.locprodUrl = "https://1drv.ms/u/s!AmQasIRCiDf9vg-uuspbdj0x8Fi9";
        } else {
            this.locprodUrl = "https://1drv.ms/u/s!AmQasIRCiDf9vVBQ--3w2STYkPo8";
            this.urlArgslen = 6;
        }
        this.processJson();
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
