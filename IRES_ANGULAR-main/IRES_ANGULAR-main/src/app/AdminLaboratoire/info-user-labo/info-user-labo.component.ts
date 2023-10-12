import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { ActivatedRoute, Router } from "@angular/router";
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@Component({
  selector: 'app-info-user-labo',
  templateUrl: './info-user-labo.component.html',
  styleUrls: ['./info-user-labo.component.css']
})
export class InfoUserLaboComponent implements OnInit {
  infoUserLabo: any = []
  identifiant: any;
  tracabilite: any = []
  value = 0
  //PAGINATION
  page = 1;
  liste:any=[]
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30, 50, 100];
  //RECHERCHE
  filterTerm: string;
  params = {};
  searchdate: '';
  tailleTracabilite : number
  constructor(
    private restApi: UtilisateurService, 
    public router: Router, 
    public activeRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.identifiant = this.activeRoute.snapshot.params['identifiant'];
    this.restApi.getinfoUserLabo(this.identifiant).then((response) => {
      this.infoUserLabo = response;
      this.liste=this.infoUserLabo.data
    })
    this.alltracabilite()
    // this.getdatebytracabilite()
  }
  alltracabilite() {
    this.restApi.tracabilite(this.identifiant, null).then((response) => {
      this.tracabilite = response;
      this.tailleTracabilite = this.tracabilite.historique.length
    })
  }
  getdatebytracabilite() {
    this.params = this.getRequestParams(this.searchdate);
    this.restApi.tracabilite(this.identifiant, this.params).then((response) => {
      this.tracabilite = response;
    })
  }
  onTableDataChange(event) {
    this.page = event;
    this.alltracabilite();
  }
  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.alltracabilite();
  }
  getRequestParams(searchDate): any {
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  onKey(value: string) {
    if (!value) {
      this.alltracabilite();
    }
  }
}
