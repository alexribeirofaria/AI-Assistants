import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatProviderComponent } from './chat-provider.component';

describe('ChatProviderComponent', () => {
  let component: ChatProviderComponent;
  let fixture: ComponentFixture<ChatProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatProviderComponent, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatProviderComponent);
    component = fixture.componentInstance;
    component.providers = ['openai', 'groq', 'anthropic'];
    component.selectedProvider = 'openai';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have providers input', () => {
    expect(component.providers).toEqual(['openai', 'groq', 'anthropic']);
  });

  it('should have selectedProvider input', () => {
    expect(component.selectedProvider).toBe('openai');
  });

  it('should emit provider change on onProviderChange', () => {
    spyOn(component.providerChange, 'emit');
    
    const event = { target: { value: 'groq' } } as any;
    component.onProviderChange(event);
    
    expect(component.providerChange.emit).toHaveBeenCalledWith('groq');
  });

  it('should handle empty providers', () => {
    component.providers = [];
    fixture.detectChanges();
    expect(component.providers).toEqual([]);
  });
});
