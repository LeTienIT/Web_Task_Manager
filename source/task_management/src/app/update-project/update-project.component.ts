import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TitleRightService } from '../services/manager_title/title-right.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { UserService } from '../services/users_info/user.service';
import { projects } from '../objects/Projects';
import { tasks } from '../objects/Tasks';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectService } from '../services/create_project/create-project.service';
import { CreateTaskService } from '../services/create_task/create-task.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { ProjectIdCurrentService } from '../services/project_current/project-id-current.service';
import { ProjectByIDService } from '../services/project_byID/project-by-id.service';
import { UpdateProjectService } from '../services/update_project/update-project.service';
import { DeleteProjectService } from '../services/delete_project/delete-project.service';
import { CreateHistoryService } from '../services/create_history/create-history.service';
import { Auditlog } from '../objects/Auditlog';
import { LoginStatusService } from '../services/login_status/login-status.service';
@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [RouterLink, RouterOutlet,NgFor,ReactiveFormsModule,NgIf],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent implements OnInit {
  private sv_login_status = inject(LoginStatusService);
  private sv_title_manager = inject(TitleRightService);
  private sv_user_info = inject(UserService);
  private sv_create_prj = inject(CreateProjectService);
  private sv_create_task = inject(CreateTaskService);
  private sv_token = inject(TokenAPIService);
  private sv_project_current = inject(ProjectIdCurrentService);
  private sv_project_info = inject(ProjectByIDService);
  private sv_update_project=inject(UpdateProjectService);
  private sv_delete_project = inject(DeleteProjectService);
  private sv_history = inject(CreateHistoryService);

  private projectID:number=-1;
  private userID:number=-1;
  
  form_project?:FormGroup;
  project_update?:projects;
  check_update:string='';

  constructor(private router:Router,private route:ActivatedRoute){
    this.sv_title_manager.setTitle("Update Project");
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
    this.userID = this.sv_user_info.getUser()?.userid ?? -1;
    this.sv_project_current.$projectID.subscribe({
      next:(data)=>{
        console.log("data update",data);
        this.projectID = data;
      },
      error :(e)=>{
        console.log(e);
      },
      complete :()=>
      {
        console.log("Get Project ID OK");
        
      }
    });
    let token:string = this.sv_token.getToken() ?? '';
    if(token)
        {
          this.sv_project_info.fetch_data(this.projectID,token).subscribe({
            next:(d)=>{
              this.project_update = d.data;
            },
            error :(e)=>{
              console.log(e);
            },
            complete :()=>{
              console.log("lay du lieu project update xong");
              console.log(this.project_update);
              if(this.project_update)
              {
                //console.log("tao group");
                this.form_project = new FormGroup({
                  project_Title : new FormControl(this.project_update.title ?? ''),
                  project_Description: new FormControl(this.project_update.description ?? ''),
                  project_StartDate : new FormControl(new Date(this.project_update.startdate).toISOString().substring(0,10)),
                  project_EndDate : new FormControl(new Date(this.project_update.enddate).toISOString().substring(0,10)),
                  project_Visibility : new FormControl(this.project_update.visibility ?? '')
                });
              }
            }
          })
       }  
        
  }
  ngOnInit(): void {
    console.log("prj_upd",this.project_update);
    
  }
  btn_back()
  {
    this.router.navigate(['/Manager/Project'],{relativeTo : this.route});
  }

 
  form_task = new FormGroup({
    tasks : new FormArray([])
  })
  get tasksFormArray() {
    return this.form_task.get('tasks') as FormArray;
  }
  addTaskFormGroup(): void {
    var taskFormGroup = new FormGroup({
      task_title : new FormControl(),
      task_Description : new FormControl(),
      task_Priority : new FormControl(),
      task_Deadline : new FormControl(new DatePipe('en-US').transform(new Date(),'yyyy-MM-dd')),
      task_Status : new FormControl(0) 
    });

    this.tasksFormArray.push(taskFormGroup);
  }
  removeLastTask() {
    const tasksArray = this.form_task.get('tasks') as FormArray;
    const lastTaskIndex = tasksArray.length - 1;
  
    if (lastTaskIndex >= 0) {
      tasksArray.removeAt(lastTaskIndex);
    }
  }

  submit_Main()
  {
   
    if(this.form_project)
    {
      
      const projectData = this.form_project.value;
      //console.log('Project Data:', projectData);
      const taskData = this.form_task.value;
      //console.log('Task Data:', taskData);
      let tmp:boolean = true;
      if(projectData.project_Visibility)
      {
        if(projectData.project_Visibility.toString()==='false')
        {
          tmp=false;
        }
      }
      let projectAdd : projects = {
        projectid:this.projectID,
        userid:this.userID,
        title: projectData.project_Title ?? '',
        description: projectData.project_Description ?? '',
        visibility: tmp,
        startdate: projectData.project_StartDate ?? new Date(),
        enddate: projectData.project_EndDate ?? new Date()
      }
      
      let token:string = this.sv_token.getToken() ?? '';
      if(token)
      {
        this.sv_update_project.update_project(projectAdd,token).subscribe({
          next:(data)=>{
            console.log(data);
            this.projectID = data.data;
            let tmp : Auditlog = {
              logid:0,
              userid:this.userID,
              action : "UPDATE",
              details : "Cập nhật projectID: "+this.projectID,
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
          },
          error : (e)=>{
            this.check_update = "ERROR_PROJECT";
            console.log(e);
          },
          complete : ()=>
          {
            this.check_update="UPDATE_PROJECT_SUCCESSFULLY";
            console.log("UPDATE_PROJECT_ID: "+this.projectID);
            let list_task : tasks[] = [];
            if (taskData && taskData.tasks && taskData.tasks.length > 0) {
              taskData.tasks.forEach((task: any) => {
                var task_tmp : tasks = {
                  taskid:0,
                  userid:this.userID,
                  title: task.task_title,
                  description:task.task_Description,
                  priority:task.task_Priority,
                  deadline:task.task_Deadline,
                  status:task.task_Status,
                  projectid:this.projectID,
                  notes:[],
                  attachments:[]
                }
                list_task.push(task_tmp);
              });
            }
            if(list_task.length > 0)
            {
              this.sv_create_task.create_task(list_task,token).subscribe({
                next:(data)=>{
                  console.log(data);
                },
                error:(e)=>{
                  this.check_update = "ERROR_TASK";
                  console.log(e);
                },
                complete : ()=>{
                  this.check_update="UPDATE_PROJECT_AND_TASK_SUCCESSFULLY";
                  console.log("CREATE_TASK_SUCCESSFULLY");
                  let tmp : Auditlog = {
                    logid:0,
                    userid:this.userID,
                    action : "CREATE",
                    details : "TẠO "+list_task.length+" TASK TRONG projectID: "+this.projectID,
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
            
          }
        })
      }
      else{
        console.log("ERROR_TOKEN");
      }
    }
    

    // Lấy dữ liệu từ form_task
    
  }

  delete_project(){
    const userConfirmed = window.confirm('Bạn có chắc chắn muốn thực hiện hành động không?');
    if(userConfirmed)
    {
      let token:string = this.sv_token.getToken() ?? '';
      if(token)
      {
        this.sv_delete_project.delete_project(this.projectID,token).subscribe({
          next : (d)=>{
            console.log(d);
          },
          error : (e)=>{
            console.log(e);
          },
          complete : ()=>{
            let tmp : Auditlog = {
              logid:0,
              userid:this.userID,
              action : "DELETE",
              details : "Xóa projectID: "+this.projectID,
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
            this.btn_back();
          }
        })
      }
    }
  }
}
