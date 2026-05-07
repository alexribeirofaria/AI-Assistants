import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfirmComponent } from './confirm.modal.component';

describe('ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;
  let fixture: ComponentFixture<ModalConfirmComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let mockModalRef: any;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);
    mockModalRef = { componentInstance: { message: '' } };
    mockModalService.open.and.returnValue(mockModalRef);
    
    await TestBed.configureTestingModule({
      declarations: [ModalConfirmComponent],
      providers: [
        NgbModalConfig,
        { provide: NgbModal, useValue: mockModalService },
        { provide: NgbActiveModal, useValue: mockActiveModal }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default header', () => {
    expect(component.header).toBe('Mensagem');
  });

  it('should have empty message by default', () => {
    expect(component.message).toBe('');
  });

  it('should set message when opening', () => {
    const mockContent = {};
    component.open(mockContent, 'Test message');
    expect(mockModalService.open).toHaveBeenCalledWith(mockContent);
    expect(mockModalRef.componentInstance.message).toBe('Test message');
  });

  it('should dismiss all modals on close', () => {
    component.close();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });

  it('should execute confirm callback and close', () => {
    const confirmFn = jasmine.createSpy('confirm');
    component.setConfirmButton(confirmFn);
    component.onClickConfirm();
    expect(confirmFn).toHaveBeenCalled();
    expect(mockActiveModal.close).toHaveBeenCalled();
  });
});
