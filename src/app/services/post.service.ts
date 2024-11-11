import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { post } from '../DTOs/Post';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseurl=''

  constructor(private client:HttpClient) {
    this.baseurl=environment.apiUrl
   }

  getAllPost():Observable<any>{
    return this.client.get(`${this.baseurl}/api/Post/getAll`)
  }

  createPost(post:post):Observable<any>{
    return this.client.post(`${this.baseurl}/api/Post`,post)
  }

  getPostByUserId(userId:string):Observable<any>{
    return this.client.get(`${this.baseurl}/api/Post/getPostBuUserId?id=${userId}`)
  }



}
