import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { task } from '../../objects/Task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskService {
  private url="https://localhost:7194/api/Tasks";
  private http = inject(HttpClient);

  create_task(p:task[],token:string):Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url,p,{headers : t});
  }
}
