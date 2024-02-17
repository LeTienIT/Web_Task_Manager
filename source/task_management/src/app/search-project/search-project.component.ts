import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { projects } from '../objects/Projects';
import { SearchProjectService } from '../services/search_project/search-project.service';
import { DatePipe,UpperCasePipe} from '@angular/common';
import { VisibilityPipe } from '../pipe_custom/visibility.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-project',
  standalone: true,
  imports: [VisibilityPipe,RouterLink,NgIf,NgFor,FormsModule],
  templateUrl: './search-project.component.html',
  styleUrl: './search-project.component.css'
})
export class SearchProjectComponent implements OnInit {
  private sv_search_project = inject(SearchProjectService);

  loading:boolean=false;
  list_project ?: projects[];
  title_key : string;
  constructor(private router:Router,private route:ActivatedRoute){
    this.title_key = this.route.snapshot.params["title_key"];
    
  }
  ngOnInit(): void {
    if(this.title_key)
    {
      this.loading = true;
      this.sv_search_project.fetch_date(this.title_key).subscribe({
        next : (d)=>{
          this.list_project = d;
        },
        error : (e)=>{
          console.log(e);
        },
        complete :()=>{
          this.loading = false;
        }
      })
    }
  }

  search_click(){
    if(this.title_key)
    {
      this.loading = true;
      this.sv_search_project.fetch_date(this.title_key).subscribe({
        next : (d)=>{
          this.list_project = d;
        },
        error : (e)=>{
          console.log(e);
        },
        complete :()=>{
          this.loading=false;
        }
      })
    }
  }
}
