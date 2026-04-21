import { OutputFormatter } from '../formatters/output-formatter';
import { OutputPresenter } from '../presenters/output-presenter';
import { OutputStream } from '../streams/output-stream';

describe('OutputPresenter', () => {
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
});
