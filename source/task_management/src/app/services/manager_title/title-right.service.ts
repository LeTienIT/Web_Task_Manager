import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TitleRightService {
  private title = new BehaviorSubject<string>("Project");

  $title = this.title.asObservable();

  public setTitle(t : string){
    this.title.next(t);
  }
}
