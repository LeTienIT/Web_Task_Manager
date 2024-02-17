import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditlog } from '../../objects/Auditlog';

@Injectable({
  providedIn: 'root'
})
export class CreateHistoryService {
  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Auditlog/CreateAuditlog";
  
  create_history(tk : Auditlog):Observable<any>{
    return this.http.post<any>(this.url,tk);
  }
}
