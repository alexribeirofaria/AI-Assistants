/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Categoria.service } from './categoria.service.service';

describe('Service: Categoria.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Categoria.service]
    });
  });

  it('should ...', inject([Categoria.service], (service: Categoria.service) => {
    expect(service).toBeTruthy();
  }));
});
