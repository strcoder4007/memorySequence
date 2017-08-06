import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    @Input ('isLoggedIn') isLoggedIn;
    @Input ('inLogin') inLogin;
    constructor() { }

    login(uname: string, pword: string) {
        if(uname == "str" && pword == "3yt8y98y5t394u20409g3h82g3") {
            this.isLoggedIn = true;
            this.inLogin = false;
        }
    }

    ngOnInit() {
        document.getElementById('focusThis').focus();
        console.log(this.inLogin);
    }

}
