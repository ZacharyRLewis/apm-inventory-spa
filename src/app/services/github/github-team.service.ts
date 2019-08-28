import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {GithubTeam, WinResponse} from '../../model';

@Injectable()
export class GithubTeamService {
  private _path = '/github/teams';
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

  public findAll(): Observable<WinResponse<GithubTeam[]>> {
    return this.http.get<WinResponse<GithubTeam[]>>(this.url, this._options);
  }
}
