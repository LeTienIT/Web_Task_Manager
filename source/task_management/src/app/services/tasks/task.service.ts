import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { task } from '../../objects/Task';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Tasks/GetListTask';

  fetch_date(projectID : number , token : string) : Observable<task[]>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<task[]>(`${this.url}/${projectID}`,{headers : t});
  }
}
