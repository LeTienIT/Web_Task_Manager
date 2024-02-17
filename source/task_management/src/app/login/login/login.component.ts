import { AfterContentInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { Users } from '../../objects/Users';
import { RouterLink } from '@angular/router';
import { TokenAPIService } from '../../services/token/token-api.service';
import { UserService } from '../../services/users_info/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { LoginStatusService } from '../../services/login_status/login-status.service';
import { NgIf } from '@angular/common';
import { CreateHistoryService } from '../../services/create_history/create-history.service';
import { Auditlog } from '../../objects/Auditlog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterContentInit {
  private sv_login = inject(LoginService);
  private token = inject(TokenAPIService);
  private user = inject(UserService);
  private sv_Register = inject(RegisterService);
  private sv_login_status = inject(LoginStatusService);
  private sv_history = inject(CreateHistoryService);

  private userLogin?:Users;
  loading:boolean=false;
  constructor(private router : Router, private route :ActivatedRoute){}

  ngAfterContentInit(): void {
    if (typeof document !== 'undefined') {
      const wrapper = document.querySelector('.wrapper');
      const registerLink = document.querySelector('.register-link');
      const loginLink = document.querySelector('.login-link');
      const btnPopup = document.querySelector('.button-login');
      //const btnClose = document.querySelector('.icon-close');

      if (wrapper && registerLink && loginLink && btnPopup) {
        registerLink.addEventListener('click', () => {
          wrapper.classList.add('active');
        });

        loginLink.addEventListener('click', () => {
          wrapper.classList.remove('active');
        });

        btnPopup.addEventListener('click', () => {
          wrapper.classList.add('active-popup');
        });
      }
    }
  }

  formLogin = new FormGroup({
    userName : new FormControl(''),
    passWord : new FormControl('')
  });
  check_login:string=''; 
  submit_login(){
    var userName = this.formLogin.value.userName ?? '';
    var passWord = this.formLogin.value.passWord ?? '';
    //console.log(this.userName+"_"+this.passWord);
    if(!(userName==='') && !(passWord===''))
    {
      this.loading = true;
      var u : Users = {
        userid:0,
        username : userName,
        password : passWord,
        fullname:"",
        email:"",
        isadmin:0
      }
      this.sv_login.fetch_data(u).subscribe({
        next : (value:any)=>{
          if(value.status === 'OK')
          {
            console.log("Login Thanh cong");
            this.token.setToken(value.token);
            this.user.setUser(value.data);
            this.userLogin = value.data;
            this.sv_login_status.send_Status(false);
            this.router.navigate(['/Manager/Project'], {relativeTo : this.route});
            // this.router.navigate(['/Home'], {relativeTo : this.route});
          }
          else{
            this.check_login = "Sai tài khoản hoặc mật khẩu";
          }
        },
        error : (error)=>{
          console.log("Lỗi API: "+error)
          this.check_login="Lỗi! không kết nối được cơ sở dữ liệu";
        },
        complete : ()=>{
          this.loading = false;
          let tmp : Auditlog = {
            logid:0,
            userid:this.userLogin?.userid ?? -1,
            action : "LOGIN",
            details : "Đăng nhập hệ thông",
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
        }
      })
    }
    else
    {
      this.check_login = "Tài khoản và mật khẩu không được trống";
    }
  }

  formRegister = new FormGroup({
    userName_R : new FormControl(),
    passWord_R : new FormControl(),
    email_R : new FormControl(),
    check_input_R : new FormControl()
  });
  check_Register : string = "";
  check_email_input = '';
  submit_Register(){
    //console.log(this.check_email());
    
    if(this.check_email())
    {
      
      var userName_R = this.formRegister.value.userName_R ?? '';
      var passWord_R = this.formRegister.value.passWord_R ?? '';
      var email_R = this.formRegister.value.email_R ?? '';
      var check_input_R = this.formRegister.value.check_input_R ?? '';
      if(check_input_R)
      {
          if(!(userName_R =='') && !(passWord_R=='') && !(email_R==''))
          {
            console.log("Đã gửi form");
            var u : Users = {
            userid:0,
            username : userName_R,
            password : passWord_R,
            fullname : "Client",
            email : email_R,
            isadmin:0
          }
          this.sv_Register.fetch_data(u).subscribe({
            next : (value:any)=>{
                if(value.status === 'Ok')
                {
                  this.check_Register = "Thêm user thành công";
                }
                else if(value.status === "Create_failed")
                {
                  this.check_Register = "Tạo mới thất bại";
                }
                else if(value.status === "Error_user")
                {
                  this.check_Register = "Username đã tồn tại, vui lòng chọn tên khác";
                }
                else{
                  this.check_Register = "Lỗi!!";
                }
            },
            error : (e)=>{
              console.log("ERROR_LOGIN");
              this.check_Register = "ERROR SERVER";
              console.log(e);
            },
            complete:()=>{
              // let tmp : Auditlog = {
              //   LogID:0,
              //   UserID:this.userLogin?.userid ?? -1,
              //   Action : "Register",
              //   Details : "Đăng ký tài khoản",
              //   Timestamp : new Date()
              // }
              // this.sv_history.create_history(tmp).subscribe({
              //   next : (d)=>{
              //     console.log(d);
              //   },
              //   error : (e)=>{
              //     console.log(e);
              //   },
              //   complete:()=>{}
              // })
            }
          })
        }
        else
        {
          this.check_Register = "Không được để trống dữ liệu";
        }
      }
      else
      {
        this.check_Register = "Đống ý điều khoản";
      }
    }
    else
    {
      this.check_email_input = "Email không hợp lệ";
    }
  }

  check_email():boolean{
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email = this.formRegister.value.email_R ;
    // console.log(this.formRegister.value.email_R );
    if (filter.test(email)) 
      return true;
    else 
    {
      return false
    }
  }
}
