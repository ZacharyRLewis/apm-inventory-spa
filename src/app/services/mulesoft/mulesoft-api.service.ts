import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MulesoftApi, WinResponse} from '../../model';

@Injectable()
export class MulesoftApiService {
  private _path = '/mulesoft/apis';
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

  public findAll(): Observable<WinResponse<MulesoftApi[]>> {
    return this.http.get<WinResponse<MulesoftApi[]>>(this.url, this._options);
  }

  public filterAll(params: { name, value } []): Observable<WinResponse<MulesoftApi[]>> {
    let requestUrl: string = this.url;

    for (let i = 0; i < params.length; i++) {
      const separator: string = (i === 0) ? '?' : '&';

      requestUrl = requestUrl + separator + params[i].name + '=' + params[i].value;
    }

    return this.http.get<WinResponse<MulesoftApi[]>>(requestUrl, this._options);
  }
}
