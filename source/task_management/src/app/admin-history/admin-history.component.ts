import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleRightService } from '../services/manager_title/title-right.service';
import { GetHistoryService } from '../services/admin/get_history/get-history.service';
import { Auditlog } from '../objects/Auditlog';
import { TokenAPIService } from '../services/token/token-api.service';
import { UserService } from '../services/users_info/user.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-history',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './admin-history.component.html',
  styleUrl: './admin-history.component.css'
})
export class AdminHistoryComponent {
  private sv_title = inject(TitleRightService);
  private sv_tokenAPI =inject(TokenAPIService);
  private sv_history = inject(GetHistoryService)
  private sv_user_info = inject(UserService);
  private token = '';

  list_auditlog !: Auditlog[];
  list_auditlog_search!:Auditlog[];
  searchTitle:string ='';
  check_search:boolean=false;

  constructor(private router:Router,private route:ActivatedRoute){
    if(this.sv_user_info.getUser()?.isadmin !== 1)
    {
      this.router.navigate(['/Home'],{relativeTo : this.route});
    }
    this.sv_title.setTitle("Admin");
    this.token = this.sv_tokenAPI.getToken()??'';
    if(this.token)
    {
      this.sv_history.fetch_date(this.token).subscribe({
        next:(d)=>{
          //console.log(d);
          this.list_auditlog = d;
        },
        error:(e)=>{
          console.log(e);
        },
        complete:()=>{

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
        this.list_auditlog_search = this.list_auditlog.filter(p=>p.action.toLocaleLowerCase().includes(this.searchTitle.toLocaleLowerCase()));
        //console.log(this.list_project_search);
      }
      else
      {
        this.check_search = false;
      }
    }
  }
}
