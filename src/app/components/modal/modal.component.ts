import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from '../../services';

@Component({
  selector: 'apm-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() id: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
    this.element.style.display = 'none';
  }

  ngOnInit(): void {
    const modal = this;

    if (!this.id) {
      return;
    }

    document.body.appendChild(this.element);

    this.element.addEventListener('click', function (e: any) {
      if (e.target.className === 'apm-modal') {
        modal.close();
      }
    });

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('apm-modal-open');
  }

  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('apm-modal-open');
  }
}
