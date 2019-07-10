import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Application, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationService implements ServiceInterface<Application> {
  private _path = '/applications';
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

  public findAll(): Observable<WinResponse<Application[]>> {
    return this.http.get<WinResponse<Application[]>>(this.url, this._options);
  }

  public filterAll(params: { name, value } []): Observable<WinResponse<Application[]>> {
    let requestUrl: string = this.url;

    for (let i = 0; i < params.length; i++) {
      const separator: string = (i === 0) ? '?' : '&';

      requestUrl = requestUrl + separator + params[i].name + '=' + params[i].value;
    }

    return this.http.get<WinResponse<Application[]>>(requestUrl, this._options);
  }

  public findOne(id: string): Observable<WinResponse<Application>> {
    return this.http.get<WinResponse<Application>>(this.url + '/' + id, this._options);
  }

  public create(application: Application): Observable<WinResponse<Application>> {
    return this.http.post<WinResponse<Application>>(this.url, application, this._options);
  }

  public update(application: Application): Observable<WinResponse<Application>> {
    return this.http.put<WinResponse<Application>>(this.url + '/' + application.id, application, this._options);
  }

  public delete(application: Application): Observable<WinResponse<Application>> {
    return this.http.delete<WinResponse<Application>>(this.url + '/' + application.id, this._options);
  }
}
