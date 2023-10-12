import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResetPassComponent } from './email-reset-pass.component';

describe('EmailResetPassComponent', () => {
  let component: EmailResetPassComponent;
  let fixture: ComponentFixture<EmailResetPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailResetPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailResetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
