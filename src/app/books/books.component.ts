import {Component, OnInit, Input} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({selector: 'app-books', templateUrl: './books.component.html', styleUrls: ['./books.component.css']})
export class BooksComponent implements OnInit {

    @Input()myColor;
    @Input()myBgColor;
    @Input()inLogin;
    @Input()isLoggedIn;
    @Input()memColor;
    @Input()hideOptions;
    books = [];

    constructor(public http: Http) {}

    readBook(index: any) {
        const junk = document.getElementById(index);
        if (document.getElementById(junk.id).style.textDecoration === 'line-through') {
            document.getElementById(junk.id).style.textDecoration = 'none';
        } else {
            document.getElementById(junk.id).style.textDecoration = 'line-through';
        }
    }

    getPosts(myLink: string) {
        return this
            .http
            .get(myLink)
            .map(res => res.json());
    }

    processJson() {
        this
            .getPosts('http://localhost:3001')
            .subscribe(data => {
                this.books = data;
                let junkBooks = '', junkRead = '';
                for (let i = 0; i < this.books.length; i++) {
                    if (i) {
                        junkBooks += '$';
                        junkRead += '$';
                    }
                    junkBooks += this.books[i].book;
                    junkRead += this.books[i].read;
                }
                localStorage.setItem('books', junkBooks);
                localStorage.setItem('read', junkRead);
            });
    }

    ngOnInit() {
        if (localStorage.getItem('books') == undefined) {
            localStorage.setItem('books', '');
            localStorage.setItem('read', '');
        } else {
            const junkBooks = localStorage.getItem('books').split('$');
            const junkRead = localStorage.getItem('read').split('$');
            for (let i = 0; i < junkBooks.length; i++) {
                this.books.push({
                    'book': junkBooks[i],
                    'read': junkRead[i]
                });
            }
        }
        this.processJson();
    }

}
