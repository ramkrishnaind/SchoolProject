import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { LoadingService } from '../service/loading.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private loader: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.loader.show();
    // let currentUser = this.authenticationService.currentUserValue;
    // if (currentUser && currentUser.token) {
    //     request = request.clone({
    //         setHeaders: { 
    //             Authorization: `Bearer ${currentUser.token}`
    //         }
    //     });
    // }

    return next.handle(request).pipe(
      finalize(() => {
        this.loader.hide();
      })
    );
  }
}
