import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Database, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DatabaseService implements ServiceInterface<Database> {
  private _path = '/databases';
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

  public findAll(): Observable<WinResponse<Database[]>> {
    return this.http.get<WinResponse<Database[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<Database>> {
    return this.http.get<WinResponse<Database>>(this.url + '/' + id, this._options);
  }

  public create(database: Database): Observable<WinResponse<Database>> {
    return this.http.post<WinResponse<Database>>(this.url, database, this._options);
  }

  public update(database: Database): Observable<WinResponse<Database>> {
    return this.http.put<WinResponse<Database>>(this.url + '/' + database.id, database, this._options);
  }

  public delete(database: Database): Observable<WinResponse<Database>> {
    return this.http.delete<WinResponse<Database>>(this.url + '/' + database.id, this._options);
  }
}
