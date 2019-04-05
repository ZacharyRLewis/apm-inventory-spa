import {Observable} from 'rxjs';
import {WinResponse} from '../model';

export interface ServiceInterface<T> {
  findAll(): Observable<WinResponse<T[]>>;

  findOne(id): Observable<WinResponse<T>>;

  create(thing: T): Observable<WinResponse<T>>;

  update(thing: T): Observable<WinResponse<T>>;

  delete(thing: T): Observable<WinResponse<T>>;
}
