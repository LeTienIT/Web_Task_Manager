import { Injectable, inject } from '@angular/core';
import { Subject,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {
  private login_st = new BehaviorSubject<boolean>(true);
  $login_st = this.login_st.asObservable();
  constructor() { 
    this.login_st.next(true);
  }

  get_Status():boolean{
    return this.login_st.getValue();
  }
  send_Status(a : boolean):void{
    this.login_st.next(a);
  }
}
