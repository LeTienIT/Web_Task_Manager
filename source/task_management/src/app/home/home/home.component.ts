import { NgIf } from '@angular/common';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf,RouterLink,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterContentInit{
  check_sub_heading : boolean = false;
  title_key:string='';

  ngAfterContentInit(): void {
    if(typeof document !== 'undefined')
    {
      this.check_sub_heading = true;
      document.addEventListener('DOMContentLoaded', () => {
        const textElement = document.getElementById('text_sub_heading');
        const textToType = '"Chào mừng đến với S2 - Nền tảng đa chức năng để quản lý công việc, tạo lập kế hoạch và tối ưu hóa năng suất. Khám phá cơ hội sáng tạo và tích hợp công nghệ vào cuộc sống hàng ngày của bạn. Dễ dàng, linh hoạt và hiệu quả - Cơ Mà giúp bạn tạo ra lịch trình, quản lý công việc và đưa ra quyết định thông minh. Bắt đầu hành trình của bạn với chúng tôi ngay hôm nay!"';
        let index = 0;
        function type() {
          
          if(textElement)
          {
            textElement.textContent = textToType.slice(0, index);
            index++;
        
            if (index <= textToType.length) {
              setTimeout(type, 50); 
            }
          }
          
        }
        type();
        
      });
    }
  }
  constructor(private router:Router,private route:ActivatedRoute){}
  letGo_Click()
  {
    this.router.navigate(['/Manager/Project'], {relativeTo: this.route})
  }

  search_click()
  {
    this.router.navigate(['/Search',this.title_key], {relativeTo: this.route});
  }
}

