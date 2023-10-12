import { Component, OnInit} from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  data = "bruce"
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
   currentUser: any;
  Notification:any=[];
    role : string;
   val:any=[]
   msg :any;
   msg1 :any;
   identifiant: string ;
   liste : any;
  messageList:any=[];
  nbr = 0;
  nbrNoti : number = 0;
 crr : any;
 permission: any;

  constructor( public location: Location, private router: Router, private restApi: UtilisateurService ,  private tokenStorageService: TokenStorageService, private notificationsSocketService : WebSocketService) {}
 
  ngOnInit() {
    this.currentUser=this.tokenStorageService.getUser().user;
    this.getNotificationAvecSocket();
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }

      const window_width = $(window).width();
      let $sidebar = $('.sidebar');
      let $sidebar_responsive = $('body > .navbar-collapse');
      let $sidebar_img_container = $sidebar.find('.sidebar-background');


      if(window_width > 767){
          if($('.fixed-plugin .dropdown').hasClass('show-dropdown')){
              $('.fixed-plugin .dropdown').addClass('open');
          }

      }

      $('.fixed-plugin a').click(function(event){
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if($(this).hasClass('switch-trigger')){
              if(event.stopPropagation){
                  event.stopPropagation();
              }
              else if(window.event){
                 window.event.cancelBubble = true;
              }
          }
      });

      $('.fixed-plugin .badge').click(function(){
          let $full_page_background = $('.full-page-background');


          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if($sidebar.length !== 0){
              $sidebar.attr('data-color', new_color);
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.attr('data-color',new_color);
          }
      });

      $('.fixed-plugin .img-holder').click(function(){
          let $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if($sidebar_img_container.length !=0 ){
              $sidebar_img_container.fadeOut('fast', function(){
                 $sidebar_img_container.css('background-image','url("' + new_image + '")');
                 $sidebar_img_container.fadeIn('fast');
              });
          }

          if($full_page_background.length != 0){

              $full_page_background.fadeOut('fast', function(){
                 $full_page_background.css('background-image','url("' + new_image + '")');
                 $full_page_background.fadeIn('fast');
              });
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.css('background-image','url("' + new_image + '")');
          }
      });
  }
  ngAfterViewInit() {
      this.runOnRouteChange();
  }
//   isMaps(path){
//       var titlee = this.location.prepareExternalUrl(this.location.path());
//       titlee = titlee.slice( 1 );
//       if(path == titlee){
//           return false;
//       }
//       else {
//           return true;
//       }
//   }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }
  getNotificationAvecSocket(){
     
      this.restApi.getNotificationNonLus(this.currentUser.identifiant).then(data=>{
        this.Notification=data
        this.liste=data;
    
          this.messageList.push(data);
       
     
      })
     this.restApi.countnotification(this.currentUser.identifiant).then(data=>{
       this.val=data
        this.nbrNoti = this.val.count
      })
      //lors de la reception des socket
   //recuperer notif patient
    this.notificationsSocketService
    .getNotificationPatient()
    .subscribe((message1: string) => {
     this.msg = message1;
       if(this.msg.identifiant== this.currentUser.identifiant ){
        this.nbrNoti = this.nbrNoti + this.messageList.length  ;
       
      }
   
    });
    // recupere notif medecin
    this.notificationsSocketService
    .getNotificationMedecin()
    .subscribe((message2: string) => {
     this.msg1 = message2;
       if(this.msg1.identifiant== this.currentUser.identifiant ){
        // this.messageList.push(message2);
        this.nbrNoti = this.nbrNoti + this.messageList.length  ;
       
      }
   
    });
    // recuperer nbrNotif
    this.notificationsSocketService
    .getnbrNotif()
    .subscribe((nbr: number) => {
       this.nbrNoti = nbr
    });
    //récuperer Notif CompteRendu 
    this.notificationsSocketService
    .getNotificationCRR()
    .subscribe((permission : any) => {
     this.permission = permission
     let identifiantPatient = this.permission.patient.user.identifiant
     let identifiantMedecin = this.permission.medecin.user.identifiant
     let perm = this.permission.permission
            if(identifiantPatient == this.currentUser.identifiant ){
                console.log(this.currentUser.identifiant)
                this.nbrNoti = this.nbrNoti + this.messageList.length;
            }
            if(identifiantMedecin == this.currentUser.identifiant && perm == true ){
                this.nbrNoti = this.nbrNoti + this.messageList.length;
            }
});
   }

   
   

}
