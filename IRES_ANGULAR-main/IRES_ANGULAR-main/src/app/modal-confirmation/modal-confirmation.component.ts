import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.css']
})
export class ModalConfirmationComponent implements OnInit {
  @Input()   titreModal : string;
  @Input()  contenuModal : string;
  @Input()    buttonConfirmation : string;
  @Input()    buttonAnnuler : string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {}
  
  confirmer() {
    this.activeModal.close(true);
  }
   annuler() {
    this.activeModal.dismiss();
  }
}
