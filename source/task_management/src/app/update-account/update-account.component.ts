import { Component, inject } from '@angular/core';
import { UserService } from '../services/users_info/user.service';
import { Users } from '../objects/Users';
import { UpdateAccService } from '../services/update_acc/update-acc.service';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TokenAPIService } from '../services/token/token-api.service';
import { LoginStatusService } from '../services/login_status/login-status.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CreateHistoryService } from '../services/create_history/create-history.service';
import { Auditlog } from '../objects/Auditlog';


@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent {
  private sv_user_info = inject(UserService);
  private sv_update_acc = inject(UpdateAccService);
  private sv_tokenAPI = inject(TokenAPIService);
  private sv_login_status = inject(LoginStatusService)
  private sv_history = inject(CreateHistoryService);
  

  check_update='';
  user_info ?: Users;
  form_account : FormGroup = new FormGroup({});
  un = '';fn='';em=''
  constructor(private router:Router,private route:ActivatedRoute)
  {
    if(this.sv_login_status.get_Status() === true)
    {
      this.router.navigate(['/Login'], {relativeTo: this.route});
    }
    this.sv_login_status.$login_st.subscribe((values)=>{
      if(values === true)
      {
        this.router.navigate(['/Login'], {relativeTo: this.route});
      }
    })
    this.user_info = this.sv_user_info.getUser();
    if(this.user_info)
    {
        this.form_account = new FormGroup({
        username : new FormControl(this.user_info.username),
        fullname : new FormControl(this.user_info.fullname),
        email : new FormControl(this.user_info.email),
        password : new FormControl(''),
        newpassword : new FormControl('')
      })
    }
    //console.log(this.form_account.value);
  }

  check_email():boolean{
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email = this.form_account.value.email ;
    // console.log(this.formRegister.value.email_R );
    if (filter.test(email)) 
      return true;
    else 
    {
      return false
    }
  }

  submit_form()
  {
    //console.log(this.form_account.value);
    if(!this.check_email())
    {
      this.check_update="Email không hợp lên";
    }
    else if(this.form_account.value.fullname.trim()===''||this.form_account.value.email.trim()===''||
    this.form_account.value.password.trim===''||this.form_account.value.newpassword.trim()==='')
    {
      this.check_update="HÃY NHẬP ĐỦ DỮ LIỆU";
    }
    else
    {
      if(this.user_info)
      {
        let _pass = this.form_account.value.password ??'';
        if(_pass === this.user_info.password)
        {
          let new_pass = this.form_account.value.newpassword ?? '';
          if(new_pass === '')
          {
            this.check_update = "Không được để trống"
          }
          else{
            let userUD : Users;
            if(new_pass === this.user_info.password)
            {
              userUD = {
                userid : this.user_info?.userid ??-1,
                username : this.form_account.value.username ?? '',
                fullname: this.form_account.value.fullname ?? '',
                email : this.form_account.value.email ?? '',
                password : this.user_info.password,
                isadmin:0
              }
            }
            else
            {
              userUD = {
                userid : this.user_info?.userid ??-1,
                username : this.form_account.value.username ?? '',
                fullname: this.form_account.value.fullname ?? '',
                email : this.form_account.value.email ?? '',
                password : this.form_account.value.newpassword ?? '',
                isadmin:0
              }
            }
            var token : string = this.sv_tokenAPI.getToken() ?? '';
            if(token)
            {
              this.sv_update_acc.update_account(userUD,token).subscribe({
                next:(d)=>{
                  this.check_update = d.data;
                  console.log(d);
                },
                error:(e)=>{
                  this.check_update="ERROR";
                  console.log(e);
                },
                complete:()=>{
                  console.log("UPDATE_SUCCESSFULLY");
                  let tmp : Auditlog = {
                    logid:0,
                    userid:this.user_info?.userid ??-1,
                    action : "UPDATE ACCOUNT",
                    details : "Update account UserID: "+this.user_info?.userid ??-1,
                    timestamp : new Date()
                  }
                  this.sv_history.create_history(tmp).subscribe({
                    next : (d)=>{
                      console.log(d);
                    },
                    error : (e)=>{
                      console.log(e);
                    },
                    complete:()=>{}
                  })
                  this.sv_user_info.removeUser();
                  this.sv_tokenAPI.removeToken();
                  this.sv_login_status.send_Status(true);
                  this.router.navigate(['/Home'], {relativeTo:this.route});
                }
              })
            }
            
          }
        }
        else
        {
          this.check_update="Sai mật khẩu";
        }
      }
    }
    
  }
}
