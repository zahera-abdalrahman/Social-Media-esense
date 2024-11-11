import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../DTOs/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { updateProfile } from '../DTOs/updateProfile';
import Swal from 'sweetalert2';
import { data } from 'jquery';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  loggedinUser!:user
  userProfile!:updateProfile
  updateForm!:FormGroup
  profileImageUrl:any
  coverImageUrl:any

  userInfo!:any

  constructor(private activeRouter: ActivatedRoute,
              private accountService:AccountService,
              private formbuilder:FormBuilder,
              private router:Router,
  ){}


  ngOnInit(): void {
    debugger
    const storedUserInfo = localStorage.getItem('SocialMediaUser');
    this.loggedinUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    console.log("User"+this.loggedinUser);
    this.getUser();

    this.checkForm();
    
    
  }

  getUser(){
    this.accountService.getUserInfo(this.loggedinUser.id).subscribe({
      next:data=>{
        this.userInfo=data
        this.putUserValues();
      }
    })

    }
  

  
  checkForm(){
    this.updateForm=this.formbuilder.group({
      txtfName:[''],
      txtlName:[''],
      profileImg:[''],
      coverImg:[''],
      txtOldPassword:[''],
      txtNewPassword:[''],
      txtConfirmPassword:['']
    });
  }


  putUserValues(){
    debugger
    this.updateForm.controls['txtfName'].setValue(this.userInfo.firstName)
    this.updateForm.controls['txtlName'].setValue(this.userInfo.lastName)
    this.updateForm.controls['profileImg'].setValue(this.userInfo.profileImage)
    this.updateForm.controls['coverImg'].setValue(this.userInfo.coverImage)
    this.updateForm.controls['txtOldPassword'].setValue('')
    this.updateForm.controls['txtNewPassword'].setValue('')
    this.updateForm.controls['txtConfirmPassword'].setValue('')

  }



  edit() {
    debugger
    const newInfo = new updateProfile();
    newInfo.firstName = this.updateForm.controls['txtfName'].value;
    newInfo.lastName = this.updateForm.controls['txtlName'].value;
    newInfo.profileImage = this.profileImageUrl;
    newInfo.coverImage = this.coverImageUrl;
    newInfo.currentPassword = this.updateForm.controls['txtOldPassword'].value;
    newInfo.newPassword = this.updateForm.controls['txtNewPassword'].value;
    newInfo.confirmPassword = this.updateForm.controls['txtConfirmPassword'].value;
  
    console.log("New user info", newInfo);
  
    this.accountService.updateProfile(newInfo, this.userInfo.id).subscribe({
      next: (data) => {
        debugger
        console.log('API Response:', data);
        console.log("User updated successfully");
        
        this.accountService.getUserInfo(this.userInfo.id).subscribe({
          next:data=>{
            debugger
            console.log(data);
            localStorage.setItem('SocialMediaUser',JSON.stringify(data));
            this.router.navigate(['/dashboard/profile']);
          },
          error:()=>{
            console.log("error happened");              
          }
        });
      },
      error: (err) => {
        console.error('Error updating user profile:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating your profile. Please try again later.'
        });
      }
    });
  }
  

  //Image upload
  onfileProfileSelected(file:any){
    debugger
    if (file.target.files && file.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);
      reader.onload = (_event) => {
        this.profileImageUrl = reader.result;
      };
    }
  }


  onfileCoverSelected(file:any){
    debugger
    if (file.target.files && file.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);
      reader.onload = (_event) => {
        this.coverImageUrl = reader.result;
      };
    }
  }

  

}