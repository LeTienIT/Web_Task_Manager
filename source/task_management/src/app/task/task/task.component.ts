import { Component, OnInit, inject } from '@angular/core';
import { LoginStatusService } from '../../services/login_status/login-status.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { tasks } from '../../objects/Tasks';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators  } from '@angular/forms';
import { TaskDetailService } from '../../services/task_detail/task-detail.service';
import { TokenAPIService } from '../../services/token/token-api.service';
import { TitleRightService } from '../../services/manager_title/title-right.service';
import { ProjectIdCurrentService } from '../../services/project_current/project-id-current.service';
import { UserService } from '../../services/users_info/user.service';
import { UpdateTaskService } from '../../services/update_task/update-task.service';
import { CreateNoteService } from '../../services/create_note/create-note.service';
import { DeleteNoteService } from '../../services/delete_note/delete-note.service';
import { notes } from '../../objects/Notes';
import { UploadFileService } from '../../services/file/upload-file.service';
import { attachments } from '../../objects/Attachments';
import { CreateAttService } from '../../services/create_att/create-att.service';
import { DeleteAttService } from '../../services/delete_att/delete-att.service';
import { DeleteFileService } from '../../services/file/delete-file.service';
import { DeleteTaskService } from '../../services/delete_task/delete-task.service';
import { CreateHistoryService } from '../../services/create_history/create-history.service';
import { Auditlog } from '../../objects/Auditlog';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterLink,RouterOutlet,NgIf,DatePipe,NgFor,ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  private sv_login_status = inject(LoginStatusService);
  private sv_taskDetail = inject(TaskDetailService);
  private sv_tokenAPI = inject(TokenAPIService);
  private sv_title = inject(TitleRightService);
  private sv_project_current = inject(ProjectIdCurrentService);
  private sv_user_info = inject(UserService);
  private sv_update_task = inject(UpdateTaskService);
  private sv_create_note = inject(CreateNoteService);
  private sv_delete_note = inject(DeleteNoteService);
  private sv_file_upload = inject(UploadFileService);
  private sv_create_att = inject(CreateAttService);
  private sv_delete_att = inject(DeleteAttService);
  private sv_delete_file = inject(DeleteFileService);
  private sv_delete_task = inject(DeleteTaskService);
  private sv_history = inject(CreateHistoryService);

  private projectTitle:string='';
  private projectId:number=-1;
  private taskId:number=-1;
  private btn_click:number=-1;
  private userID:number = -1;

  _task : tasks|undefined;
  form_task : FormGroup = new FormGroup({});
  selected_file : File | undefined;

  update_check = '';
  create_note_check = '';
  constructor(private router:Router,private route:ActivatedRoute){
    this.sv_title.setTitle("Task")
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
    this.taskId = route.snapshot.params['taskID'];
    this.sv_project_current.$projectID.subscribe((data)=>{
      this.projectId = data;
    });
    this.sv_project_current.$projectTitle.subscribe((data)=>{
      this.projectTitle = data;
    })
    this.userID = this.sv_user_info.getUser()?.userid ?? -1;
  }
  ngOnInit(): void {
    var token : string = this.sv_tokenAPI.getToken() ?? '';
    if(this.taskId!==-1&&token!=='')
    {
      this.sv_taskDetail.fetch_date(this.taskId,token).subscribe({
          next : (data)=>{
            console.log("data fetch detail task");
            console.log(data);
            this._task = data.data[0];
            if(this._task?.deadline)
            {
              this._task.deadline = new Date(this._task.deadline);
            }
            if(this._task?.notes)
            {
              for(let i=0 ; i < this._task.notes.length; i++)
              {
                if(this._task.notes[i].timestamp)
                {
                  this._task.notes[i].timestamp = new Date(this._task.notes[i].timestamp);
                }
              }
            }
            this.form_task = new FormGroup({
              task_title : new FormControl(this._task?.title),
              task_description : new FormControl(this._task?.description),
              task_deadline : new FormControl(this._task?.deadline.toISOString().substring(0,10)),
              task_status : new FormControl(this._task?.status),
              task_priority : new FormControl(this._task?.priority)
            });
          },
          error : (error) =>{
            console.log("ERROR: "+error);
          },
          complete : ()=>{
            console.log("Lấy dữ liệu 1 task thành công"); 
          }
      });
    }
  }
  increase(){
    if(this._task && this.form_task)
    {
      if(this._task.status>=0 && this._task.status<100)
      {
        this.form_task.controls['task_status'].setValue(this.form_task.value.task_status + 1);
        this._task.status++;
      }
    }
  }
  decrease(){
    if(this._task && this.form_task)
    {
      if(this._task.status>0 && this._task.status<=100)
      {
        this.form_task.controls['task_status'].setValue(this.form_task.value.task_status - 1);
        this._task.status--;
      }
    }
  }
  btn_submit_click(btnName : string){
    if(btnName === 'update_task')
      this.btn_click = 1;
    else if(btnName === 'delete_task')
      this.btn_click = 2;
  }

  form_note = new FormGroup({
    note_content : new FormControl(''),
    note_timestamp : new FormControl(new DatePipe('en-US').transform(new Date(),'yyyy-MM-dd'))
  });
  form_attachment = new FormGroup({
    att_fileName : new FormControl(''),
    att_filePath : new FormControl('')
  });
  
  submit_form()
  {
    console.log("Form cha submit");
    //console.log(this.btn_click);
    //console.log(this.form_task.value);
    var token : string = this.sv_tokenAPI.getToken() ?? '';
    if(this.btn_click === 1)
    {
        let task_insert : tasks={
          taskid:this.taskId,
          userid:this.userID,
          title: this.form_task.value.task_title ?? '',
          description: this.form_task.value.task_description ?? '',
          priority: this.form_task.value.task_priority ?? '',
          deadline: new Date(this.form_task.value.task_deadline) ?? new Date(),
          status: this.form_task.value.task_status ?? '',
          projectid: this.projectId,
          notes : [],
          attachments : []
        }
        if(token){
          this.sv_update_task.update_task(task_insert,token).subscribe({
            next : (data)=>{
              if(data.data)
                this.update_check = data.data;
            },
            error : (error)=>{
              this.update_check="ERROR_TASK";
              console.log(error);
            },
            complete : ()=>{
              console.log("Update task thành công");
              let tmp : Auditlog = {
                logid:0,
                userid:this.userID,
                action : "UPDATE",
                details : "Cập nhật taskID : "+this.taskId,
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
          });
        }
        
        // console.log("task_insert",task_insert);
    }
    else if(this.btn_click===2)
    {
      const userConfirmed = window.confirm('Bạn có chắc chắn muốn thực hiện hành động không?');
      if(userConfirmed)
      {
        if(this.taskId&&token)
        {
          this.sv_delete_task.delete_task(this.taskId,token).subscribe({
            next :(d)=>{
              console.log(d);
            },
            error : (e)=>{
              console.log(e);
            },
            complete:()=>{
              let tmp : Auditlog = {
                logid:0,
                userid:this.userID,
                action : "DELETE",
                details : "Xóa taskID: "+this.taskId,
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
  submit_form_note()
  {
    console.log("Form note submit");
    console.log(this.form_note.value);
    let note_tmp : notes = {
      noteid : 0,
      userid : this.userID,
      taskid : this.taskId,
      content : this.form_note.value.note_content ?? '',
      timestamp : new Date()//this.form_note.value.note_timestamp
    }
    var token : string = this.sv_tokenAPI.getToken() ?? '';
    if(token)
    {
      this.sv_create_note.create_note(note_tmp,token).subscribe({
        next : (data)=>{
          let tmp : number = data.data;
          if(this._task && tmp)
          {
            note_tmp.noteid = tmp;
            //tmp.timestamp = new Date(tmp.timestamp);
            //note_tmp.timestamp = new Date(note_tmp.timestamp);
            this._task.notes.push(note_tmp);
          }
        },
        error : (error)=>{
          this.create_note_check = "ERROR";
          console.log(error);
        },
        complete : ()=>{
          console.log("Create note successfully");
          let tmp : Auditlog = {
            logid:0,
            userid:this.userID,
            action : "CREATE",
            details : "Tạo note trong task: "+this.taskId,
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
    
    // console.log(note_tmp);
  }
  delete_note(noteID : number){
    var token : string = this.sv_tokenAPI.getToken() ?? '';
    if(token)
    {
      this.sv_delete_note.delete_note(noteID,token).subscribe({
        next : (data)=>{
          var note_deleted : notes = data.data;
          console.log("note_deleted",note_deleted);
          if(this._task?.notes)
          {
            //console.log("note_deleted.noteid",typeof note_deleted);
            const index = this._task.notes.findIndex(e => (e.noteid === Number(note_deleted)));
            //console.log("index",index);
            if (index !== -1) {
              this._task.notes.splice(index, 1);
            }
            //console.log(this._task.notes);
          }
        },
        error : (error)=>{
          console.log("ERROR_DELETE_NOTE",error);
        },
        complete : ()=>{
          console.log("DELETE_SUCCESSFULLY");
          let tmp : Auditlog = {
            logid:0,
            userid:this.userID,
            action : "DELETE",
            details : "Xóa note trong task: "+this.taskId,
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
  fileSelected(a : any){
    console.log("CHANGE FILE SELECTED");
    this.selected_file = a.target.files[0];
  }

  filePath:string='';
  submit_form_att(){
    console.log("Form attachment submit");
    //console.log(this.selected_file);
    // console.log(this.form_attachment.value);
    if(this.selected_file)
    {
      this.sv_file_upload.uploadFile(this.selected_file,this.projectId.toString(),this.taskId.toString())
        .subscribe({
          next : (dt)=>{
            // console.log(dt)
            this.filePath = dt.data;
          },
          error : (error)=>{
            console.log(error)
          },
          complete : ()=>{
            console.log("UPLOAD FILE LÊN SERVICCE HOÀN THÀNH");
            //console.log("FilePath: ",this.filePath);
            var token : string = this.sv_tokenAPI.getToken() ?? '';
            if(this.filePath && token)
            {
              let att : attachments = {
                attachmentid : 0,
                taskid : this.taskId,
                userid : this.userID,
                filename : this.form_attachment.value.att_fileName ?? '',
                filepath : this.filePath
                // filepath : "../assets/"+this.projectId+"/"+this.taskId+"/"+this.filePath
              }
              // console.log(att);
              this.sv_create_att.create_att(att,token).subscribe({
                next : (data)=>{
                  //console.log(data);
                  let a : attachments = data.data;
                  if(this._task?.attachments)
                  {
                    this._task.attachments.push(a);
                  }
                  //console.log("att them",this._task?.attachments);
                },
                error : (error)=>{
                  console.log(error);
                },
                complete : ()=>{
                  console.log("CREATE HOÀN THÁNH");
                  let tmp : Auditlog = {
                    logid:0,
                    userid:this.userID,
                    action : "CREATE",
                    details : "Tạo attachment trong task: "+this.taskId,
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
  }

  delete_att(event : number){
    var token : string = this.sv_tokenAPI.getToken() ?? '';
    if(token){
      this.sv_delete_att.delete_att(event,token).subscribe({
        next : (data)=>{
          let tmp = data.data;
          //console.log("data att",tmp);
          if(tmp&&this._task)
          {
            this.filePath = tmp.filepath;
            const index = this._task.attachments.findIndex(e=>e.attachmentid === Number(tmp.attachmentid));
            if (index !== -1) {
              this._task.attachments.splice(index, 1);
            }
            //this._task.attachments=this._task.attachments.filter(e=>e.attachmentid !== tmp.attachmentid)
            
          }
        },
        error : (error)=>{
          console.log(error);
        },
        complete : ()=>{
          console.log("Xóa attachment hoàn thành");
          if(this.filePath)
          {
            this.sv_delete_file.delete_file(this.filePath,token).subscribe({
              next : (d)=>{
                console.log(d);
              },
              error : (error)=>{
                console.log(error);
              },
              complete : ()=>{
                console.log("Xóa file hoàn thành");
              }
            })
          }
          let tmp : Auditlog = {
            logid:0,
            userid:this.userID,
            action : "DELETE",
            details : "Xóa attachment trong task: "+this.taskId,
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
  open_file(a:string){
    window.location.href = a;
  }

  btn_back()
  {
    this.router.navigate(['/Manager/Detail/' + this.projectTitle+'/'+this.projectId], {relativeTo : this.route});
  }
}
