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
    @Output() emitMemory = new EventEmitter();

    memory: Memory;
    memories =[];
    myTags = [];
    tags: Tags;
    dataUrl: string;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    sortedMemories = [];
    screenWidth: any;
    
        
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

    //when direct link is given to a memory then we need to come directly to this place and the click automatic
    //therefore here the address should be the direct

    getposts() {
        return this.http.get('assets/data.json').map(res => res.json());
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
            this.emitMemories.emit(this.sortedMemories);
            let curUrl = (window.location+'').split('/');
            let idx = parseInt(curUrl[curUrl.length-1]);
            if(curUrl.length >= 5)
                this.gotomem(idx);
        })
    }
    ngOnInit() {
        //this.dataUrl = "https://api.onedrive.com/v1.0/shares/u!" + btoa("https://1drv.ms/u/s!AmQasIRCiDf9vD-2TelhqjKMwd1N")+"/root?expand=children";
        //this.dataUrl = "https://ccipua.bn1301.livefilestore.com/y4m6NaOCIeoFWT-R9MUfH4UAK5AcSqGhfOw8ggqW9g_xDbhzhxDeo11JUvzbJerUHSSRl7cyY1g1w3nRe54B77cZXEZPJo3Cc-0S0mqOvJNKVABHqIESnipWKKkSajJcr4Og0KxPV0fSGk6IX7Ug6O07SrpSBG-LA-5vXtRxlTe-i5Pgd06wV3Aa-R_v5NQ05KBGyLkAb9lmqzEwunX3Lyksw";
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