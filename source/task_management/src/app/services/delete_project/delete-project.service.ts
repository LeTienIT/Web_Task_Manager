import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteProjectService {

  private url= "https://localhost:7194/api/Projects/Delete_Project"; 
  private http = inject(HttpClient);
  
  delete_project(projectID : number, token : string) : Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.url}/${projectID}`, {headers : t});
  }
}
