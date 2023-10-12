import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  public data : any;
  public data1 : any;
  public notification : any;
  readonly url :string = 'http://localhost:3000';
  constructor() {  
    this.socket = io(this.url);
   }
public getNotificationMedecin = () => {
    return Observable.create((observer) => {
            this.socket.on('notifficationMedecin', (data) => {
            observer.next(data);
            }); 
    });
}
public getNotificationCRR = () => {
  return Observable.create((observer) => {
    this.socket.on('CompteRendu', (permission) => {
            observer.next(permission);
       })  
  });
}
public getNotificationPatient = () => {
  return Observable.create((observer) => {
          this.socket.on('notificationPatient', (data1) => {
            observer.next(data1);
         }); 
  });
}
public getnbrNotif = () => {
  return Observable.create((observer) => {    
    this.socket.on('nbrNotif', (data2) => {
      observer.next(data2);
    });
});        
}
}
