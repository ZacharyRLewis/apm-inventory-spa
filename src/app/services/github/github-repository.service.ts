import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {GithubRepository, WinResponse} from '../../model';

@Injectable()
export class GithubRepositoryService {
  private _path = '/github/repositories';
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

  public findAll(): Observable<WinResponse<GithubRepository[]>> {
    return this.http.get<WinResponse<GithubRepository[]>>(this.url, this._options);
  }

  public create(repository: GithubRepository): Observable<WinResponse<GithubRepository>> {
    return this.http.post<WinResponse<GithubRepository>>(this.url, repository, this._options);
  }
}
