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
        
    constructor(public http: Http, private sanitizer: DomSanitizer) {
        
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

    save() {
        var today = new Date();
        var dd = today.getDate();
        var mm = this.months[today.getMonth()];
        var yyyy = today.getFullYear()
        var mytime = dd + ' ' + mm + ' ' + yyyy;
        if(this.newMemory.length && this.newTitle.length){
            this.memory = {
                title: this.newTitle,
                content: this.newMemory,
                time: mytime,
                tags: ["dead code"]
            }
            this.tags = {
                name: this.memory.title
            }
            this.myTags.push(this.tags.name);
            this.memories.unshift(this.memory);
        }
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

    ngOnInit() {
        this.showAllMemories = true;
        this.myBgColor = '#222222';
        this.mySide = 'dark';
        this.myColor = 'white';
        this.memColor = 'gray';
        this.seduce = "turn to light side";
        this.myImage = 'assets/img/yoda.png';
        this.getposts().subscribe((posts) => {
            for(var i = 0; i < posts.length; i++){
                this.memory = posts[i];
                this.tags = {
                    name: this.memory.title
                }
                this.myTags.push(this.tags.name);
                this.memory.content = this.sanitizer.bypassSecurityTrustHtml(this.memory.content);
                this.memories.unshift(this.memory);
            }
            for(let i = 2015; i < 2064; i++)
                for(let j = 0; j < 12; j++)
                    for(let k = 1; k < 32; k++)
                        for(let x = 0; x < this.memories.length; x++){
                            let date = this.memories[x].time.split(" ");
                            if(parseInt(date[0]) == k && date[1] == this.months[j] && parseInt(date[2]) == i)
                                this.sortedMemories.unshift(this.memories[x]);
                        }
            this.memoryFeeder = {
                title: this.memories[8].title,
                content: this.memories[8].content,
                time: this.memories[8].time,
                tags: this.memories[8].tags
            }
            this.defaultFeed = this.memories[8];
        })

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