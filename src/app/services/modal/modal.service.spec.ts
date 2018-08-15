import {TestBed, inject} from '@angular/core/testing';
import {TestDomain} from '../../model/test-domain';
import {ModalService} from './modal.service';

describe('ModalService', () => {
  let modalService: ModalService;

  const modal = TestDomain.TEST_MODAL;

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

  it('should open modal', () => {
    spyOn(modal, 'open').and.callThrough();

    modalService.modals = [modal];
    modalService.open('test');

    expect(modal.open).toHaveBeenCalled();
  });

  it('should close modal', () => {
    spyOn(modal, 'close').and.callThrough();

    modalService.modals = [modal];
    modalService.close('test');

    expect(modal.close).toHaveBeenCalled();
  });
});
