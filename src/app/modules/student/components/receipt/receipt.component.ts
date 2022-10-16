import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { PdfService } from 'src/app/core/shared/services/pdf.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  @Input() receipt: any = []
  @Input() courses: any = []

  constructor(private pdfService: PdfService) { }

  ngOnInit(): void {
  }

  dateFormat(date: any) {
    return moment(date).format('lll');
  }

  downloadPdf() {
    this.pdfService.downloadPDF(this.receipt.Election.id, "election-vote-receipt")
  }

  getCourse(type: any, CourseId: any) {
    let courseTitle = null;

    this.courses.forEach((course: any) => {
      if (course.id == CourseId) {
        if(type == 2) {
          courseTitle = course.acronym;
        }
        else {
          courseTitle = course.title;
        }
      }
    });

    return courseTitle;
  }
}
