import { Routes } from '@angular/router';
import { DashboardComponent } from '../../AdminLaboratoire/dashboard/dashboard.component';
import { UserProfileComponent } from '../../Patient/user-profile/user-profile.component';
import { NotificationsComponent } from '../../Patient/notifications/notifications.component';
import { AdminProfilComponent } from '../../AdminLaboratoire/admin-profil/admin-profil.component';
import { GestionCompteComponent } from '../../AdminLaboratoire/gestion-compte/gestion-compte.component';
import { InfoPatientComponent } from '../../AdminLaboratoire/info-patient/info-patient.component';
import { InfoMedecinComponent } from '../../AdminLaboratoire/info-medecin/info-medecin.component';
import { InfoUserLaboComponent } from '../../AdminLaboratoire/info-user-labo/info-user-labo.component';
import { ResultatsCRRComponent } from '../../Patient/resultats-crr/resultats-crr.component';
import { ListMedecinComponent } from '../../Patient/list-medecin/list-medecin.component';
import { ContactComponent } from '../../Patient/contact/contact.component';
import { AuthenGuard } from 'app/guards/authen.guard';
import { PatientguardGuard } from 'app/guards/patientguard.guard';
import { AdminguardGuard } from 'app/guards/adminguard.guard';
import { MedecinGuard } from 'app/guards/medecin.guard';
import { ListePatientComponent } from 'app/liste-patient/liste-patient.component';
import { ResultatsPatientsComponent } from 'app/resultats-patients/resultats-patients.component';
export const AdminLayoutRoutes: Routes = [
    // patient
    { path: 'patient/user-profile',   component: UserProfileComponent , canActivate: [AuthenGuard ]},
    { path: 'patient/resultatsCRR',  component:  ResultatsCRRComponent, canActivate: [PatientguardGuard ] },
    { path: 'patient/medecins',  component:  ListMedecinComponent, canActivate: [PatientguardGuard ] },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthenGuard ]},
    { path: 'contact',  component:  ContactComponent, canActivate: [AuthenGuard ]},
    // admin laboratoire
    { path: 'adminLabo/dashboard', component: DashboardComponent , canActivate: [AdminguardGuard]},
    { path: 'adminLabo/adminProfil',  component:  AdminProfilComponent, canActivate: [AdminguardGuard] },
    { path: 'adminLabo/gestionCompte',  component:  GestionCompteComponent, canActivate: [AdminguardGuard]},
    { path: 'adminLabo/infoPatient/:identifiant',  component:  InfoPatientComponent , canActivate: [AdminguardGuard ]},
    { path: 'adminLabo/infoMedecin/:identifiant',  component:  InfoMedecinComponent , canActivate: [AdminguardGuard ]},
    { path: 'adminLabo/infoLabo /:identifiant',  component:  InfoUserLaboComponent, canActivate: [AdminguardGuard ]},
    { path: 'admin/notifications',  component: NotificationsComponent, canActivate: [AdminguardGuard ]},
    // medecin
    { path: 'medecin/listePatient',  component:  ListePatientComponent , canActivate: [ MedecinGuard ]},
    { path: 'medecin/ResultatsPatients',  component:  ResultatsPatientsComponent , canActivate: [ MedecinGuard ]},
];
