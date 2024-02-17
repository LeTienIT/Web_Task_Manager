import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../objects/Users';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  http = inject(HttpClient);
  url_Register = "https://localhost:7194/api/Users/create";

  fetch_data(u : Users)
  {
    return this.http.post(this.url_Register,u);
  }
}
