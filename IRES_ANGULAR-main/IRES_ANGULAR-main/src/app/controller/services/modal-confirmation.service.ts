import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { ModalConfirmationComponent } from '../../modal-confirmation/modal-confirmation.component';
 import { ModalAlertComponent } from '../../modal-alert/modal-alert.component'
@Injectable({
  providedIn: 'root'
})
export class ModalConfirmationService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    titreModal: string,
    contenuModal : string,
    buttonConfirmation: string = 'Continuer',
    buttonAnnuler: string = 'Annuler',
    dialogSize: 'sm'|'md' = 'md'): Promise<boolean> {
    const modalRef = this.modalService.open(ModalConfirmationComponent, { size: dialogSize, windowClass : 'modal-center' });
    modalRef.componentInstance.titreModal = titreModal;
    modalRef.componentInstance.contenuModal = contenuModal;
    modalRef.componentInstance.buttonConfirmation =  buttonConfirmation;
    modalRef.componentInstance.buttonAnnuler = buttonAnnuler;
   
    return modalRef.result;
  }
  

  public alert(
    titreModal: string,
    contenuModal: string,
    btnOkText: string = 'Ok',
    dialogSize: 'sm'|'md' = 'md'): Promise<boolean> {
    const modalRef = this.modalService.open(ModalAlertComponent, { size: dialogSize, windowClass : 'modal-center' });
    modalRef.componentInstance. titreModal =  titreModal;
    modalRef.componentInstance.contenuModal = contenuModal;
    modalRef.componentInstance.btnOkText = btnOkText;

    return modalRef.result;
  }


}
