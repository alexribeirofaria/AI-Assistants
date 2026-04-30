import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, observeOn, queueScheduler, switchMap, timer } from 'rxjs';

import { OutputPresenter } from '../../presentation/presenters/output-presenter';
import { DomainConstructor } from '../strategies/abstracts/base-application-strategy';
import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';

export interface Task {
  kind: 'message' | 'list_models';
  strategyClass: string | DomainConstructor | null;
  payload: string;
}

@Injectable()
export class ThreadController {
  private queue = new BehaviorSubject<Task[]>([]);
  private processor$ = this.queue.pipe(
    observeOn(queueScheduler),
    filter((tasks) => tasks.length > 0),
    switchMap((tasks) => timer(0).pipe(
      switchMap(() => this.processTask(tasks[0]))
    ))
  );

  constructor(
    private presenter: OutputPresenter,
    private strategyFactory: StrategyApplicationFactory
  ) {
    this.processor$.subscribe();
  }

  enqueueTask(kind: Task['kind'], strategyClass: Task['strategyClass'], payload: string): void {
    const task: Task = { kind, strategyClass, payload };
    const current = this.queue.value;
    this.queue.next([...current, task]);
  }

  private async processTask(task: Task): Promise<void> {
    try {
      const strategy = this.strategyFactory.getStrategy(task.strategyClass);
      let response = '';
      if (task.kind === 'message') {
        response = await strategy.execute(task.payload);
        this.presenter.showResponse(strategy.domainClass.getDomainName(), response);
      } else if (task.kind === 'list_models') {
        const { header, names, prefix } = await strategy.listDomains();
        this.presenter.showModelList(header, names, prefix);
      }
    } catch (error) {
      this.presenter.showWarning(`Task error: ${task.kind}`);
    } finally {
      const current = this.queue.value;
      this.queue.next(current.slice(1));
    }
  }

  stopThreads(wait = true): void {
    if (wait) {
      this.queue.complete();
    }
  }

  showElapsedTimeUntilQueueFinishes(): void {
    // RxJS timer logic for elapsed
    const start = Date.now();
    const sub = timer(0, 1000).subscribe(() => {
      if (this.queue.value.length === 0) {
        sub.unsubscribe();
        this.presenter.clearElapsedTime();
      } else {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.presenter.showElapsedTime(minutes, seconds);
      }
    });
  }
}
