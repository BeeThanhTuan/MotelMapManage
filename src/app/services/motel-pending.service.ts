import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MotelPendingService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  constructor(private httpClient: HttpClient,) { }

  public getAllMotelPending(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motels/accept=1`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public deleteMotelPending(id:string):Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motel/${id}`;
    return this.httpClient.delete<any>(url, this.httpOptions);
  }

  public updateMotelPending(id:string, location:{latLng: string, distance : number}):Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motel-pending/${id}`;
    return this.httpClient.put<any>(url, location, this.httpOptions);
  }


  

}
