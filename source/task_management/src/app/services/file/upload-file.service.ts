import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private url = "https://localhost:7194/api/File";
  private http = inject(HttpClient);
  
  uploadFile(file: File, folderA: string, folderB: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('folderA', folderA);
    formData.append('folderB', folderB);

    return this.http.post(this.url, formData);
  }
}
