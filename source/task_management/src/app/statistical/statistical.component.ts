import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../services/users_info/user.service';
import { TokenAPIService } from '../services/token/token-api.service';
import { ThongKeService } from '../services/thong_ke/thong-ke.service';
import { projects } from '../objects/Projects';
import { task } from '../objects/Task';
import { TitleRightService } from '../services/manager_title/title-right.service';

@Component({
  selector: 'app-statistical',
  standalone: true,
  imports: [],
  templateUrl: './statistical.component.html',
  styleUrl: './statistical.component.css'
})
export class StatisticalComponent implements OnInit{
  private sv_user = inject(UserService);
  private sv_tokenAPI = inject(TokenAPIService);
  private sv_thongke = inject(ThongKeService);
  private sv_title = inject(TitleRightService);

  
  private userID = -1;
  private token = ''
  private projectDT !: projects[];
  private taskDT !: task[];

  TimeNow = new Date();
  tongso_P = 0;
  tongso_T = 0;

  tongP_startN = 0;
  tongP_endN = 0;
  
  tongT_endN=0;

  tongP_Successfully=0;
  tongP_Close=0;
  tongT_Close=0;

  constructor(){
    this.sv_title.setTitle("Thống kê");
    this.userID = this.sv_user.getUser()?.userid ?? -1;
    this.token = this.sv_tokenAPI.getToken()??'';

    if(this.userID&&this.token)
    {
      this.sv_thongke.fetch_data(this.userID,this.token).subscribe({
        next :(d)=>{
          this.projectDT = d.data.projectData;
          this.taskDT = d.data.taskData;
          this.tongso_P = this.projectDT.length;
          this.tongso_T = this.taskDT.length;
          console.log(this.taskDT.length);
        },
        error :(e)=>{
          console.log(e);
        },
        complete:()=>{
          for(var p=0 ; p < this.projectDT.length ; p++)
          {
            this.projectDT[p].startdate = new Date(this.projectDT[p].startdate);
            this.projectDT[p].enddate = new Date(this.projectDT[p].enddate);
          }
          for(var t=0;t<this.taskDT.length;t++)
          {
            this.taskDT[t].deadline = new Date(this.taskDT[t].deadline);
          }
          if(this.projectDT && this.taskDT)
          {
            const currentTime = new Date();
            const isSameDate = (date1: Date, date2: Date): boolean => {
              return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
              );
            };
            const p_s = this.projectDT.filter(item => isSameDate(new Date(item.startdate), currentTime));
            const p_e = this.projectDT.filter(item => isSameDate(new Date(item.enddate), currentTime));
            const t_e = this.taskDT.filter(item => isSameDate(new Date(item.deadline), currentTime));
            
            const completedObjectsA = this.projectDT.filter(objectA => {
              const relatedObjectsB = this.taskDT.filter(objectB => objectB.projectid === objectA.projectid);
              return relatedObjectsB.every(objectB => objectB.status === 100);
            })

            //const p_close = this.projectDT.filter(item => new Date(item.enddate).getTime() > currentTime.getTime());

            const upcomingProjects = this.projectDT.filter(project => {
              const relatedTasks = this.taskDT.filter(task => task.projectid === project.projectid);
              const isCompleted = relatedTasks.every(task => task.status === 100);
              const isUpcoming = new Date(project.enddate).getTime() > currentTime.getTime();
            
              return !isCompleted && isUpcoming;
            });

            //const t_close = this.taskDT.filter(item => new Date(item.deadline).getTime() < currentTime.getTime());
            const t_close = this.taskDT.filter(task => {
              const isPastDeadline = new Date(task.deadline).getTime() < currentTime.getTime();
              const isNotCompleted = task.status < 100;
            
              // Lọc ra những task có deadline nhỏ hơn hiện tại và status < 100
              return isPastDeadline && isNotCompleted;
            });
            this.tongP_startN=p_s.length;
            this.tongP_endN = p_e.length;
            this.tongT_endN = t_e.length;
            this.tongP_Successfully=completedObjectsA.length;
            this.tongP_Close = upcomingProjects.length;
            this.tongT_Close = t_close.length;
          }
        }
      })
    }
    
    
  }
  ngOnInit(): void {
    
  }
}
