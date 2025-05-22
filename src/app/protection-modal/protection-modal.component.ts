import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-protection-modal',
  templateUrl: './protection-modal.component.html',
  styleUrls: ['./protection-modal.component.scss']
})
export class ProtectionModalComponent implements AfterViewInit {
  @ViewChild('modalRef', { static: false }) modalElement!: ElementRef;
  private modalInstance: any;

  ngAfterViewInit(): void {
    if (this.modalElement?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement, {});
    } else {
      console.warn('Modal element not found.');
    }
  }

  show(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
}
