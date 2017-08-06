import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @Input ('isLoggedIn') isLoggedIn;
    @Input ('inLogin') inLogin;
    @Input ('username') username;
    @Input ('password') password;


    constructor() { }

    ngOnInit() {
        document.getElementById('focusThis').focus();
    }

}
