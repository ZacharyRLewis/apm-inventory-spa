import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class ServiceInterceptor implements HttpInterceptor {

  private headers = new HttpHeaders({
    'client_id': environment.mulesoftClientId,
    'client_secret': environment.mulesoftClientSecret
  });

  private devHeaders = new HttpHeaders({
    'iv-user': 'test',
    'iv-groups': '"CN=apm_admin,OU=ApplicationGroup,OU=Groups,DC=winwholesale,DC=com", "Test"',
    'client_id': environment.mulesoftClientId,
    'client_secret': environment.mulesoftClientSecret
  });

  constructor(private router: Router) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const requestHeaders = (environment.env === 'local' || environment.env === 'dev') ? this.devHeaders : this.headers;

    const clonedRequest: HttpRequest<any> = req.clone({
      headers: requestHeaders
    });

    return next.handle(clonedRequest)
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          // Successful request
        }
      }, error => {
        if (error.status === 401) {
          console.log('401 - Unauthorized');
          this.forceReload();
        }
      }));
  }

  private forceReload(): void {
    this.router.navigateByUrl('/');
    window.location.reload(true);
  }
}
