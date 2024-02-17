import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeleteAttService {

  private url= "https://localhost:7194/api/Attachment/DeleteAttachment"; 
  private http = inject(HttpClient);
  
  delete_att(attachmentid : number, token : string) : Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.url}/${attachmentid}`, {headers : t});
  }
}
