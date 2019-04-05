import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Deployment, WinResponse} from '../../model/';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DeploymentService implements ServiceInterface<Deployment> {
  private _path = '/deployments';
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

  public findAll(): Observable<WinResponse<Deployment[]>> {
    return this.http.get<WinResponse<Deployment[]>>(this.url, this._options);
  }

  public filterAll(params: { name, value } []): Observable<WinResponse<Deployment[]>> {
    let requestUrl: string = this.url;

    for (let i = 0; i < params.length; i++) {
      const separator: string = (i === 0) ? '?' : '&';

      requestUrl = requestUrl + separator + params[i].name + '=' + params[i].value;
    }

    return this.http.get<WinResponse<Deployment[]>>(requestUrl, this._options);
  }

  public findAllByApplicationId(applicationId: string): Observable<WinResponse<Deployment[]>> {
    return this.http.get<WinResponse<Deployment[]>>(this.url + '?applicationId=' + applicationId, this._options);
  }

  public findOne(id: string): Observable<WinResponse<Deployment>> {
    return this.http.get<WinResponse<Deployment>>(this.url + '/' + id, this._options);
  }

  public create(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return this.http.post<WinResponse<Deployment>>(this.url, deployment, this._options);
  }

  public update(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return this.http.put<WinResponse<Deployment>>(this.url + '/' + deployment.id, deployment, this._options);
  }

  public delete(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return this.http.delete<WinResponse<Deployment>>(this.url + '/' + deployment.id, this._options);
  }

  public findAllHostServers(): Observable<WinResponse<string[]>> {
    return this.http.get<WinResponse<string[]>>(this.url + '/hostServers', this._options);
  }
}
