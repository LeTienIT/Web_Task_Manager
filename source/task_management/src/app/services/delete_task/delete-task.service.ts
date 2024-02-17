import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteTaskService {

  private url= "https://localhost:7194/api/Tasks"; 
  private http = inject(HttpClient);
  
  delete_task(taskID : number, token : string) : Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.url}/${taskID}`, {headers : t});
  }
}
