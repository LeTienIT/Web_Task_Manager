import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tasks } from '../../objects/Tasks';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UpdateTaskService {
  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Tasks/updateTask";
  
  update_task(tk : tasks, token : string):Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.url,tk,{headers : t});
  }
}
