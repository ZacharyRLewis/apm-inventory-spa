import {TestBed, inject} from '@angular/core/testing';
import {ModalService} from './modal.service';

describe('ModalService', () => {
  let modalService: ModalService;

  const modal = {
    id: 'test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService]
    });

    modalService = TestBed.get(ModalService);
  });

  it('should be created', inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));

  it('should add modal', () => {
    modalService.modals = [];
    modalService.add(modal);

    expect(modalService.modals.length).toEqual(1);
    expect(modalService.modals[0]).toEqual(modal);
  });

  it('should remove modal', () => {
    modalService.modals = [modal];
    modalService.remove('test');

    expect(modalService.modals.length).toEqual(0);
  });
});
