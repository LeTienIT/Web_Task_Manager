import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../../objects/Users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateAccService {

  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Users/update";
  
  update_account(tk : Users, token : string):Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.url,tk,{headers : t});
  }
}
