import {Component, OnInit, Input, isDevMode} from '@angular/core';
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
    readBooks = 0;
    dostoevsky = [];
    nietzsche = [];
    jung = [];
    hemingway = [];
    orwell = [];
    tolstoy = [];
    freud = [];
    readBooksList = [
        'Jack London: The Call of the Wild',
        'J.D. Salinger: The Catcher in the Rye',
        'Mark Manson: The Subtle Art of Not Giving a Fuck',
        'R.L. Stevenson: Strange Case of Dr Jekyll and Mr Hyde',
        'Fyodor Dostoevsky: Notes from the Underground',
        'Ernest Hemingway: The Old Man and the Sea',
        'Fyodor Dostoevsky: Crime and Punishment',
        'George Orwell: Animal Farm'
    ];
    readingBooksList = [
        'George Orwell: Down and Out in Paris and London',
        'George Orwell: 1984',
        'Albert Camus: The Stranger',
        'Fyodor Dostoevsky: The Idiot'
    ];

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
            .getPosts(isDevMode() ? 'http://localhost:3001' : 'http://18.221.40.67:3001')
            .subscribe(data => {
                this.books = data;
                let junkBooks = '', junkRead = '';
                for (let i = 0; i < data.length; i++) {
                    if (i) {
                        junkBooks += '$';
                        junkRead += '$';
                    }
                    junkBooks += data[i].book;
                    junkRead += data[i].read;
                }
                localStorage.setItem('books', junkBooks);
                localStorage.setItem('read', junkRead);
                this.filterBooks();
            });
    }

    filterBooks() {
        this.dostoevsky = [], this.nietzsche = [], this.jung = [], this.hemingway = [], this.orwell = [], this.freud = [];
        for (let i = 0; i < this.books.length; i++) {
            const curBook = this.books[i].book.toLowerCase();
            if (curBook.indexOf('dosto') !== -1) {
                this.dostoevsky.push(this.books[i]);
            }
            if (curBook.indexOf('nietzsche') !== -1) {
                this.nietzsche.push(this.books[i]);
            }
            if (curBook.indexOf('jung') !== -1) {
                this.jung.push(this.books[i]);
            }
            if (curBook.indexOf('hemingway') !== -1) {
                this.hemingway.push(this.books[i]);
            }
            if (curBook.indexOf('orwell') !== -1) {
                this.orwell.push(this.books[i]);
            }
            if (curBook.indexOf('tolstoy') !== -1) {
                this.tolstoy.push(this.books[i]);
            }
            if (curBook.indexOf('freud') !== -1) {
                this.freud.push(this.books[i]);
            }
        }
    }

    ngOnInit() {
        if (localStorage.getItem('books') == undefined || localStorage.getItem('read') == undefined) {
            localStorage.setItem('books', '');
            localStorage.setItem('read', '');
            this.processJson();
        } else {
            const junkBooks = localStorage.getItem('books').split('$');
            const junkRead = localStorage.getItem('read').split('$');
            for (let i = 0; i < junkBooks.length; i++) {
                if (junkRead[i] !== '0') {
                        ++this.readBooks;
                }
                this.books.push({
                    'book': junkBooks[i],
                    'read': junkRead[i]
                });
            }
            this.filterBooks();
        }
    }

}
