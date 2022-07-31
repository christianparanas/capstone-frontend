import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingModule } from 'primeng/rating';
import { TimelineModule } from 'primeng/timeline';
import { CheckboxModule } from 'primeng/checkbox';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import {ImageModule} from 'primeng/image';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    RatingModule,
    TimelineModule,
    CheckboxModule,
    TabMenuModule,
    TableModule,
    ImageModule
  ],
})
export class PrimengModule {}
