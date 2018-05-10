import {
    Component,
    OnInit,
    SecurityContext,
    Input,
    ViewChild,
    AfterViewInit,
    isDevMode
} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {MemoriesComponent} from './memories/memories.component';
import {MemoryComponent} from './memory/memory.component';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent implements OnInit,
AfterViewInit {
    myBgColor: string;
    mySide: string;
    seduce: string;
    myColor: string;
    memColor: string;
    myImage: string;
    showSearch: Boolean = false;
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    isLoggedIn: Boolean = false;
    inLogin: Boolean = false;
    username: string;
    password: string;
    showError: Boolean = false;
    screenWidth: any;
    inMemory: String = 'memories';
    hideOptions: Boolean = true;
    urlArgslen: Number = 5;
    sortedMemories = [];
    @ViewChild(MemoriesComponent)private memoriesComponent: MemoriesComponent;
    @ViewChild(MemoryComponent)private memoryComponent: MemoryComponent;

    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {}

    goBack() {
        const curUrl = (window.location + '').split('/');
        if (curUrl.length >= 5) {
            this
                .router
                .navigate(['']);
        }
    }

    gotoMemory(ev) {
        this
            .router
            .navigate(['/memory', ev]);
        this.inMemory = 'memory';
    }

    getSortedMemories(ev) {
        this.sortedMemories = ev;
    }

    toggleLogin(ev) {
        this.inLogin = ev;
    }

    loggedIn(ev) {
        if (!ev) {
            localStorage.setItem('loggedIn', '');
            localStorage.setItem('sortedMemoriesPrivate', '');
        }
        this.isLoggedIn = ev;
        this
            .memoriesComponent
            .refreshData(ev);
    }

    toggleMenu() {
        if (this.showSearch) {
            this.showSearch = false;
        } else {
            this.showSearch = true;
        }
    }
    toggleSide() {
        if (this.mySide === 'light') {
            this.mySide = 'dark';
            this.myBgColor = '#222222';
            this.seduce = 'turn to light side';
            this.myColor = 'white';
            this.memColor = 'gray';
            this.myImage = 'assets/img/yoda.png';
        } else if (this.mySide === 'dark') {
            this.mySide = 'light';
            this.myBgColor = 'white';
            this.seduce = 'turn to dark side';
            this.myColor = 'black';
            this.memColor = '#565656';
            this.myImage = 'assets/img/darthVader.png';
        }
    }

    ngOnInit() {
        if (isDevMode()) {
            this.urlArgslen = 6;
        }
        this.myBgColor = '#222222';
        this.mySide = 'dark';
        this.myColor = 'white';
        this.memColor = 'gray';
        this.seduce = 'turn to light side';
        this.myImage = 'assets/img/yoda.png';
        if (localStorage.getItem('loggedIn') === undefined) {
            localStorage.setItem('loggedIn', '');
        } else if (localStorage.getItem('loggedIn') === 'xyufsvt') {
            this.loggedIn(true);
        }
        if (localStorage.getItem('lastModified') === undefined) {
            localStorage.setItem('lastModified', '');
        }
        if (localStorage.getItem('sortedMemoriesPrivate') === undefined) {
            localStorage.setItem('sortedMemoriesPrivate', '');
        }
        if (localStorage.getItem('sortedMemoriesPublic') === undefined) {
            localStorage.setItem('sortedMemoriesPublic', '');
        }
    }
    ngAfterViewInit() {
        const curUrl = (window.location + '').split('/');
        if (curUrl.length >= 5) {
            this
                .memoriesComponent
                .processJson();
            this.hideOptions = false;
        }
    }
}
