import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TitleRightService } from '../services/manager_title/title-right.service';
import { UserService } from '../services/users_info/user.service';
import { Users } from '../objects/Users';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetUserService } from '../services/admin/get_user/get-user.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { DeleteUService } from '../services/admin/delete_u/delete-u.service';
import { CreateHistoryService } from '../services/create_history/create-history.service';
import { Auditlog } from '../objects/Auditlog';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [RouterLink,NgIf,NgFor,FormsModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent {
  private sv_user_info = inject(UserService);
  private sv_title = inject(TitleRightService);
  private sv_tokenAPI = inject(TokenAPIService);
  private sv_getUser = inject(GetUserService);
  private sv_delete_u = inject(DeleteUService);
  private sv_create_history = inject(CreateHistoryService);

  private token:string='';
  userID=-1;

  list_user !: Users[];
  list_user_search !: Users[];
  searchTitle:string ='';
  check_search:boolean=false;
  constructor(private router:Router,private route:ActivatedRoute){
    this.token = this.sv_tokenAPI.getToken()??'';
    if(this.sv_user_info.getUser()?.isadmin !== 1)
    {
      this.router.navigate(['/Home'],{relativeTo : this.route});
    }
    this.userID = this.sv_user_info.getUser()?.userid ?? -1;
    this.sv_title.setTitle("ADMIN");
    if(this.token){
      this.sv_getUser.fetch_date(this.token).subscribe({
        next : (d)=>{
          this.list_user = d;
        },
        error :(e)=>{
          console.log(e);
        },
        complete:()=>{
          //console.log(this.list_user);
        }
      })
    }
  }
      
  search_Title()
  {
    //console.log(this.searchTitle);
    if((this.check_search === false)){
      this.check_search = true;
    }
    if((this.check_search === true))
    {
      if(this.searchTitle!=='')
      {
        //console.log("Search...");
        this.list_user_search = this.list_user.filter(p=>p.fullname.toLocaleLowerCase().includes(this.searchTitle.toLocaleLowerCase()));
        //console.log(this.list_project_search);
      }
      else
      {
        this.check_search = false;
      }
    }
  }
  btn_delete(event : number){
    const userConfirmed = window.confirm('Bạn có chắc chắn muốn thực hiện hành động không?');
    if(userConfirmed&&this.token)
    {
      this.sv_delete_u.delete_user(event,this.token).subscribe({
        next:(d)=>{
          console.log(d);
          if(this.list_user)
          {
            const index = this.list_user.findIndex(e => (e.userid === Number(d.userid)));
                //console.log("index",index);
            if (index !== -1) {
              this.list_user.splice(index, 1);
            }
          }
          if(this.list_user_search)
          {
            const index = this.list_user_search.findIndex(e => (e.userid === Number(d.userid)));
            //console.log("index",index);
            if (index !== -1) {
              this.list_user_search.splice(index, 1);
            }
          }
          let tmp : Auditlog = {
            logid:0,
            userid:this.userID,
            action : "DELETE",
            details : "Xóa tài khoản: "+d.toString(),
            timestamp : new Date()
          }
          this.sv_create_history.create_history(tmp).subscribe({
            next : (d)=>{
              console.log(d);
            },
            error : (e)=>{
              console.log(e);
            },
            complete:()=>{
              
            }
          })
        },
        error:(e)=>{
          console.log(e);
        },
        complete:()=>{

        }
      })
    }
  }
  btn_update_user(event:number)
  {
    this.router.navigate([`/Manager/Admin_update_user/${event}`] , {relativeTo:this.route});
  }
}
