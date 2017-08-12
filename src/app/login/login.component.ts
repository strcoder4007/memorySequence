import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    @Input() isLoggedIn;
    @Output() flogin = new EventEmitter();
    @Output() emitLoginStatus = new EventEmitter();

    constructor() {
     }

    login(username: string, password: string) {
        if(username == "str" && password == "3yt8y98y5t394u20409g3h82g3") {      
            this.isLoggedIn = true;
            alert("emitted login status");
            this.emitLoginStatus.emit(true);
        }
    }
    emitFalseLogin() {
        this.flogin.emit(false);
    }

    ngOnInit() {
        document.getElementById('focusThis').focus();
    }

}
