import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DeploymentDatabase, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class DeploymentDatabaseService implements ServiceInterface<DeploymentDatabase> {
  private _path = '/deploymentDatabases';
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

  public findAll(): Observable<WinResponse<DeploymentDatabase[]>> {
    return this.http.get<WinResponse<DeploymentDatabase[]>>(this.url, this._options);
  }

  public filterAll(params: { name, value } []): Observable<WinResponse<DeploymentDatabase[]>> {
    let requestUrl: string = this.url;

    for (let i = 0; i < params.length; i++) {
      const separator: string = (i === 0) ? '?' : '&';

      requestUrl = requestUrl + separator + params[i].name + '=' + params[i].value;
    }

    return this.http.get<WinResponse<DeploymentDatabase[]>>(requestUrl, this._options);
  }

  public findAllByDeploymentId(deploymentId: string): Observable<WinResponse<DeploymentDatabase[]>> {
    return this.http.get<WinResponse<DeploymentDatabase[]>>(this.url + '?deploymentId=' + deploymentId, this._options);
  }

  public findOne(id: string): Observable<WinResponse<DeploymentDatabase>> {
    return this.http.get<WinResponse<DeploymentDatabase>>(this.url + '/' + id, this._options);
  }

  public create(deploymentDatabase: DeploymentDatabase): Observable<WinResponse<DeploymentDatabase>> {
    return this.http.post<WinResponse<DeploymentDatabase>>(this.url, deploymentDatabase, this._options);
  }

  public update(deploymentDatabase: DeploymentDatabase): Observable<WinResponse<DeploymentDatabase>> {
    return this.http.put<WinResponse<DeploymentDatabase>>(this.url + '/' + deploymentDatabase.id, deploymentDatabase, this._options);
  }

  public delete(deploymentDatabase: DeploymentDatabase): Observable<WinResponse<DeploymentDatabase>> {
    return this.http.delete<WinResponse<DeploymentDatabase>>(this.url + '/' + deploymentDatabase.id, this._options);
  }
}
