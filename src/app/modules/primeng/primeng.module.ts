import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingModule } from 'primeng/rating';
import { TimelineModule } from 'primeng/timeline';
import { CheckboxModule } from 'primeng/checkbox';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    RatingModule,
    TimelineModule,
    CheckboxModule,
    TabMenuModule,
    TableModule,
    ImageModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ChartModule,
    OverlayPanelModule,
    DropdownModule,
    InputMaskModule,
    MenuModule,
    PasswordModule,
    InputSwitchModule,
  ],
})
export class PrimengModule {}
