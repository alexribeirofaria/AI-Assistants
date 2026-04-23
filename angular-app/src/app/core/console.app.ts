import { ConsoleCliService, DefaultRuntimeService } from './app';

const runtime = new DefaultRuntimeService();

/* istanbul ignore next */
if (runtime.isCliEnvironment) {
  void new ConsoleCliService().execute({ runtime });
}
