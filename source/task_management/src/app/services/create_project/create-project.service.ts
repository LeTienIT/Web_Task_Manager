import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { projects } from '../../objects/Projects';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  private url="https://localhost:7194/api/Projects";
  private http = inject(HttpClient);

  create_project(p:projects,token:string):Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url,p,{headers : t});
  }
}
