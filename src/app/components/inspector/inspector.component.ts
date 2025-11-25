// inspector.component.ts
import {
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  AfterViewInit,
  inject
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { InspectorService } from '../../services/inspector.service';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent implements AfterViewInit {
  @ViewChild('tpl') tpl!: TemplateRef<any>;

  inspector = inject(InspectorService);
  vcr = inject(ViewContainerRef);

  data: any;

  ngAfterViewInit() {
    this.inspector.init(this.tpl, this.vcr);

    this.inspector.data$.subscribe(d => {
      this.data = d;
    });
  }

  close() {
    this.inspector.close();
  }
}