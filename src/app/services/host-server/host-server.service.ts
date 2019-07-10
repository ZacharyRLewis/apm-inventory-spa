import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HostServer, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class HostServerService implements ServiceInterface<HostServer> {
  private _path = '/hostServers';
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

  public findAll(): Observable<WinResponse<HostServer[]>> {
    return this.http.get<WinResponse<HostServer[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<HostServer>> {
    return this.http.get<WinResponse<HostServer>>(this.url + '/' + id, this._options);
  }

  public create(hostServer: HostServer): Observable<WinResponse<HostServer>> {
    return this.http.post<WinResponse<HostServer>>(this.url, hostServer, this._options);
  }

  public update(hostServer: HostServer): Observable<WinResponse<HostServer>> {
    return this.http.put<WinResponse<HostServer>>(this.url + '/' + hostServer.id, hostServer, this._options);
  }

  public delete(hostServer: HostServer): Observable<WinResponse<HostServer>> {
    return this.http.delete<WinResponse<HostServer>>(this.url + '/' + hostServer.id, this._options);
  }
}
