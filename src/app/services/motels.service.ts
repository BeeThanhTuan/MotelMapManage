import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MotelsService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  constructor(private httpClient: HttpClient,) { }

  public getAllMotels(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motels/accept=0`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public getMotelById(id: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motel/${id}`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }
  
  public deleteMotel(id:string):Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motel/${id}`;
    return this.httpClient.delete<any>(url, this.httpOptions);
  }

}
