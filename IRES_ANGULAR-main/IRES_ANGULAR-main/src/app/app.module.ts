import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { SafePipeModule } from 'safe-pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { WebSocketService } from './web-socket.service';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent} from './app.component';
// import {AgmCoreModule} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './Authentification/login/login.component';
import { ResetPasswordComponent } from './Authentification/reset-password/reset-password.component';
import { EmailResetPassComponent } from './Authentification/email-reset-pass/email-reset-pass.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { LoginguardGuard } from './guards/loginguard.guard';
import { ListePatientComponent } from './liste-patient/liste-patient.component';
import { ModalConfirmationComponent } from './modal-confirmation/modal-confirmation.component';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { MatDialogModule } from "@angular/material/dialog";
import { AdminProfilComponent } from './AdminLaboratoire/admin-profil/admin-profil.component';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatTabsModule,
    NgbModule,
    MatSlideToggleModule,
    SafePipeModule,
    NgxPaginationModule,
    MatDialogModule,
    PdfViewerModule,
    ToastrModule.forRoot(),
    // AgmCoreModule.forRoot({
    //   // apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    // })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ResetPasswordComponent,
    TestComponent,
    EmailResetPassComponent,
    ListePatientComponent,
    ModalConfirmationComponent,
    ModalAlertComponent,
    AdminProfilComponent,
  ],
  providers: [authInterceptorProviders, LoginComponent,  LoginguardGuard, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
