import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { projects } from '../../objects/Projects';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UpdateProjectService {

  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Projects/Update";
  
  update_project(tk : projects, token : string):Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.url,tk,{headers : t});
  }
}
