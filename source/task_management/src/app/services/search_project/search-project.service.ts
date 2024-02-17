import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { projects } from '../../objects/Projects';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SearchProjectService {

  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Projects/GetByName';

  fetch_date(title : string) : Observable<projects[]>{
    return this.http.get<projects[]>(`${this.url}/${encodeURIComponent(title)}`);
  }
}
