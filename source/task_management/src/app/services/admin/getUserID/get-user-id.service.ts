import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../objects/Users';

@Injectable({
  providedIn: 'root'
})
export class GetUserIDService {

  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Users/GetById';

  fetch_date(userID:number,token : string) : Observable<Users>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Users>(`${this.url}/${userID}`,{headers : t});
  }
}
