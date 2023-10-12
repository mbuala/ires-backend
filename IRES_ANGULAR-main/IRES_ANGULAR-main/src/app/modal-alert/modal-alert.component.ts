import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent implements OnInit {
  @Input()   titreModal : string;
  @Input()  contenuModal : string;
  @Input()    btnOkText : string;
  

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  
  confirmer() {
    this.activeModal.close(true);
  }
}
