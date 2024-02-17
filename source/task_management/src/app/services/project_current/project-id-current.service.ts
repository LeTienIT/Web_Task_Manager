import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectIdCurrentService {
  private projectTitle = new BehaviorSubject<string>('');
  private projectID = new BehaviorSubject<number>(-1);
  $projectID = this.projectID.asObservable();
  $projectTitle = this.projectTitle.asObservable();
  
  public setProjectID(p:number,t:string){
    this.projectID.next(p);
    this.projectTitle.next(t);
  }
}
