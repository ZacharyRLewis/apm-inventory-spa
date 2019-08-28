import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApplicationWorkflow, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationWorkflowService implements ServiceInterface<ApplicationWorkflow> {
  private _path = '/applicationWorkflows';
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

  public findAll(): Observable<WinResponse<ApplicationWorkflow[]>> {
    return this.http.get<WinResponse<ApplicationWorkflow[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<ApplicationWorkflow>> {
    return this.http.get<WinResponse<ApplicationWorkflow>>(this.url + '/' + id, this._options);
  }

  public create(applicationWorkflow: ApplicationWorkflow): Observable<WinResponse<ApplicationWorkflow>> {
    return this.http.post<WinResponse<ApplicationWorkflow>>(this.url, applicationWorkflow, this._options);
  }

  public update(applicationWorkflow: ApplicationWorkflow): Observable<WinResponse<ApplicationWorkflow>> {
    return this.http.put<WinResponse<ApplicationWorkflow>>(this.url + '/' + applicationWorkflow.id, applicationWorkflow, this._options);
  }

  public delete(applicationWorkflow: ApplicationWorkflow): Observable<WinResponse<ApplicationWorkflow>> {
    return this.http.delete<WinResponse<ApplicationWorkflow>>(this.url + '/' + applicationWorkflow.id, this._options);
  }
}
