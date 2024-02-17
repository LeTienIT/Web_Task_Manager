import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TitleRightService } from '../services/manager_title/title-right.service';
import { DatePipe, NgFor } from '@angular/common';
import { UserService } from '../services/users_info/user.service';
import { projects } from '../objects/Projects';
import { tasks } from '../objects/Tasks';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectService } from '../services/create_project/create-project.service';
import { CreateTaskService } from '../services/create_task/create-task.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { CreateHistoryService } from '../services/create_history/create-history.service';
import { Auditlog } from '../objects/Auditlog';
import { LoginStatusService } from '../services/login_status/login-status.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [RouterLink, RouterOutlet,NgFor,ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  private sv_login_status = inject(LoginStatusService);
  private sv_title_manager = inject(TitleRightService);
  private sv_user_info = inject(UserService);
  private sv_create_prj = inject(CreateProjectService);
  private sv_create_task = inject(CreateTaskService);
  private sv_token = inject(TokenAPIService);
  private sv_history = inject(CreateHistoryService);

  private projectID:number=-1;
  private userID:number=-1;
  check_create:string='';

  constructor(private router:Router,private route:ActivatedRoute){
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
    this.sv_title_manager.setTitle("Create Project");
    this.userID = this.sv_user_info.getUser()?.userid ?? -1;
  }
  btn_back()
  {
    this.router.navigate(['/Manager/Project'],{relativeTo : this.route});
  }
  
  form_project = new FormGroup({
    project_Title : new FormControl(''),
    project_Description: new FormControl(''),
    project_StartDate : new FormControl(new DatePipe('en-US').transform(new Date(),'yyyy-MM-dd')),
    project_EndDate : new FormControl(new DatePipe('en-US').transform(new Date(),'yyyy-MM-dd')),
    project_Visibility : new FormControl(true)
  });
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
    const projectData = this.form_project.value;
    console.log('Project Data:', projectData);

    // Lấy dữ liệu từ form_task
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
      projectid:0,
      userid:this.userID,
      title: projectData.project_Title ?? '',
      description: projectData.project_Description ?? '',
      visibility: tmp,
      startdate: projectData.project_StartDate ?? new Date(),
      enddate: projectData.project_EndDate ?? new Date()
    }
    console.log(projectAdd);
    let token:string = this.sv_token.getToken() ?? '';
    if(token)
    {
      this.sv_create_prj.create_project(projectAdd,token).subscribe({
        next:(data)=>{
          console.log(data);
          this.projectID = data.data;
          let tmp : Auditlog = {
            logid:0,
            userid:this.userID,
            action : "CREATE",
            details : "Tạo mới project ProjetID: "+this.projectID,
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
          this.check_create = "ERROR_PROJECT";
          console.log(e);
        },
        complete : ()=>
        {
          console.log("CREATE_PROJECT_ID: "+this.projectID);
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
          let soluongTask:number=0;
          this.sv_create_task.create_task(list_task,token).subscribe({
            next:(data)=>{
              console.log(data);
              soluongTask = data.data;
            },
            error:(e)=>{
              this.check_create = "ERROR_TASK";
              console.log(e);
            },
            complete : ()=>{
              this.check_create = "CREATE_PROJECT_AND_TASK_SUCCESSFULLY";
              console.log("CREATE_PROJECT_AND_TASK_SUCCESSFULLY");
              let tmp : Auditlog = {
                logid:0,
                userid:this.userID,
                action : "CREATE",
                details : "Tạo mới list task trong ProjectID: "+this.projectID+", số lượng tạo mới: "+soluongTask,
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
      })
    }
    else{
      console.log("ERROR_TOKEN");
    }
  }

}

