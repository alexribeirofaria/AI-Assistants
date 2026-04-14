import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Platform } from '@ionic/angular';
import { HomeComponent } from "./home.component";
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AlertComponent } from '../../shared/components/alert-component/alert.component';

describe('HomeComponent Unit Tests', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlert: jasmine.SpyObj<AlertComponent>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlert = jasmine.createSpyObj('AlertComponent', ['open']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, FooterComponent],
      declarations: [HomeComponent],
      providers: [
        FormBuilder,
        Platform,
        { provide: Router, useValue: mockRouter },
        { provide: AlertComponent, useValue: mockAlert }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize home form', () => {
    component.ngOnInit();
    expect(component.homeForm).toBeDefined();
  });
});
