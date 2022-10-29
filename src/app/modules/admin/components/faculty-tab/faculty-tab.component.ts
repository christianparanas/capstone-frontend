import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { FacultyService } from '../../shared/services/faculty.service';
import * as moment from 'moment';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-faculty-tab',
  templateUrl: './faculty-tab.component.html',
  styleUrls: ['./faculty-tab.component.scss'],
})
export class FacultyTabComponent implements OnInit {
  faculties: any;
  createAccountModal: boolean = false;
  submitLoading: boolean = false;
  createForm: FormGroup;
  editAccountModal: boolean = false;

  courses: any = [];

  editForm: any = {
    id: null,
    name: null,
    email: null,
    coverage: null,
  };

  cols: any[];
  exportColumns: any[];
  selectedFaculty: any[];

  constructor(
    private facultyService: FacultyService,
    private router: Router,
    private toast: HotToastService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.getFaculties();
    this.getCourses();

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      coverage: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getCourses() {
    this.courseService.getCourses().subscribe((response: any) => {
      this.courses = response;
    });
  }

  openEditModal(data: any) {
    this.editForm = {
      id: data.id,
      name: data.name,
      email: data.email,
      coverage: data.coverage,
    };

    console.log(this.editForm);
    this.editAccountModal = true;
  }

  getCourse(courseId: any) {
    let acr;

    this.courses.forEach((course: any) => {
      if (course.id == courseId) {
        acr = course.acronym;
      }
    });

    if (acr) return acr;

    return 'All Courses';
  }

  editFormSubmit() {
    if (this.editForm.name == '') {
      return this.toast.info('Name is required.');
    }

    if (this.editForm.email == '') {
      return this.toast.info('Email is required.');
    }

    this.submitLoading = true;

    this.facultyService.updateFaculty(this.editForm).subscribe(
      (response: any) => {
        this.toast.success(response.message);
        this.getFaculties();
        this.submitLoading = false;
        this.editAccountModal = false;
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  getFaculties() {
    this.facultyService.getFaculties().subscribe(
      (response: any) => {
        this.faculties = response;
      },
      (error: any) => {
        this.toast.error(error.error.message);
      }
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return;
    }

    this.submitLoading = true;

    this.facultyService.addFaculty(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getFaculties();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  momentFormatLLL(date: any) {
    return moment(date).format('lll');
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt');

    let data: any = [];

    let columns = [
      { title: "ID", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Email", dataKey: "email" },
      { title: "Coverage", dataKey: "coverage" },
      { field: 'createdAt', header: 'Date Created' },
    ];

    this.faculties.map((item: any) => {
      data.push({
        id: item.id,
        name: item.name,
        email: item.email,
        coverage: item.coverage == 0 ? "All Courses" : this.getCourse(item.coverage),
        createdAt: item.createdAt,
      });
    });

    autoTable(doc, {
      columns: columns,
      body: data,
      didDrawPage: (dataArg) => {
        doc.text('\nEvsu Election System Faculty', dataArg.settings.margin.top, 10);
      },
    });
    doc.save('EvsuElection_Faculty.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.faculties);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'EvsuElection_Faculty');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      'EvsuElection_Faculty' +
        '_export_' +
        new Date().getTime() +
        EXCEL_EXTENSION
    );
  }
}
