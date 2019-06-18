import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {WinResponse} from '../../model/';
import {Permissions} from '../../model/permissions';

@Injectable()
export class PermissionsService {
  private _path = '/permissions';
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

  public findUserPermissions(): Observable<WinResponse<Permissions>> {
    return this.http.get<WinResponse<Permissions>>(this.url, this._options);
  }
}
