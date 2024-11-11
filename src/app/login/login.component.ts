import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { login } from '../DTOs/Login';
import Swal from 'sweetalert2';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private formbuilder: FormBuilder,
    private accountService:AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    debugger
    this.router.navigate(['/'])
    this.checkForm();
  }

  checkForm() {
    this.loginForm = this.formbuilder.group({
      txtEmail: ['', [Validators.required, Validators.email]],
      txtPassword: ['', Validators.required],
    });
  }

  logIn() {
    if (this.loginForm.valid) {
      const user = new login();
      user.email = this.loginForm.value['txtEmail'];
      user.password = this.loginForm.value['txtPassword'];

      this.loginService.Login(user).subscribe({
        next: data => {
          localStorage.setItem('SecurityKey', data.token);

          this.accountService.getLoggedInUserInfo(this.loginForm.value['txtEmail']).subscribe({
            next: data => {
              localStorage.setItem('SocialMediaUser', JSON.stringify(data));
              this.router.navigate(['/dashboard/Home']);
            },
            error: () => {
              debugger
              console.log("Error fetching user info.");
            }
          });
        },
        error: err => {
          if(err.error.statusCode=='Login_Failed')
          {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid email or password. Please try again.',
              confirmButtonText: 'Retry'
            });
          }
          else if(err.error.statusCode=='NotVarified')
          {
               Swal.fire({
              icon: 'warning',
              title: 'Account Not Verified',
              text: 'Please verify your email before logging in.',
              confirmButtonText: 'OK'
            });
          }

        }
      });
    }
  }
}
