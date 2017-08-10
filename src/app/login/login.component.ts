import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    @Output() loginData = new EventEmitter();
    @Output() flogin = new EventEmitter();

    constructor() {
     }

    login(username: string, password: string) {
        this.loginData.emit([username, password, false]);        
    }

    emitFalseLogin() {
        this.flogin.emit(false);
    }

    ngOnInit() {
        document.getElementById('focusThis').focus();
    }

}
