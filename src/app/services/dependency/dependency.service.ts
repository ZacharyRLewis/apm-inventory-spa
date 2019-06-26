import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Dependency, WinResponse} from '../../model';
import {DependencyRefresh} from '../../model/dependency-refresh';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DependencyService implements ServiceInterface<Dependency> {
  private _path = '/dependencies';
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

  public refreshDependencies(refresh: DependencyRefresh): Observable<WinResponse<Dependency[]>> {
    return this.http.post<WinResponse<Dependency[]>>(this.url + '/refreshes', refresh, this._options);
  }
}
