import { Component, OnInit, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
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
    screenWidth: any;
    finalUrl: string;
    
        
    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {
        
    }

    refreshData(ev) {
          this.processJson();
    }

    gotomem(idx: number) {
        this.emitMemory.emit(idx);
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
        let prod = "https://1drv.ms/u/s!AmQasIRCiDf9vVBQ--3w2STYkPo8";
        let local = "https://1drv.ms/u/s!AmQasIRCiDf9vg-uuspbdj0x8Fi9";
        this.dataUrl = "https://api.onedrive.com/v1.0/shares/u!" + btoa(local+"?v="+Math.random())+"/root?expand=children";
        //console.log(this.http.get(this.dataUrl).map(res => res.json()));
        return this.http.get(this.dataUrl).map(res => res.json());
    }

    getfinalposts(myLink: string) {
        return this.http.get(myLink).map(res => res.json());
    }

    processJson() {
        this.memories = [];
        this.sortedMemories = [];
        this.getposts().flatMap(metaJson => {
            let myString = JSON.stringify(metaJson);
            let myIdx = myString.search("createdBy");
            this.finalUrl = myString.substring(25, myIdx-3);
            let myLink = this.finalUrl;
            //console.log("this is inside: " + this.finalUrl);
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
            this.emitMemories.emit(this.sortedMemories);
            let curUrl = (window.location+'').split('/');
            let idx = parseInt(curUrl[curUrl.length-1]);
            if(curUrl.length >= 5)
                this.gotomem(idx);
        })
    }
    ngOnInit() {
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