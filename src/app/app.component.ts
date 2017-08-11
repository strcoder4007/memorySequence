import { Component, OnInit, SecurityContext, Input } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    myBgColor: string;
    mySide: string;
    seduce: string;
    myColor: string;
    memColor: string;
    myImage: string;
    memory: Memory;
    memories =[];
    newTitle: string = "";
    newMemory: string = "";
    showSearch: boolean = false;
    myTags = [];
    tags: Tags;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    sortedMemories = [];
    showMemories: boolean = true;
    showAllMemories: boolean;
    memoryFeeder: Memory;
    inMemory: boolean = false;
    defaultFeed: Memory;
    isLoggedIn: boolean = false;
    inLogin: boolean = false;
    username: string;
    password: string;
    showError: boolean = false;
    screenWidth: any;
        
    constructor(public http: Http, private sanitizer: DomSanitizer) {
        
    }

    toggleLogin(ev) {
        this.inLogin = ev;
    }

    receivingLoginData(ev) {
        this.inLogin = ev[2];
        if(ev[0] == "str" && ev[1] == "3yt8y98y5t394u20409g3h82g3") {
            this.isLoggedIn = true;
            this.processJson();
        }
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

    setToDefaultFeed(currentMemory) {
        this.memoryFeeder = currentMemory;
    }

    memoryView(currentMemory: Memory) {
        if(!this.showAllMemories)            
            this.showMemories = true;
        this.showAllMemories = !this.showAllMemories;
        this.setToDefaultFeed(currentMemory);
    }

    getposts() {
        return this.http.get("assets/data.json").map(res => res.json());
    }

    toggleMenu() {
        if(this.showSearch)
            this.showSearch = false;
        else
            this.showSearch = true;
    }

    clear() {
        this.newMemory = "";
        this.newTitle = "";
    }

    toggleSide() {
        if(this.mySide == 'light')
        {
            this.mySide = 'dark';
            this.myBgColor = '#222222';
            this.seduce = "turn to light side";
            this.myColor = 'white';
            this.memColor = 'gray';
            this.myImage = 'assets/img/yoda.png';
        }
        else if(this.mySide == 'dark')
        {
            this.mySide = 'light';
            this.myBgColor = 'white';
            this.seduce = "turn to dark side";
            this.myColor = 'black';
            this.memColor = '#565656';
            this.myImage = 'assets/img/darthVader.png';
        }
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
            this.memoryFeeder = this.memories[0];
            this.defaultFeed = this.memories[0];
        })
    }

    ngOnInit() {
        this.showAllMemories = true;
        this.myBgColor = '#222222';
        this.mySide = 'dark';
        this.myColor = 'white';
        this.memColor = 'gray';
        this.seduce = "turn to light side";
        this.myImage = 'assets/img/yoda.png';
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