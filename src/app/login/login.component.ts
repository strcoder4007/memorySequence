import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    showError: boolean = false;
    @Input() isLoggedIn;
    @Output() flogin = new EventEmitter();
    @Output() emitLoginStatus = new EventEmitter();

    constructor() {
     }

    login(username: string, password: string) {
        if(username == "str" && password == "3yt8y98y5t394u20409g3h82g3") {      
            this.isLoggedIn = true;
            this.emitLoginStatus.emit(true);
        }
        else {
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 1000);
            this.username = "";
            this.password = "";
        }
    }
    emitFalseLogin() {
        this.flogin.emit(false);
    }

    ngOnInit() {
        //document.getElementById('focusThis').focus();
    }

}
