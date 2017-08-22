import { Component, OnInit, SecurityContext, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router} from '@angular/router';
import { MemoriesComponent } from './memories/memories.component';
import { MemoryComponent } from './memory/memory.component';

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
    showSearch: boolean = false;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    isLoggedIn: boolean = false;
    inLogin: boolean = false;
    username: string;
    password: string;
    showError: boolean = false;
    screenWidth: any;
    inMemory: boolean = false;
    hideOptions: boolean = true;
    sortedMemories = [];
    @ViewChild(MemoriesComponent) private memoriesComponent:MemoriesComponent;
    @ViewChild(MemoryComponent) private memoryComponent:MemoryComponent;

    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {
        
    }

    getSortedMemories(ev) {
        this.sortedMemories = ev;
        //this.memoryComponent.updateSortedMemories(ev);
        //this.memoryComponent.sortedMemories = ev;
    }

    toggleLogin(ev) {
        this.inLogin = ev;
    }

    loggedIn(ev) {
        this.isLoggedIn = ev;
        this.memoriesComponent.refreshData(ev);
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
        this.myBgColor = '#222222';
        this.mySide = 'dark';
        this.myColor = 'white';
        this.memColor = 'gray';
        this.seduce = "turn to light side";
        this.myImage = 'assets/img/yoda.png';
    }
}