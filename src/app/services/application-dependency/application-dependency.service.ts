import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApplicationDependency, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationDependencyService implements ServiceInterface<ApplicationDependency> {
  private _path = '/applicationDependencies';
  public url: string;
  private _options: {
    headers: HttpHeaders
  };

  constructor(private http: HttpClient) {
    this.url = environment.serviceUrl + this._path;

    this._options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public findAll(): Observable<WinResponse<ApplicationDependency[]>> {
    return this.http.get<WinResponse<ApplicationDependency[]>>(this.url, this._options);
  }

  public filterAll(params: { name, value } []): Observable<WinResponse<ApplicationDependency[]>> {
    let requestUrl: string = this.url;

    for (let i = 0; i < params.length; i++) {
      const separator: string = (i === 0) ? '?' : '&';

      requestUrl = requestUrl + separator + params[i].name + '=' + params[i].value;
    }

    return this.http.get<WinResponse<ApplicationDependency[]>>(requestUrl, this._options);
  }

  public findOne(id: string): Observable<WinResponse<ApplicationDependency>> {
    return this.http.get<WinResponse<ApplicationDependency>>(this.url + '/' + id, this._options);
  }

  public create(applicationDependency: ApplicationDependency): Observable<WinResponse<ApplicationDependency>> {
    return this.http.post<WinResponse<ApplicationDependency>>(this.url, applicationDependency, this._options);
  }

  public update(applicationDependency: ApplicationDependency): Observable<WinResponse<ApplicationDependency>> {
    return this.http.put<WinResponse<ApplicationDependency>>(this.url + '/' + applicationDependency.id, applicationDependency, this._options);
  }

  public delete(applicationDependency: ApplicationDependency): Observable<WinResponse<ApplicationDependency>> {
    return this.http.delete<WinResponse<ApplicationDependency>>(this.url + '/' + applicationDependency.id, this._options);
  }

}
