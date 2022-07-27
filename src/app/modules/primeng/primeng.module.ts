import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RatingModule} from 'primeng/rating';
import {TimelineModule} from 'primeng/timeline';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    RatingModule,
    TimelineModule
  ]
})
export class PrimengModule { }
