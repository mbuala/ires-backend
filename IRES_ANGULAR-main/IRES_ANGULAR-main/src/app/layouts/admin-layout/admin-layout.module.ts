import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../AdminLaboratoire/dashboard/dashboard.component';
import { UserProfileComponent } from '../../Patient/user-profile/user-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NotificationsComponent } from '../../Patient/notifications/notifications.component';
import { ResultatsCRRComponent } from '../../Patient/resultats-crr/resultats-crr.component';
import { InfoPatientComponent } from '../../AdminLaboratoire/info-patient/info-patient.component';
import { InfoMedecinComponent } from '../../AdminLaboratoire/info-medecin/info-medecin.component';
import { InfoUserLaboComponent } from '../../AdminLaboratoire/info-user-labo/info-user-labo.component';
import { ListMedecinComponent } from '../../Patient/list-medecin/list-medecin.component';
import { ContactComponent } from '../../Patient/contact/contact.component';
import { GestionCompteComponent } from '../../AdminLaboratoire/gestion-compte/gestion-compte.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import { AuthenGuard } from 'app/guards/authen.guard';
import { AdminguardGuard } from 'app/guards/adminguard.guard';
import { LoginguardGuard } from 'app/guards/loginguard.guard';
import { PatientguardGuard } from 'app/guards/patientguard.guard';
import { authInterceptorProviders } from '../../_helpers/auth.interceptor';
import { ResultatsPatientsComponent } from '../../resultats-patients/resultats-patients.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTabsModule,
    NgxPaginationModule,
    PdfViewerModule,
    Ng2SearchPipeModule,  
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    ResultatsCRRComponent,
    ListMedecinComponent,
    ContactComponent,
    ResultatsPatientsComponent,
    GestionCompteComponent,
    InfoPatientComponent,
    InfoMedecinComponent,
    InfoUserLaboComponent
  ]
  ,
  providers: [
    authInterceptorProviders,
    AuthenGuard,
    AdminguardGuard,
    LoginguardGuard,
    PatientguardGuard,
    DatePipe
  ]
})

export class AdminLayoutModule {}
