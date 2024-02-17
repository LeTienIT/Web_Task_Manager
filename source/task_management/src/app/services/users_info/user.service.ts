import { Injectable } from '@angular/core';
import { Users } from '../../objects/Users';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user ?: Users;
  constructor() { }
  setUser(u : Users):void{
    this.user = u;
  }
  getUser():Users|undefined{
    return this.user;
  }
  removeUser():void{
    this.user = {userid:-1,fullname:"",email:"",username:"",password:"",isadmin:0};
  }
}
