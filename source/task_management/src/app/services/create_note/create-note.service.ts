import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { notes } from '../../objects/Notes';
@Injectable({
  providedIn: 'root'
})
export class CreateNoteService {
  private http = inject(HttpClient);
  private url ="https://localhost:7194/api/Notes/CreateNote";
  
  create_note(tk : notes, token : string):Observable<any>{
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url,tk,{headers : t});
  }
}
