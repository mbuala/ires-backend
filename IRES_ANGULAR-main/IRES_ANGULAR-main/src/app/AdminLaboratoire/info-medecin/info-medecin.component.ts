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
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Utilisateur } from 'app/controller/models/utilisateur.model';

@Component({
  selector: 'app-info-medecin',
  templateUrl: './info-medecin.component.html',
  styleUrls: ['./info-medecin.component.css']
})

export class InfoMedecinComponent implements OnInit {
  ListeInfoPatientCRRLedecin: any = []
  identifiant: any;
  specialite:any
  liste:any=[]
  tracabilite: any = []
  //RECHERCHE
  MedecinfilterTerm: string;
  //PAGINATION
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30, 50, 100];
  value = 0
  params = {};
  ipp ='';
  filterTerm =''
  searchdate: '';
  taillePatients : number
  tailleTracabilite : number
  //RECHERCHE MEDECIN AUTO COMPLETE
  rechercheMedecin: string
  personne: Utilisateur = new Utilisateur();

  constructor(
    private restApi: UtilisateurService, 
    public router: Router, 
    public activeRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.getinfomedecin()
    this.alltracabilite()
  }
  getinfomedecin() {
    this.identifiant = this.activeRoute.snapshot.params['identifiant'];
    this.restApi.getInfoMedecin(this.identifiant).then((response) => {
      this.ListeInfoPatientCRRLedecin = response;
      this.specialite=this.ListeInfoPatientCRRLedecin.medecin.specialite
      this.liste=this.ListeInfoPatientCRRLedecin.user
      console.log(this.liste)
      this.taillePatients = this.ListeInfoPatientCRRLedecin.permission.length
      console.log(this.taillePatients)

    })
  }
  onTableDataChange(event) {
    this.page = event;
    this.getinfomedecin();
  }
  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getinfomedecin();
  }
  getactivite(searchDate): any {
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  onKeyactivite(value: string) {
    if (!value) {
      this.alltracabilite();
    }
  }
  getdatebytracabilite() {
    this.params = this.getActivite(this.searchdate);
    this.restApi.tracabilite(this.identifiant, this.params).then((response) => {
      this.tracabilite = response;
    })
  }
  getActivite(searchDate): any {
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  alltracabilite() {
    this.restApi.tracabilite(this.identifiant, null).then((response) => {      
      this.tracabilite = response;
      this.tailleTracabilite =   this.tracabilite.historique.length
      
    })
  }
}
