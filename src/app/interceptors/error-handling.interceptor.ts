import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        debugger
        let msg = '';
        switch (error.status) {
          case 404:
            this.router.navigate(['/error404']);
            break;

          case 401:
            if(error.error.statusCode !="Login_Failed" && error.error.statusCode !="UserNotFound" && error.error.statusCode !="NotVarified"){
            this.router.navigate(['/error401']);
            }
            break;

          default:
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Something went wrong",
              showConfirmButton: false,
              timer: 5000
            });
        }
        return throwError(error);
      })
    );
  }
}
