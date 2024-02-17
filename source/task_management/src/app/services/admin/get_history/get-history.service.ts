import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditlog } from '../../../objects/Auditlog';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryService {

  private http = inject(HttpClient);
  private url='https://localhost:7194/api/Auditlog/getAuditlog';

  fetch_date(token : string) : Observable<Auditlog[]>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Auditlog[]>(this.url,{headers : t});
  }
}
