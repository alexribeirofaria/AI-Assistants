import { ConsoleCliService, DefaultRuntimeService } from '.';

const runtime = new DefaultRuntimeService();

if (runtime.isCliEnvironment) {
  void new ConsoleCliService().execute({ runtime });
}
