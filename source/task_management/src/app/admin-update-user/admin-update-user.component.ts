import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GetUserIDService } from '../services/admin/getUserID/get-user-id.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { Users } from '../objects/Users';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UpdateAccService } from '../services/update_acc/update-acc.service';
import { UserService } from '../services/users_info/user.service';
import { Auditlog } from '../objects/Auditlog';
import { CreateHistoryService } from '../services/create_history/create-history.service';
@Component({
  selector: 'app-admin-update-user',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './admin-update-user.component.html',
  styleUrl: './admin-update-user.component.css'
})
export class AdminUpdateUserComponent {
  private sv_get_userID = inject(GetUserIDService);
  private sv_TokenAPI = inject(TokenAPIService);
  private sv_update_user = inject(UpdateAccService);
  private sv_user_A = inject(UserService);
  private sv_history = inject(CreateHistoryService);

  private user_Admin = -1;
  private userID = -1;
  private token = '';

  check_update='';
  user_info !:Users;

  form_account : FormGroup = new FormGroup({});

  constructor(private router:Router,private route:ActivatedRoute){
    if(this.sv_user_A.getUser()?.isadmin !== 1)
    {
      this.router.navigate(['/Home'],{relativeTo : this.route});
    }
    this.userID = route.snapshot.params["userID"];
    this.token = this.sv_TokenAPI.getToken()??'';
    this.user_Admin = this.sv_user_A.getUser()?.userid ?? -1;

    if(this.userID!=-1 && this.token)
    {
      this.sv_get_userID.fetch_date(this.userID,this.token).subscribe({
        next:(d)=>{
          //console.log(d);
          this.user_info = d;
        },
        error:(e)=>{
          console.log(e);
        },
        complete:()=>{
          if(this.user_info)
          {
              this.form_account = new FormGroup({
              username : new FormControl(this.user_info.username),
              fullname : new FormControl(this.user_info.fullname),
              email : new FormControl(this.user_info.email),
              password : new FormControl(this.user_info.password),
              isadmin : new FormControl(this.user_info.isadmin)
            })
          }
        }
      })
    }
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

  submit_form(){
    if(this.check_email())
    {
  //console.log(this.form_account.value);
      const userConfirmed = window.confirm('Bạn có chắc chắn muốn thực hiện hành động không?');
      if(userConfirmed&&this.token)
      {
        if(this.form_account.value.fullname.trim()=='' || this.form_account.value.email.trim()==''
          || this.form_account.value.password.trim()=='')
        {
          this.check_update = "Nhập đủ dữ liệu";
        }
        else
        {
          let user_tmp : Users = {
            userid:this.user_info.userid,
            username:this.user_info.username,
            fullname: this.form_account.value.fullname??'',
            email: this.form_account.value.email??'',
            password : this.form_account.value.password,
            isadmin : this.form_account.value.isadmin
          }
          this.sv_update_user.update_account(user_tmp,this.token).subscribe({
            next:(d)=>{
              //console.log(d);
            },
            error:(e)=>{
              console.log(e);
            },
            complete:()=>{
              this.check_update="Update successfully";
              let tmp : Auditlog = {
                logid:0,
                userid:this.user_Admin,
                action : "UPDATE",
                details : "Cập nhật thông tin của userID: "+this.userID,
                timestamp : new Date()
              }
              this.sv_history.create_history(tmp).subscribe({
                next : (d)=>{
                  //console.log(d);
                },
                error : (e)=>{
                  console.log(e);
                },
                complete:()=>{}
              })
            }
          })
        }

      }
    }
    
  }
  btn_back()
  {
    this.router.navigate(['/Manager/Admin_user'], {relativeTo: this.route});
  }
}
