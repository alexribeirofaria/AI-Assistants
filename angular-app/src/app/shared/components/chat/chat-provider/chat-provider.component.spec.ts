import { ChatProviderComponent } from './chat-provider.component';

describe('ChatProviderComponent Unit Tests', () => {
  let component: ChatProviderComponent;

  beforeEach(() => {
    component = new ChatProviderComponent();
  });

  it('emits the selected provider when value is valid', () => {
    const emitSpy = spyOn(component.providerChange, 'emit');

    component.onProviderSelected('openai');

    expect(emitSpy).toHaveBeenCalledOnceWith('openai');
  });

  it('does not emit when selected value is empty', () => {
    const emitSpy = spyOn(component.providerChange, 'emit');

    component.onProviderSelected('');

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
