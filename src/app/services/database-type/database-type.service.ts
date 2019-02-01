import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DatabaseType, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DatabaseTypeService implements ServiceInterface<DatabaseType> {
  private _path = '/databaseTypes';
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

  public findAll(): Observable<WinResponse<DatabaseType[]>> {
    return this.http.get<WinResponse<DatabaseType[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<DatabaseType>> {
    return this.http.get<WinResponse<DatabaseType>>(this.url + '/' + id, this._options);
  }

  public create(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return this.http.post<WinResponse<DatabaseType>>(this.url, databaseType, this._options);
  }

  public update(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return this.http.put<WinResponse<DatabaseType>>(this.url + '/' + databaseType.id, databaseType, this._options);
  }

  public delete(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return this.http.delete<WinResponse<DatabaseType>>(this.url + '/' + databaseType.id, this._options);
  }
}
