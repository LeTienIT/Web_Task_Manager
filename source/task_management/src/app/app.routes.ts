import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { HomeComponent } from './home/home/home.component';
import { TaskComponent } from './task/task/task.component';
import { ProjectComponent } from './projects/project/project.component';
import { ManagerComponent } from './manager/manager/manager.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ErrorComponent } from './error/error.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { UpdateAccountComponent } from './update-account/update-account.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { AdminUpdateUserComponent } from './admin-update-user/admin-update-user.component';
import { StatisticalComponent } from './statistical/statistical.component';
import { SearchProjectComponent } from './search-project/search-project.component';
import { SearchProjectDTComponent } from './search-project-dt/search-project-dt.component';

export const routes: Routes = [
    {'path':'Login',component:LoginComponent,'title':'Login'},
    // {'path':'Login', children:[
    //     {'path':'Home',component:HomeComponent,'title':'Home'}
    // ]}
    // { path: '', redirectTo: '/Home', pathMatch: 'full' },
    {'path':'Home',component:HomeComponent,'title':'Home'},
    {'path':'',component:HomeComponent,'title':'Home'},
    {'path':"Account",component:UpdateAccountComponent,'title':"Account"},

    {'path':'Manager',component:ManagerComponent , children:[
        {'path':'Project',component: ProjectComponent,'title':'Project'} ,
        {'path':'Detail/:projectTitle/:projectID',component:ProjectDetailComponent, 'title':'Detail project'},
        {'path':'Task/:taskID',component:TaskComponent, 'title':'Task'},
        {'path':'Create_Project', component:CreateProjectComponent,'title':'Create Project'},
        {'path':'Statistical',component:StatisticalComponent,'title':'Thống kê'},
        {'path':'Update_project', component:UpdateProjectComponent},
        {'path':'Admin_user',component:AdminUserComponent,'title':'ADMIN'},
        {'path':'Admin_history',component:AdminHistoryComponent,'title':'ADMIN'},
        {'path':'Admin_update_user/:userID',component:AdminUpdateUserComponent,'title':'ADMIN'}
    ]},
    {'path':'Search/:title_key',component:SearchProjectComponent,'title':"Search"},
    {'path':'Search_Task/:key/:title/:projectID',component:SearchProjectDTComponent,"title":"Search_Task"},
    {'path':'**', component:ErrorComponent,'title':'ERROR'}

];
