import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbActiveModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent, AlertType } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      imports: [NgbModalModule],
      providers: [
        NgbModal,
        NgbActiveModal
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default header', () => {
    expect(component.header).toBe('Mensagem');
  });

  it('should have default message', () => {
    expect(component.message).toBe('');
  });

  it('should have alertTypeClass', () => {
    expect(component.alertTypeClass).toBe('alert alert-success mt-2');
  });

  it('should expose AlertType enum', () => {
    expect(AlertType.Success).toBe(0);
    expect(AlertType.Warning).toBe(1);
  });

  it('should close modal', () => {
    component.activeModal = { close: () => {} } as NgbActiveModal;
    spyOn(component.activeModal, 'close');
    component.close();
    expect(component.activeModal.close).toHaveBeenCalled();
  });

  it('should open modal with success type', () => {
    const mockModalRef = { componentInstance: {} } as NgbModalRef;
    spyOn(modalService, 'open').and.returnValue(mockModalRef);
    const result = component.open({} as any, 'Test', AlertType.Success);
    expect(modalService.open).toHaveBeenCalled();
    expect(result.componentInstance.alertTypeClass).toContain('alert-success');
  });

  it('should open modal with warning type', () => {
    const mockModalRef = { componentInstance: {} } as NgbModalRef;
    spyOn(modalService, 'open').and.returnValue(mockModalRef);
    const result = component.open({} as any, 'Warning', AlertType.Warning);
    expect(result.componentInstance.alertTypeClass).toContain('alert-danger');
  });
});
