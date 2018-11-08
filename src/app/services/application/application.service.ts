import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Application, WinResponse} from '../../model/';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationService implements ServiceInterface<Application> {
  private _path = '/applications/';
  public url: string;
  private _options: {
    headers: HttpHeaders
  };

  constructor(private http: HttpClient) {
    // this._url = '__APM_INVENTORY_SERVICE_URL__' + this._path;
    this.url = 'http://localhost:8181/apm' + this._path;
    // this.url = 'http://apm-inventory-service:8181/apm' + this._path;

    this._options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public findAll(): Observable<WinResponse<Application[]>> {
    return this.http.get<WinResponse<Application[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<Application>> {
    return this.http.get<WinResponse<Application>>(this.url + id, this._options);
  }

  public create(application: Application): Observable<WinResponse<Application>> {
    return this.http.post<WinResponse<Application>>(this.url, application, this._options);
  }

  public update(application: Application): Observable<WinResponse<Application>> {
    return this.http.put<WinResponse<Application>>(this.url + application.id, application, this._options);
  }

  public delete(application: Application): Observable<WinResponse<Application>> {
    return this.http.delete<WinResponse<Application>>(this.url + application.id, this._options);
  }
}
