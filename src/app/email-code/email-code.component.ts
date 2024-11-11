import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-email-code',
  templateUrl: './email-code.component.html',
  styleUrls: ['./email-code.component.css']
})
export class EmailCodeComponent implements OnInit {
  @ViewChild('code') code!: ElementRef;
  vervicationCode!: string;
  emailUser!: any;
  activeUser!: any;

  constructor(
    private activeRouter: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activeUser = this.activeRouter.snapshot.queryParams['user'];
  }

  getUser(): void {
    this.vervicationCode = this.code.nativeElement.value;
    this.accountService.getLoggedInUserInfo(this.activeUser).subscribe({
      next: (data) => {
        this.emailUser = data;
        console.log(this.emailUser);   
        console.log(this.vervicationCode);
        
        // Check if the entered code matches the expected code
        if (this.emailUser.confirmationCode === this.vervicationCode) {
          // If the code matches, verify the user
          this.accountService.updateVerficateUser(this.activeUser).subscribe({
            next: (data) => {
              // Navigate to login page after successful verification
              this.router.navigate(['/Login']);
            },
            error: (err) => {
              console.error('Error updating user verification', err);
            }
          });
        } else {
          // If the code doesn't match, show an error using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Invalid Verification Code',
            text: 'The verification code you entered is incorrect. Please try again.',
            confirmButtonText: 'Ok'
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user info', err);
      }
    });
  }
}
