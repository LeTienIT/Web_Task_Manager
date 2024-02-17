import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { attachments } from '../../objects/Attachments';
@Injectable({
  providedIn: 'root'
})
export class CreateAttService {
  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Attachment/CreateAttachment";
  
  create_att(tk : attachments, token : string):Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url,tk,{headers : t});
  }
}
