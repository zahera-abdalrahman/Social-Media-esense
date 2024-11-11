import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { register } from '../DTOs/Register';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm!:FormGroup
  showPassword = false;
  showConfirmPassword = false;

  constructor(
              private accountService:AccountService,
              private formbuilder:FormBuilder,
              private router:Router
            ){}


  ngOnInit(): void {
    this.checkForm();
  }

  checkForm(){
    this.registerForm=this.formbuilder.group({
      txtfName:['',Validators.required],
      txtlName:['',Validators.required],
      txtEmail:['',Validators.compose([Validators.required,Validators.email])],
      txtDOB:['',Validators.required],
      txtGender:['',Validators.required],
      txtPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,}$/)
        ])
      ],
      txtConfirmPassword:['',[Validators.required,this.validateSamePassword]]
    });
  }

  addUser(){
    debugger
    if(this.registerForm.valid)
      {
        var user=new register();
        user.firstName=this.registerForm.value['txtfName'];
        user.lastName=this.registerForm.value['txtlName'];
        user.email=this.registerForm.value['txtEmail'];
        user.dob=this.registerForm.value['txtDOB'];
        user.gender=this.registerForm.value['txtGender'];
        user.password=this.registerForm.value['txtPassword'];
        user.confirmPassword=this.registerForm.value['txtConfirmPassword'];
     
        console.log('User data:', user);

      this.accountService.register(user).subscribe({
        next: data => {
          console.log('API Response:', data);
          if (data.message === 'User created successfully') {
            this.router.navigate(['/email'], { queryParams: { user: user.email } });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'User registered failed!',
            });
          }
        },
        error:err=>{
          console.error('Error Response:', err); 
        }
      });
    }
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('txtPassword');
    const confirmPassword = control.parent?.get('txtConfirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
}

togglePasswordVisibility(field: string) {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else if (field === 'confirmPassword') {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
}
