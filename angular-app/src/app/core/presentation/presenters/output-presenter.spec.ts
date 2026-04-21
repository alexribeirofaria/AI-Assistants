import { OutputFormatter } from '../formatters/output-formatter';
import { OutputStream } from '../streams/output-stream';
import { OutputPresenter } from './output-presenter';

describe('OutputPresenter', () => {
  let presenter: OutputPresenter;
  let mockFormatter: jest.Mocked<OutputFormatter>;
  let mockStream: jest.Mocked<OutputStream>;

  beforeEach(() => {
    mockFormatter = {
      formatHelp: jest.fn(),
      formatWelcome: jest.fn(),
      formatModelSwitched: jest.fn(),
      formatInterpretedInput: jest.fn(),
      formatResponse: jest.fn(),
      formatLoadingModels: jest.fn(),
      formatElapsedTime: jest.fn(),
      formatModelList: jest.fn(),
      formatWarning: jest.fn(),
      formatError: jest.fn(),
      formatGoodbye: jest.fn(),
    } as any;
    mockStream = {
      write: jest.fn(),
      writeInline: jest.fn(),
      clearInline: jest.fn(),
    } as any;
    presenter = new OutputPresenter(mockFormatter, mockStream);
  });

  it('should create an instance', () => {
    expect(presenter).toBeTruthy();
  });

  it('should show UI', () => {
    mockFormatter.formatWelcome.mockReturnValue('welcome');
    mockFormatter.formatHelp.mockReturnValue('help');
    presenter.showUI();
    expect(mockStream.write).toHaveBeenCalledWith('welcome');
    expect(mockStream.write).toHaveBeenCalledWith('help');
  });

  it('should show model switched', () => {
    const prompt = 'claude';
    mockFormatter.formatModelSwitched.mockReturnValue('switched');
    mockFormatter.formatHelp.mockReturnValue('help');
    presenter.showModelSwitched(prompt);
    expect(mockStream.write).toHaveBeenCalledWith('switched');
  });

  it('should show interpreted input', () => {
    presenter.showInterpretedInput('raw', 'interpreted');
    expect(mockFormatter.formatInterpretedInput).toHaveBeenCalledWith('raw', 'interpreted');
  });

  // Similar tests for other methods...
  it('should show response', () => {
    presenter.showResponse('domain', 'response');
    expect(mockFormatter.formatResponse).toHaveBeenCalledWith('domain', 'response');
  });

  it('should show loading models', () => {
    presenter.showLoadingModels();
    expect(mockFormatter.formatLoadingModels).toHaveBeenCalled();
  });

  it('should show elapsed time inline', () => {
    presenter.showElapsedTime(1, 23);
    expect(mockStream.writeInline).toHaveBeenCalled();
  });

  it('should clear elapsed time', () => {
    presenter.clearElapsedTime();
    expect(mockStream.clearInline).toHaveBeenCalled();
  });

  it('should show model list', () => {
    const names = ['model1'];
    presenter.showModelList('header', names);
    expect(mockStream.write).toHaveBeenCalledTimes(2);
  });

  it('should show warning', () => {
    presenter.showWarning('warn');
    expect(mockStream.write).toHaveBeenCalled();
  });

  it('should show error', () => {
    presenter.showError('error');
    expect(mockStream.write).toHaveBeenCalled();
  });

  it('should show goodbye', () => {
    presenter.showGoodbye();
    expect(mockStream.write).toHaveBeenCalled();
  });
});
