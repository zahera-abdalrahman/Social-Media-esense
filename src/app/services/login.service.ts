import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { login } from '../DTOs/Login';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseurl=''

  constructor(private client:HttpClient) {
    this.baseurl=environment.apiUrl
   }

  Login(loginUser:login):Observable<any>{
    return this.client.post(`${this.baseurl}/api/Account/Login`,loginUser)
  }


}
