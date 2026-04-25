import { OutputFormatter } from '../formatters/output-formatter';
import { OutputPresenter } from '../presenters/output-presenter';
import { OutputStream } from '../streams/output-stream';

describe('OutputPresenter Unit Tests', () => {
  let formatter: OutputFormatter;
  let stream: jasmine.SpyObj<OutputStream>;
  let presenter: OutputPresenter;

  beforeEach(() => {
    formatter = new OutputFormatter();
    stream = jasmine.createSpyObj<OutputStream>('OutputStream', ['write', 'writeInline', 'clearInline']);
    presenter = new OutputPresenter(formatter, stream);
  });

  it('shows the UI and the help text', () => {
    presenter.showUI();
    expect(stream.write).toHaveBeenCalledTimes(2);
  });

  it('renders model list and appended blank line', () => {
    presenter.showModelList('header', ['one', 'two'], '> ');
    expect(stream.write).toHaveBeenCalledTimes(2);
    expect(stream.write).toHaveBeenCalledWith('header\n> one\n> two');
    expect(stream.write).toHaveBeenCalledWith('');
  });

  it('delegates inline and error rendering to the stream', () => {
    presenter.showElapsedTime(2, 3);
    presenter.clearElapsedTime();
    presenter.showError('boom');

    expect(stream.writeInline).toHaveBeenCalled();
    expect(stream.clearInline).toHaveBeenCalled();
    expect(stream.write).toHaveBeenCalledWith('[ERROR] boom');
  });

  it('should render model switched, interpreted input, response and loading states', () => {
    presenter.showModelSwitched('openai');
    presenter.showInterpretedInput('raw', 'interpreted');
    presenter.showResponse('OpenAI', 'hello');
    presenter.showLoadingModels();

    expect(stream.write).toHaveBeenCalledWith('\nSwitched to openai');
    expect(stream.write).toHaveBeenCalledWith("[info] Interpretei 'raw' como 'interpreted'.");
    expect(stream.write).toHaveBeenCalledWith('\n[OpenAI]: hello\n');
    expect(stream.write).toHaveBeenCalledWith('\n[info] Buscando modelos...\n');
  });

  it('should render warning and goodbye messages', () => {
    presenter.showWarning('careful');
    presenter.showGoodbye();

    expect(stream.write).toHaveBeenCalledWith('\n[warn] careful\n');
    expect(stream.write).toHaveBeenCalledWith('AI Assistant: Goodbye!');
  });

  it('creates default formatter and stream when constructor args are omitted', () => {
    const defaultPresenter = new OutputPresenter();
    expect(defaultPresenter).toBeTruthy();
  });

  it('returns formatted input prompt', () => {
    expect(presenter.getInputPrompt('Groq', 'llama')).toBe('[Groq(llama)] > ');
  });
});
