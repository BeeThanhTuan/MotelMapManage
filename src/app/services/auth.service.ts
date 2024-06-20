import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private REST_API_SERVER = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'ntt-secret-key';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  public login(credentials: {username: string;password: string;}): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/login`;
    return this.httpClient.post(url, credentials, this.httpOptions);
  }

  getTokenCookie(): string | null {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  setTokenCookie(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token, { expires: 1, path: '/' });
  }

  removeTokenCookie(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Lấy vai trò từ token đã giải mã
  getRoleFromToken(): number | null {
    const token = this.getTokenCookie();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.role : null;
    }
    return null;
  }

  // Lấy username từ token đã giải mã
  getUsernameFromToken(): string | null {
    const token = this.getTokenCookie();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.username : null;
    }
    return null;
  }


  // kiểm tra đăng nhập hay chưa
  isAuthenticated(): boolean {
    const token = this.getTokenCookie();
    // Kiểm tra xem token có tồn tại hay không
    return !!token;
  }

  isUserLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
