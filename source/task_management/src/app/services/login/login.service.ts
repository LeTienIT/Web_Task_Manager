import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../objects/Users';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  http = inject(HttpClient);
  url_login = "https://localhost:7194/api/Users/login";
  
  fetch_data(a : Users){
    return this.http.post(this.url_login,a);
  }
}
