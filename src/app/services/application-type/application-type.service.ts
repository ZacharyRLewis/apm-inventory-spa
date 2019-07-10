import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApplicationType, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationTypeService implements ServiceInterface<ApplicationType> {
  private _path = '/applicationTypes';
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

  public findAll(): Observable<WinResponse<ApplicationType[]>> {
    return this.http.get<WinResponse<ApplicationType[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<ApplicationType>> {
    return this.http.get<WinResponse<ApplicationType>>(this.url + '/' + id, this._options);
  }

  public create(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return this.http.post<WinResponse<ApplicationType>>(this.url, applicationType, this._options);
  }

  public update(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return this.http.put<WinResponse<ApplicationType>>(this.url + '/' + applicationType.id, applicationType, this._options);
  }

  public delete(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return this.http.delete<WinResponse<ApplicationType>>(this.url + '/' + applicationType.id, this._options);
  }
}
