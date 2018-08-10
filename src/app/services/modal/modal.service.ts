import {Injectable} from '@angular/core';

@Injectable()
export class ModalService {
  modals: any[] = [];

  public add(modal: any) {
    this.modals.push(modal);
  }

  public remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  public open(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  public close(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
