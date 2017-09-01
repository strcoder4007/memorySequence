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

    eventHandler(ev) {
        if(ev.keyCode == 13)
            this.login(this.username, this.password);
        else if(ev.keyCode == 27)
            this.emitFalseLogin();
    }

    login(username: string, password: string) {
        if(username == "str" && password == "programming!0!") {
            this.isLoggedIn = true;
            this.emitLoginStatus.emit(true);
            this.emitFalseLogin();
        }
        else {
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 1000);
            this.password = "";
            document.getElementById('focusPass').focus();            
        }
    }
    emitFalseLogin() {
        this.flogin.emit(false);
    }

    ngOnInit() {
        //document.getElementById('focusThis').focus();            
    }

}
