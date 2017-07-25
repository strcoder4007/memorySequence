import { Component, OnInit } from '@angular/core';
import {Collapse} from './collapse.component';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 

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
    myImage: string;
    memory: Memory;
    memories =[];
    newTitle: string = "";
    newMemory: string = "";

    constructor(public http: Http) {
    }

    getposts() {
        return this.http.get("assets/data.json").map(res => res.json());
    }

    clear() {
        this.newMemory = "";
        this.newTitle = "";
    }

    save() {
        if(this.newMemory.length && this.newTitle.length){
            this.memory = {
                title: this.newTitle,
                content: this.newMemory
            }
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
            this.myImage = 'assets/img/yoda.png';
        }
        else if(this.mySide == 'dark')
        {
            this.mySide = 'light';
            this.myBgColor = 'white';
            this.seduce = "turn to dark side";
            this.myColor = 'black';
            this.myImage = 'assets/img/darthVader.png';
        }
    }

    ngOnInit() {
        this.myBgColor = '#222222';
        this.mySide = 'dark';
        this.myColor = 'white';
        this.seduce = "turn to light side";
        this.myImage = 'assets/img/yoda.png';
        this.memory = {
            title: `Inception`, 
            content: `The new syntax has a couple of things to note. The first is *ngFor. The * is a shorthand for using the new Angular template syntax with the template tag. This is also called a structural Directive. It is helpful to know that * is just a shorthand to explicitly defining the data bindings on a template tag. The template tag prevents the browser from reading or executing the code within it. Shepard Fairey is one of those artists that you might not have heard of, but you've definitely seen at least one of his works. Unless you've been leaving under a rock for the past 10 years, you've seen the Obama Hope poster all around at some point. Well, that's Shepard right there. Shepard is a street art artist who began his career over 30 years ago, on his teen years. These days his been all over the world painting murals and designing beautiful posters and more. He's got the kind of art that will make you think whenever you see it. You might not share his political and world views, but he has definitely turn Social criticism into art. For more of his work, please visit his Instagram (for the latest) or his portfolio. I hope you enjoy these! Cheers. ;)`
        }
        this.memories.push(this.memory);
        this.getposts().subscribe((posts) => {
            for(var i = 0; i < posts.length; i++){
                this.memory = posts[i];
                this.memories.unshift(this.memory);
            }
        })
    }

}
interface Memory {
    title: string;
    content: any;
}