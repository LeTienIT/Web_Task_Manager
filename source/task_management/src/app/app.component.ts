import { AfterContentInit, Component, DoCheck, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login/login.component";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoginStatusService } from './services/login_status/login-status.service';
import { UserService } from './services/users_info/user.service';
import { TokenAPIService } from './services/token/token-api.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, LoginComponent, NgIf,RouterLink],
})
export class AppComponent implements DoCheck,AfterContentInit {
  title = "";
  private sv_login_status = inject(LoginStatusService);
  private sv_user = inject(UserService);
  private sv_token = inject(TokenAPIService);
  check_login_status : boolean = true;
  check_logout_status : boolean = false;
  // title = 'task_management';

  check_menu_nav = false;
  check_screen = 0;
  check_title_screen = true;

  constructor(private router:Router,private route:ActivatedRoute){
      this.sv_login_status.$login_st.subscribe((value)=>{
      this.check_login_status = value;
      this.check_logout_status = !this.check_login_status;
      // console.log("status_login: "+this.check_login_status)
    })
  }
  ngAfterContentInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", ()=>{
        this.check_screen = window.innerWidth;
        if(this.check_screen<=700)
        {
          this.check_title_screen = false;
        }
        else
        {
          this.check_title_screen = true;
        }
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
  home_click(){
    // console.log("Home click");
    this.click_menu_responsive(0);
    this.router.navigate(['/Home'], {relativeTo:this.route});
  }
  manager_click()
  {
    this.click_menu_responsive(0);
    this.router.navigate(['/Manager/Project'], {relativeTo:this.route});
  }
  click_Login()
  {
    this.click_menu_responsive(0);
    this.router.navigate(['/Login'], {relativeTo:this.route});
  }
  click_Account()
  {
    this.click_menu_responsive(0);
    this.router.navigate(['/Account'], {relativeTo:this.route});
  }
  click_Logout(){
    this.click_menu_responsive(0);
    this.sv_user.removeUser();
    this.sv_token.removeToken();
    this.sv_login_status.send_Status(true);
    this.router.navigate(['/Home'], {relativeTo:this.route});
  }
}
