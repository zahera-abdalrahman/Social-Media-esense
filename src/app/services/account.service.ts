import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { register } from '../DTOs/Register'
import { Observable } from 'rxjs';
import { updateProfile } from '../DTOs/updateProfile';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl=''

  constructor(private client:HttpClient) {
    this.baseurl=environment.apiUrl
   }

  register(user:register):Observable<any>{
    return this.client.post(`${this.baseurl}/api/Account/SignUp`,user)
  }

  getUserInfo(id:string):Observable<any>{
    return this.client.get(`${this.baseurl}/api/Account/userInfo?id=${id}`)
  }


  getLoggedInUserInfo(username:string):Observable<any>{
    return this.client.get(`${this.baseurl}/api/Account/finduser?username=${username}`)
  }
  
  updateProfile(updateProfileDTO: updateProfile,id:string): Observable<any> {
    debugger
    return this.client.put(`${this.baseurl}/api/Account?id=${id}`, updateProfileDTO);
  }

  updateVerficateUser(username:string):Observable<any>{
    debugger
  return this.client.put(`${this.baseurl}/api/Account/updateVerficate?username=${username}`,{});
  }
}
