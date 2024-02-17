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
  selector: 'app-search-project-dt',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './search-project-dt.component.html',
  styleUrl: './search-project-dt.component.css'
})
export class SearchProjectDTComponent implements OnInit {

  private sv_task = inject(TaskService);

  list_task:task[]=[];
  key="";
  loading = false;
  projectID = -1;
  projectTitle = '';
  constructor(private router:Router,private route:ActivatedRoute)
  {
    this.key = route.snapshot.params["key"];
    this.projectID = route.snapshot.params["projectID"];
    this.projectTitle = route.snapshot.params["projectTitle"];
    
  }
  ngOnInit(): void {
    if(this.projectID!==-1)
    {
      this.loading = true;
      this.sv_task.fetch_date(this.projectID,"").subscribe({
        next : (data)=>{
          this.list_task = data;
        },
        error : (error)=>{
          this.projectTitle = "ERROR";
          console.log(error);
        },
        complete : ()=>{
          // console.log("Token :"+tokenAPI);
          //console.log("Lấy dữ liệu list task thành công");
          this.loading = false;
        }
      });
    }
  }

  back_click()
  {
    this.router.navigate(['/Search',this.key],{relativeTo:this.route});
  }
}
