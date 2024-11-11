import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { like } from '../DTOs/Like';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  baseurl=''

  constructor(private client:HttpClient) {
    this.baseurl=environment.apiUrl
   }
    
  createLike(like:like):Observable<any>{
    return this.client.post(`${this.baseurl}/api/Like`,like)
  }

  removeLike(postId: number): Observable<any> {
    debugger
    return this.client.delete(`${this.baseurl}/api/Like?id=${postId}`);
  }


  getAllLike(): Observable<any> {
    return this.client.get(`${this.baseurl}/api/Like`);
  }

  toggleLike(postId:number,userId:string): Observable<any>{
    debugger
    return this.client.post(`${this.baseurl}/api/Like/ToggleLike?postId=${postId}&userId=${userId}`,{})
  }

  likePerPost(id:number): Observable<any>{
    return this.client.get(`${this.baseurl}/api/Like/likePerPost?id=${id}`);
    
  }


}
