import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatListModelsComponent } from './chat-list-models.component';
import { IHomeModel } from '../../../models';

describe('ChatListModelsComponent', () => {
  let component: ChatListModelsComponent;
  let fixture: ComponentFixture<ChatListModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListModelsComponent, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListModelsComponent);
    component = fixture.componentInstance;
    component.models = [
      { id: 'gpt4', modelName: 'GPT-4', provider: 'openai' },
      { id: 'gpt35', modelName: 'GPT-3.5', provider: 'openai' }
    ];
    component.selectedModel = 'gpt4';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have models input', () => {
    expect(component.models.length).toBe(2);
  });

  it('should have selectedModel input', () => {
    expect(component.selectedModel).toBe('gpt4');
  });

  it('should emit model change on selection', () => {
    spyOn(component.modelChange, 'emit');
    const event = { target: { value: 'gpt35' } } as any;
    component.onModelChange(event);
    expect(component.modelChange.emit).toHaveBeenCalledWith('gpt35');
  });

  it('should handle empty models', () => {
    component.models = [];
    fixture.detectChanges();
    expect(component.models).toEqual([]);
  });
});
