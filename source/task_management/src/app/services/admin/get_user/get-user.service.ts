import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../objects/Users';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Users';

  fetch_date(token : string) : Observable<Users[]>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Users[]>(this.url,{headers : t});
  }
}
