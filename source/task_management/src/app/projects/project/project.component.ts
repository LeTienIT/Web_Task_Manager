import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { projects } from '../../objects/Projects';
import { DatePipe,UpperCasePipe} from '@angular/common';
import { VisibilityPipe } from '../../pipe_custom/visibility.pipe';
import { GetProjectByUserService } from '../../services/project/get-project-by-user.service';
import { UserService } from '../../services/users_info/user.service';
import { TokenAPIService } from '../../services/token/token-api.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleRightService } from '../../services/manager_title/title-right.service';
import { LoginStatusService } from '../../services/login_status/login-status.service';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RouterLink,RouterOutlet,NgIf,DatePipe,UpperCasePipe,VisibilityPipe,
            NgFor,FormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit,AfterContentInit{
  private sv_get_project = inject(GetProjectByUserService);
  private sv_user_if = inject(UserService);
  private sv_token = inject(TokenAPIService);
  private sv_title = inject(TitleRightService);
  private sv_login_status = inject(LoginStatusService);
  private check_status_login : boolean = this.sv_login_status.get_Status();;

  check_Init:string='';

  list_project : projects[] = [];
  list_project_search: projects[] = [];

  searchTitle:string ='';
  check_search:boolean=false;

  loading:boolean=false;

  constructor(private router:Router,private route:ActivatedRoute,private cdr: ChangeDetectorRef){
    this.sv_title.setTitle("Project");
    // this.check_status_login = this.sv_login_status.get_Status();
    // if(this.check_status_login === true)
    // {
    //   this.router.navigate(['/Login'], {relativeTo: this.route});
    // }

    // this.sv_login_status.$login_st.subscribe((values)=>{
    //   this.check_status_login = values;
    //   if(this.check_status_login === true)
    //   {
    //     this.router.navigate(['/Login'], {relativeTo: this.route});
    //   }
    // })
  } 
  ngAfterContentInit(): void {
    //this.cdr.detectChanges();
  }
  ngOnInit(): void {
   
    const user_if = this.sv_user_if.getUser();
    const token = this.sv_token.getToken() ?? '';
    // console.log("user: ");
    // console.log(user_if);
    if(user_if && token!=='')
    { 
      this.loading = true;
      // console.log("token: "+token);
      var test = this.sv_get_project.fetch_data(user_if.userid,token).subscribe({
        next: (response) => {
          this.list_project = response;
        },
        error: (error) => {
          console.log("Error_Project: " + error);
        },
        complete: () => {
          console.log("Lấy data project hoàn thành");
          this.loading = false;
        }
      });
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
        console.log("Search...");
        this.list_project_search = this.list_project.filter(p=>p.title.toLocaleLowerCase().includes(this.searchTitle.toLocaleLowerCase()));
        //console.log(this.list_project_search);
      }
      else
      {
        this.check_search = false;
      }
    }
  }
}

