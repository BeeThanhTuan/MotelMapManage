import { getLocaleMonthNames } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  constructor(private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    // this.checkLogin();
  }

  checkLogin(): void {
    // let isLogin = this.authService.isUserLoggedIn();
    // console.log(isLogin);
    // if (isLogin === false) {
    //   this.router.navigate(['/login']);
    // } else {
    //   this.router.navigate(['/manager/admin/dashboard']);
    //   alert('Bạn đã đăng nhập.');
    // }
  }

  login(): void {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        console.log('Token:', response.token);
        this.authService.setTokenCookie(response.token);
        let role = this.authService.getRoleFromToken();
        let username = this.authService.getUsernameFromToken();
        console.log(username);
        
          if(role === 0){
            alert('Đăng nhập thành công.');
            this.router.navigate(['/manage/dashboard']);
          }
          else{
            alert('Đăng nhập không thành công. Vì bạn không phải admin');
            this.router.navigate(['/login']);
            this.authService.removeTokenCookie();
          }
      },
      (error) => {
        console.error('Error:', error);
        alert(`Lỗi đăng nhập!!! 
Làm ơn kiểm tra lại tài khoản và mật khẩu.`);
      }
    );
  }
}
