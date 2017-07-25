import { Component, OnInit } from '@angular/core';
import {Collapse} from './collapse.component';

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
    memories: Array<Memory>;
    newTitle: string = "";
    newMemory: string = "";

    constructor() {
    }

    save() {
        this.memory = {
            title: this.newTitle,
            content: this.newMemory
        }
        this.memories.unshift(this.memory);
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
            title: 'Inception', 
            content: "The new syntax has a couple of things to note. The first is *ngFor. The * is a shorthand for using the new Angular template syntax with the template tag. This is also called a structural Directive. It is helpful to know that * is just a shorthand to explicitly defining the data bindings on a template tag. The template tag prevents the browser from reading or executing the code within it. Shepard Fairey is one of those artists that you might not have heard of, but you've definitely seen at least one of his works. Unless you've been leaving under a rock for the past 10 years, you've seen the Obama Hope poster all around at some point. Well, that's Shepard right there. Shepard is a street art artist who began his career over 30 years ago, on his teen years. These days his been all over the world painting murals and designing beautiful posters and more. He's got the kind of art that will make you think whenever you see it. You might not share his political and world views, but he has definitely turn Social criticism into art. For more of his work, please visit his Instagram (for the latest) or his portfolio. I hope you enjoy these! Cheers. ;)"
        }
        this.memories = [this.memory];
        this.memory = {
            title: "MS#1 Street Art Master Shepard Fairey - Obey Giant",
            content: "Shepard Fairey is one of those artists that you might not have heard of, but you've definitely seen at least one of his works. Unless you've been leaving under a rock for the past 10 years, you've seen the Obama Hope poster all around at some point. Well, that's Shepard right there. <br> Shepard is a street art artist who began his career over 30 years ago, on his teen years. These days his been all over the world painting murals and designing beautiful posters and more. He's got the kind of art that will make you think whenever you see it. You might not share his political and world views, but he has definitely turn Social criticism into art. For more of his work, please visit his Instagram (for the latest) or his portfolio. I hope you enjoy these! Cheers. ;)."
        }
        this.memories.unshift(this.memory);
        this.memory = {
            title: "MS#2 22nd July 2017 weed after giving up",
            content: `I am high again. I've promised myself this time to enjoy not mourne over time lost.
            Anyways, I was just thinking how many times i've fucked with Amazon, like everytime they come to deliver; I'm always not there, like everytime. I've given wrong phone numbers, i've given address wrong, yes! i've done that too and sometimes i've done both at once, like this time.

            I'm listening to Linkin Park right now, man, this band made a bonus track for Japan during tsunami. I don't think i have to say anymore of who they were. So good, man. I wasn't aware but when you look at them you know they were true, as true the truth can get. That's a bonus point in favor of them. Such a good man, I should try to be that good. If any aim there should be, it should be this. I should blindly follow his beliefs.
            It's nice to see this much mourning in the world right now, a man like that deserves that level of respect. Shit, I think I'm going to cry again. It's really good to see that he was a figure whom everyone is paying respect. People from all over the world, the whole rock genre, hollywood. You know you are legendary when people from every cast, religion, country, people who are rich, people who are poor, people you knew you, people who didn't knew, every fucking one mournes.
            They wrote a song about Earth, about what we are doing to it. There's no rock band I know of who has written anything about Mother Earth, ever!

            Why hasn't Greenday dedicated any song to Linkin Park as tribute yet? I'm waiting. Maybe they won't because of some understanding which come with that level and kind of maturity or they are just dicks in real life. I don't know Greenday from inside, man i should.
            
            
            `
        }
        this.memories.unshift(this.memory);
    }

}
interface Memory {
    title: string;
    content: any;
}
/*

interface MyObjLayout {
    property: string;
}

var obj: Memory = { title: "a", content: "b"};

var obj: MyObjLayout = { property: "foo" };
*/