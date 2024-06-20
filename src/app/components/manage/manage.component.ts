import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  username: string | null = '';
  constructor(private authService : AuthService,
    private router : Router,
  ){}

  ngOnInit(){
    this.username = this.authService.getUsernameFromToken();
  }
  focusLi(event: Event) {
    const listItems = document.querySelectorAll('.control ul li');
    listItems[0].classList.remove('dashboard')
    listItems.forEach(item => {
      item.classList.remove('selected');
    });

    const clickedItem = (event.currentTarget as HTMLElement);
    clickedItem.classList.add('selected');
  }

  closeSideBar() {
    const openI = document.getElementById('openI') as HTMLElement;
    const closeI = document.getElementById('closeI') as HTMLElement;
    openI.style.display = 'flex';
    closeI.style.display = 'none';

    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.style.minWidth = '85px';
    sidebar.style.width = '85px';
    const p = document.querySelectorAll('.control ul li a p');
    p.forEach((p) => {
      if (p instanceof HTMLElement) {
        p.style.display = 'none';
      }
    });
    const image = document.querySelector('.account button  img') as HTMLElement;
    image.style.display = 'none';
    const a_p = document.querySelector('.account button  p') as HTMLElement;
    a_p.style.display = 'none';
  }

  openSideBar() {
    const openI = document.getElementById('openI') as HTMLElement;
    const closeI = document.getElementById('closeI') as HTMLElement;
    openI.style.display = 'none';
    closeI.style.display = 'flex';
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.style.minWidth = '230px';
    sidebar.style.width = '230px';

    const p = document.querySelectorAll('.control ul li a p');
    p.forEach((p) => {
      if (p instanceof HTMLElement) {
        setTimeout(() => {
          p.style.display = 'flex';
        }, 200);
      }
    });
    const image = document.querySelector('.account button  img') as HTMLElement;
    const a_p = document.querySelector('.account button  p') as HTMLElement;
    setTimeout(()=>{
      image.style.display = 'flex';
      a_p.style.display = 'flex';
    },200)
  }

  signout(){
    const confirmDelete = confirm('Bạn có muốn đăng xuất không?');
    if (confirmDelete) {
      this.authService.removeTokenCookie();
      this.router.navigate(['/login']);
    }
  }
}
