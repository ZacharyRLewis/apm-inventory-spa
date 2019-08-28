import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApplicationWorkflowStatus, WinResponse} from '../../model';
import {ServiceInterface} from '../service.interface';

@Injectable()
export class ApplicationWorkflowStatusService implements ServiceInterface<ApplicationWorkflowStatus> {
  private _path = '/applicationWorkflowStatuses';
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

  public findAll(): Observable<WinResponse<ApplicationWorkflowStatus[]>> {
    return this.http.get<WinResponse<ApplicationWorkflowStatus[]>>(this.url, this._options);
  }

  public findOne(id: string): Observable<WinResponse<ApplicationWorkflowStatus>> {
    return this.http.get<WinResponse<ApplicationWorkflowStatus>>(this.url + '/' + id, this._options);
  }

  public create(workflowStatus: ApplicationWorkflowStatus): Observable<WinResponse<ApplicationWorkflowStatus>> {
    return this.http.post<WinResponse<ApplicationWorkflowStatus>>(this.url, workflowStatus, this._options);
  }

  public update(workflowStatus: ApplicationWorkflowStatus): Observable<WinResponse<ApplicationWorkflowStatus>> {
    return this.http.put<WinResponse<ApplicationWorkflowStatus>>(this.url + '/' + workflowStatus.id, workflowStatus, this._options);
  }

  public delete(workflowStatus: ApplicationWorkflowStatus): Observable<WinResponse<ApplicationWorkflowStatus>> {
    return this.http.delete<WinResponse<ApplicationWorkflowStatus>>(this.url + '/' + workflowStatus.id, this._options);
  }
}
