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
    myBookList = [
        { title: 'Jack London: The Call of the Wild', date: 'JUN15', pageCount: '', read: 'yes'},
        { title: 'J.D. Salinger: The Catcher in the Rye', date: 'JUL17', pageCount: '', read: 'yes'},
        { title: 'Mark Manson: The Subtle Art of Not Giving a Fuck', date: 'JAN18', pageCount: '', read: 'yes'},
        { title: 'R.L. Stevenson: Strange Case of Dr Jekyll and Mr Hyde', date: 'JAN18', pageCount: '', read: 'yes'},
        { title: 'Fyodor Dostoevsky: Notes from the Underground', date: 'FEB18', pageCount: '', read: 'yes'},
        { title: 'Ernest Hemingway: The Old Man and the Sea', date: 'FEB18', pageCount: '', read: 'yes'},
        { title: 'Fyodor Dostoevsky: Crime and Punishment', date: 'APR18', pageCount: '', read: 'yes'},
        { title: 'George Orwell: Animal Farm', date: 'AUG18', pageCount: '', read: 'yes'},
        { title: 'George Orwell: Down and Out in Paris and London', date: 'AUG18', pageCount: '', read: 'yes'},
        { title: 'George Orwell: 1984', date: '', pageCount: '', read: 'no'},
        { title: 'Albert Camus: The Stranger', date: 'JUL18', pageCount: '', read: 'yes'},
        { title: 'Fyodor Dostoevsky: The Idiot', date: '', pageCount: '', read: 'no'},
        { title: 'Jean Paul Sartre: Nausea', date: 'AUG18', pageCount: '', read: 'yes'},
        { title: 'Albert Camus: The Myth of Sisyphus', date: '', pageCount: '', read: 'no'}
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
        this.dostoevsky = [], this.nietzsche = [], this.jung = [], this.hemingway = [], this.orwell = [], this.tolstoy = [], this.freud = [];
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




    bookApi() {
        for (let i = 0; i < this.myBookList.length; i++) {
            let author = '';
            let pageCount = '';
            let bookTitle = this.myBookList[i].title.replace('–', ':').split(':')[1].replace(' ', '').replace(/ /g, '+').toLowerCase();
            this
            .getPosts('https://www.googleapis.com/books/v1/volumes?q='+bookTitle)
            .subscribe(data => {
                for(let j = 0; j < data['items'].length; j++) {
                    if(data['items'][j]['volumeInfo'].pageCount != undefined) {
                        //console.log(j, "undefined so giving it a value of " + data['items'][j]['volumeInfo']['authors'][0]);
                        pageCount = data['items'][j]['volumeInfo'].pageCount;
                        author = data['items'][j]['volumeInfo']['authors'][0];
                        break;
                    }
                }
                //this.readBooksList[i].pageCount = pageCount;
                this.myBookList[i].pageCount = data['items'][1]['volumeInfo'].pageCount
            });
        }
        setTimeout(function() {            
            localStorage.setItem('myBookList', JSON.stringify(this.myBookList));
        }, 5000);
    }








    ngOnInit() {
        if(localStorage.getItem('myBookList') == undefined || localStorage.getItem('myBookList').length < 20) {
            localStorage.setItem('myBookList', '');
            this.bookApi();
        }
        else {
            this.myBookList = JSON.parse(localStorage.getItem('myBookList'));
        }
        
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
