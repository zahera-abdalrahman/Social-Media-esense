import { Component, OnInit } from '@angular/core';
import { user } from '../DTOs/User';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  loggedinUser!:user

  constructor(private accountService:AccountService,private router:Router){}

  ngOnInit(): void {
    const storedUserInfo = localStorage.getItem('SocialMediaUser');
    this.loggedinUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    console.log("User"+this.loggedinUser);
    

  }

logout(){
  localStorage.removeItem('SecurityKey')
  localStorage.removeItem('SocialMediaUser')
  this.router.navigate(['/'])
}


}
