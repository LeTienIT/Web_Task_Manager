import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tasks } from '../../objects/Tasks';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskDetailService {
  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Tasks/GetTaskDetail';

  fetch_date(taskID : number , token : string) : Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.url}/${taskID}`,{headers : t});
  }
}
