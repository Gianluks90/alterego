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
import { UIDiagonalLineComponent } from '../../ui/ui-diagonal-line/ui-diagonal-line.component';
import { GameAction } from '../../../models/gameAction';
import { ROOM_ACTIONS } from '../../const/roomActionsConfig';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [CommonModule, CdkDrag, UIDiagonalLineComponent],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent implements AfterViewInit {
  @ViewChild('tpl') tpl!: TemplateRef<any>;

  inspector = inject(InspectorService);
  vcr = inject(ViewContainerRef);

  input: any;
  public loadingActions: boolean = false;
  public actions: GameAction[] = [];

  ngAfterViewInit() {
    this.inspector.init(this.tpl, this.vcr);

    this.inspector.data$.subscribe(d => {
      if (!d) return;
      this.input = d;
      this.loadingActions = true;
      this.actions = ROOM_ACTIONS.filter(a => this.input.data.actionIds?.includes(a.id)) as GameAction[];
      setTimeout(() => {
        this.loadingActions = false;
      }, 1000);
    });
  }

  close() {
    this.inspector.close();
  }
}