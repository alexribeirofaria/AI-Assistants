import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { ModalFormComponent } from './form.modal.component';

describe('ModalFormComponent', () => {
  let component: ModalFormComponent;
  let fixture: ComponentFixture<ModalFormComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    
    await TestBed.configureTestingModule({
      declarations: [ModalFormComponent],
      providers: [
        NgbModalConfig,
        { provide: NgbModal, useValue: mockModalService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open centered modal', () => {
    const mockContent = {};
    component.open(mockContent);
    expect(mockModalService.open).toHaveBeenCalledWith(mockContent, { centered: true });
  });

  it('should dismiss all modals on close', () => {
    component.close();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });
});
