import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeleteFileService {

  // private url= "https://localhost:7194/api/File/Delete"; 
  private http = inject(HttpClient);
  
  delete_file(filePath : string, token : string) : Observable<any>
  {
    const t = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = {
      headers: t,
      // body: { filePath: filePath }
    };
    const url = `https://localhost:7194/api/File/Delete?filePath=${encodeURIComponent(filePath)}`;
    return this.http.delete<any>(url, options);
    // return this.http.post<any>(this.url,`"${filePath}"`,{headers : t});
  }
}
