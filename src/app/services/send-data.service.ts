import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SendDataService {
  private dataSource = new Subject<{ id: string, isAccept: number }>();
  private idMotel= new BehaviorSubject<string>('defaultId')
  currentData = this.dataSource.asObservable();
  currentIdMotel = this.idMotel.asObservable();

  changeData(id: string, isAccept: number) {
    this.dataSource.next({id, isAccept});
  }

  sendID( id: string ) {
    this.idMotel.next(id);
  }
}
