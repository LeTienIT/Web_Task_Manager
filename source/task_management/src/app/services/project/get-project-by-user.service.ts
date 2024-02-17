import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { projects } from '../../objects/Projects';
@Injectable({
  providedIn: 'root'
})
export class GetProjectByUserService {
  
  url_Get = "https://localhost:7194/api/Projects";
  http = inject(HttpClient);
  constructor() { }

  fetch_data(id : number, token : string) : Observable<projects[]> {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<projects[]>(`${this.url_Get}/${id}`,{headers : t});
  }
}
