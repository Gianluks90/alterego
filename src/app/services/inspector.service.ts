// inspector.service.ts
import { Injectable, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InspectorService {
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal | null = null;

  // Dati attuali dell’inspector
  private _data$ = new BehaviorSubject<any>(null);
  data$ = this._data$.asObservable();

  init(template: TemplateRef<any>, vcr: ViewContainerRef) {
    if (this.overlayRef) return;

    this.portal = new TemplatePortal(template, vcr);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().left('24px').top('120px'),
      hasBackdrop: false, // niente backdrop nel caso inspector
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  public open(data: any) {
    if (this.overlayRef) {
      const left = '24px';
      const top = '120px';
      const strategy = this.overlay.position().global().left(left).top(top);
      this.overlayRef.updatePositionStrategy(strategy);

      const pane = (this.overlayRef as any).overlayElement as HTMLElement | null;
      if (pane) {
        pane.style.transform = '';
        pane.style.left = left;
        pane.style.top = top;
      }

      this.overlayRef.updatePosition();
    }

    if (!this.overlayRef || !this.portal) {
      throw new Error('Inspector non inizializzato! Chiama init() dall\'inspector component.');
    }

    this._data$.next(data);

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
  }

  public close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}