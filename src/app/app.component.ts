import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    memory: Memory;
    memories: Memory[];

    constructor() {
    }


    ngOnInit() {

        var memory = {
            title: 'Inception', 
            content: 'The new syntax has a couple of things to note. The first is *ngFor. The * is a shorthand for using the new Angular template syntax with the template tag. This is also called a structural Directive. It is helpful to know that * is just a shorthand to explicitly defining the data bindings on a template tag. The template tag prevents the browser from reading or executing the code within it.'
        }
        this.memories = [memory];

    }
    
}
interface Memory {
    title: string;
    content: string;
}
