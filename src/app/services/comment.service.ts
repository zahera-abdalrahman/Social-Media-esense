import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { comment } from '../DTOs/Comment';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseurl=''

  constructor(private client:HttpClient) {
    this.baseurl=environment.apiUrl
   }

  createComment(comment:comment):Observable<any>{
    return this.client.post(`${this.baseurl}/api/Comment`,comment)
  }
}
