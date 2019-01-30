import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Dependency, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DependencyService implements ServiceInterface<Dependency> {
  private _path = '/dependencies';
  public url: string;
  private _options: {
    headers: HttpHeaders
  };

  constructor(private http: HttpClient) {
    // this._url = '__APM_INVENTORY_SERVICE_URL__' + this._path;
    this.url = 'http://localhost:8181/apm' + this._path;

    this._options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public findAll(): Observable<WinResponse<Dependency[]>> {
    return this.http.get<WinResponse<Dependency[]>>(this.url, this._options);
  }

  public findAllByApplicationId(applicationId: string): Observable<WinResponse<Dependency[]>> {
    return this.http.get<WinResponse<Dependency[]>>(this.url + '?applicationId=' + applicationId, this._options);
  }

  public findOne(id: string): Observable<WinResponse<Dependency>> {
    return this.http.get<WinResponse<Dependency>>(this.url + '/' + id, this._options);
  }

  public create(dependency: Dependency): Observable<WinResponse<Dependency>> {
    return this.http.post<WinResponse<Dependency>>(this.url, dependency, this._options);
  }

  public update(dependency: Dependency): Observable<WinResponse<Dependency>> {
    return this.http.put<WinResponse<Dependency>>(this.url + '/' + dependency.id, dependency, this._options);
  }

  public delete(dependency: Dependency): Observable<WinResponse<Dependency>> {
    return this.http.delete<WinResponse<Dependency>>(this.url + '/' + dependency.id, this._options);
  }

  public uploadDependencies(event, applicationId): Promise<WinResponse<Dependency[]>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('file', event.files[0], event.files[0].name);
      formData.append('applicationId', applicationId);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', this.url + '/upload', true);
      xhr.withCredentials = false;
      xhr.send(formData);
    });
  }
}
