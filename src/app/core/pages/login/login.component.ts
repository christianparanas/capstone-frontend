import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginAcctType: String = 'student';

  constructor() {}

  ngOnInit(): void {}

  changeLoginAcctType(type: string) {
    switch (type) {
      case 'student':
        this.loginAcctType = 'student';
        break;

      case 'faculty':
        this.loginAcctType = 'faculty';
        break;

      case 'admin':
        this.loginAcctType = 'admin';
        break;

      default:
        break;
    }
  }
}
