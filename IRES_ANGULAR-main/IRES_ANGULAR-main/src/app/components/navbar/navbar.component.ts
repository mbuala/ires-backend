import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { WebSocketService } from 'app/web-socket.service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    currentUser: any;
    token: string ;
    prenom: string ;
    identifiant: string ;
   @Input() test :string;
    Notification:any=[];
    role : string;
    url : any;
    msg :any;

    nbr = 0;
    @Input() nbrNoti;
    @Input() messageList : any=[];
    liste : any;
    nnbr: number;
    len : number;

value:any
    val:any=[]
    constructor(location: Location,  private element: ElementRef, private router: Router,  private tokenStorageService: TokenStorageService,private restApi: UtilisateurService, private notificationsSocketService : WebSocketService) {
      this.location = location;
          this.sidebarVisible = false;




    }

    ngOnInit(){
   this.currentUser=this.tokenStorageService.getUser().user;
    this.role=this.tokenStorageService.getUser().role
    this.selectRole()
   this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
  }

    logout(): void {
        this.restApi.logout(this.currentUser.idUtilisateur)
        this.tokenStorageService.signOut();

        location.reload();
    }
    selectRole(){
        if(this.role == 'patient' || this.role == 'medecin'){

            this.url = '/patient/user-profile'
          }
          else if(this.role == 'labo' || this.role=='adminSilogik')
          {

            this.url = '/adminLabo/adminProfil'
          }
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
      
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
          
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return '';
    }
   
    OnClick(){
        this.restApi.getNotificationNonLus(this.currentUser.identifiant).then(data=>{
        this.liste=data;
        this.len=this.liste.length;
           })
    }

}
