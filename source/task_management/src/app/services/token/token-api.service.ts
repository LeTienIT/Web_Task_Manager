import { isPlatformBrowser } from '@angular/common';
import { Injectable,PLATFORM_ID,Inject  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenAPIService {
  private token:string="";
  constructor(@Inject(PLATFORM_ID) private platformId: Object){}
  setToken(tk:string):void{
    this.token = tk;
    localStorage.setItem("access_token",tk);
  }
  getToken():string|null{
    let token_local : string = '';
    return this.token || '';
  }
  removeToken():void{
    this.token="";;
  }
}
