import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/controller/services/auth.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';

@Component({
  selector: 'app-list-medecin',
  templateUrl: './list-medecin.component.html',
  styleUrls: ['./list-medecin.component.css']
})
export class ListMedecinComponent implements OnInit {

  colonne = 'nom';
  ordrenom= 'ASC';
  ordreprenom = 'ASC';
  form = {
    nomMedecin : '',
    specialite : "" 
  };
  medecin: any;
  currentMedecin= null;
  listeMedecin:any=[];
  title = '';
  currentUser: any ;
  identifiant: string;
  currentElement :any;
  medecins : any;
  currentUsers = null;
  currentIndex = -1;
  prenom : any;
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [];
  
  onKey(value: string ) {
    if(!value){
      this.retrieveMedecinPatient(this.colonne, this.ordrenom);
    }
  }

  constructor(private tokenStorage: TokenStorageService, private authService : AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser().user;
    this.identifiant = this.currentUser.identifiant
    this.retrieveMedecinPatient(this.colonne, this.ordrenom);
  }
  getRequestParams(page, pageSize): any {
    let params = {};
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }
  handlePageChange(event): void {
    this.page = event;
    this.retrieveMedecinPatient(this.colonne, this.ordrenom);
  }

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveMedecinPatient(this.colonne, this.ordrenom);
  }
  retrieveMedecinPatient(colonne, ordre): void {
    const params = this.getRequestParams(this.page, this.pageSize);
    this.authService.getAllMedecinsPatient(params,this.form.nomMedecin, this.form.specialite, this.identifiant, colonne, ordre)
      .subscribe(
        data => {
          this.listeMedecin = data.response.users;
          const totalItems = data.response.totalItems
          this.count = totalItems;
          this.pageSizes = [10, 20, 50]
        },
        error => {
          console.log(error);
        });
  }
  setActiveElement(element, index): void {
    this.currentElement = element;
    this.currentIndex = index;
    }
  
}
