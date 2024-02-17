import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectByIDService {

  url_Get = "https://localhost:7194/api/Projects/getbyID";
  http = inject(HttpClient);
  constructor() { }

  fetch_data(projectID : number, token : string) : Observable<any> {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.url_Get}/${projectID}`,{headers : t});
  }
}
