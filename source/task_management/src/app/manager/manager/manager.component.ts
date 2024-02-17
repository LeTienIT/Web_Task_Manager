import { ChangeDetectorRef , AfterContentInit, Component, OnInit, inject, DoCheck } from '@angular/core';
import { LoginStatusService } from '../../services/login_status/login-status.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/users_info/user.service';
import { Users } from '../../objects/Users';
import { NgIf } from '@angular/common';
import { TitleRightService } from '../../services/manager_title/title-right.service';
@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [RouterLink,RouterOutlet,NgIf],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit,AfterContentInit,DoCheck {
  private sv_login_status = inject(LoginStatusService);
  private sv_user = inject(UserService);
  private sv_title = inject(TitleRightService);

  menu_Login:boolean = false;
  user_info : Users|undefined = this.sv_user.getUser();
  string_heading_right:string="";

  check_menu_nav = false;
  check_screen = 0;

  constructor(private router:Router,private route:ActivatedRoute,private cdr: ChangeDetectorRef){
    this.check_status_login = this.sv_login_status.get_Status();
    if(this.check_status_login === true)
    {
      this.router.navigate(['/Login'], {relativeTo: this.route});
    }

    this.sv_login_status.$login_st.subscribe((values)=>{
      this.check_status_login = values;
      if(this.check_status_login === true)
      {
        this.router.navigate(['/Login'], {relativeTo: this.route});
      }
    })
  }
  ngAfterContentInit(): void {
    this.sv_title.$title.subscribe((data)=>{
      this.string_heading_right = data;
      this.cdr.detectChanges();
    });
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", ()=>{
        this.check_screen = window.innerWidth;
      })
    }
  }
  ngDoCheck(): void {
    if (typeof window !== 'undefined'){
      if(window.innerWidth > 1000)
      {
        //console.log("check check");
        this.check_menu_nav = true;
      }
    }
    if(this.check_screen > 1000)
    {
      //console.log("check check 2");
      this.check_menu_nav = true;
    }
  }

  click_menu_responsive(a : number)
  {
      if(a === 1)
      {
        this.check_menu_nav = !this.check_menu_nav;
      }
      else
      {
        this.check_menu_nav = false;
      }
  }
  private check_status_login : boolean = this.sv_login_status.get_Status();;
  ngOnInit(): void {
  }
  admin_click()
  {
    if(this.menu_Login)
    {
      this.menu_Login = false;
    }
    else
    {
      this.menu_Login = true;
    }
  }
  add_p_click()
  {
    this.click_menu_responsive(0);
    this.router.navigate(['/Manager/Create_Project'], {relativeTo: this.route});
  }
  thong_ke_click()
  {
    this.click_menu_responsive(0);
    this.router.navigate(['/Manager/Statistical'], {relativeTo: this.route});
  }
  sub_menu_admin_user()
  {
    this.click_menu_responsive(0);
    this.menu_Login = false;
    this.router.navigate(['/Manager/Admin_user'], {relativeTo: this.route});
  }
  sub_menu_admin_history()
  {
    this.click_menu_responsive(0);
    this.menu_Login = false;
    this.router.navigate(['/Manager/Admin_history'], {relativeTo: this.route});
  }
}
