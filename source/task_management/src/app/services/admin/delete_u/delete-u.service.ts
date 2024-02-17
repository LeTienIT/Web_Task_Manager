import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteUService {

  private url= "https://localhost:7194/api/Users"; 
  private http = inject(HttpClient);
  
  delete_user(userID : number, token : string) : Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.url}/${userID}`, {headers : t});
  }
}

