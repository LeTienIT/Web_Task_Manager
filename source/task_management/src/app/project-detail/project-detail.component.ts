import { Component, OnInit, inject } from '@angular/core';
import { LoginStatusService } from '../services/login_status/login-status.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { task } from '../objects/Task';
import { DatePipe, NgFor, NgIf,CommonModule  } from '@angular/common';
import { TaskService } from '../services/tasks/task.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { TitleRightService } from '../services/manager_title/title-right.service';
import { ProjectIdCurrentService } from '../services/project_current/project-id-current.service';
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [DatePipe,RouterLink,NgFor,NgIf,CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  private sv_login_status = inject(LoginStatusService);
  private sv_task = inject(TaskService);
  private sv_token = inject(TokenAPIService);
  private sv_title = inject(TitleRightService);
  private sv_project_current = inject(ProjectIdCurrentService);
  list_task:task[]=[];
  private projectID:number=-1;
  projectTitle:string='';

  loading:boolean=false;

  constructor(private router:Router,private route:ActivatedRoute){
    this.sv_title.setTitle("Project details");
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
    try
    {
      this.projectID = route.snapshot.params["projectID"];
      this.projectTitle = route.snapshot.params["projectTitle"];
      this.sv_project_current.setProjectID(this.projectID,this.projectTitle);
      // console.log("ProjectId: "+this.projectID);
      // console.log("ProjectTilSe: "+this.projectTitle);
    }
    catch{
      this.projectID = -1;
      this.projectTitle = "ERROR_URL"
    }
    
  }
  ngOnInit(): void {
    this.loading = true;
    var tokenAPI : string = this.sv_token.getToken() ?? ''; 
    if(tokenAPI!==''&&this.projectID!==-1)
    {
      this.sv_task.fetch_date(this.projectID,tokenAPI).subscribe({
        next : (data)=>{
          this.list_task = data;
        },
        error : (error)=>{
          this.projectTitle = "ERROR";
          console.log(error);
        },
        complete : ()=>{
          // console.log("Token :"+tokenAPI);
          console.log("Lấy dữ liệu list task thành công");
          this.loading = false;
        }
      });
    }
    
  }
  back_project(){
    this.router.navigate(['/Manager/Project'], {relativeTo : this.route});
  }
  btn_back()
  {
    this.router.navigate(['/Manager/Project'],{relativeTo : this.route});
  }

  btn_update()
  {
    this.router.navigate(['/Manager/Update_project'],{relativeTo : this.route});
  }
}
