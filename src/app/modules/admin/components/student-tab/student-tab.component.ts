import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { read, utils, writeFile } from 'xlsx';

import { StudentService } from '../../shared/services/student.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-student-tab',
  templateUrl: './student-tab.component.html',
  styleUrls: ['./student-tab.component.scss'],
})
export class StudentTabComponent implements OnInit {
  students: any = [];
  courses: any = [];
  pendingStudentApplications: any;

  createAccountModal: boolean = false;
  submitLoading: boolean = false;

  createForm: FormGroup;

  cols: any[];
  exportColumns: any[];
  selectedStudents: any[];

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router,
    private toast: HotToastService
  ) {}

  importedStudents: any[] = [];

  ngOnInit(): void {
    this.getStudents();
    this.getPendingStudentAccountApplications();
    this.getCourses();

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      studentID: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
      section: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });

    this.cols = [
      { field: 'StudentCredential.schoolId', header: 'Student ID' },
      { field: 'name', header: 'Name' },
      { field: 'StudentCredential.Course.acronym', header: 'Course' },
      { field: 'StudentCredential.section', header: 'Section' },
      { field: 'StudentCredential.year', header: 'Year' },
      { field: 'email', header: 'Email' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      (response: any) => {
        this.students = response;
      },
      (error: any) => {}
    );
  }

  handleImport($event: any) {
    const files = $event.target.files;

    if (files.length) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.importedStudents = rows;

          this.importStudents();
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  importStudents() {
    this.studentService
      .importStudents({ students: this.importedStudents })
      .subscribe(
        (response: any) => {
          setTimeout(() => {
            this.toast.success(response.message);
            this.getStudents();
          }, 5000);
        },
        (error: any) => {
          this.toast.error(error.message);
        }
      );
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {}
    );
  }

  getPendingStudentAccountApplications() {
    this.studentService.getPendingStudentAccountApplications().subscribe(
      (response: any) => {
        this.pendingStudentApplications = response;
      },
      (error: any) => {}
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.');
      return;
    }

    this.submitLoading = true;

    this.studentService.createStudentAccount(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getStudents();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.message);
      }
    );
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt');

    let data: any = [];

    let columns = [
      { title: 'Student ID', dataKey: 'studentId' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Email', dataKey: 'email' },
      { title: 'Course', dataKey: 'course' },
      { title: 'Section', dataKey: 'section' },
      { title: 'Year', dataKey: 'year' },
    ];

    this.students.map((item: any) => {
      data.push({
        studentId: item.StudentCredential.schoolId,
        name: item.name,
        email: item.email,
        course: item.StudentCredential.Course.acronym,
        section: item.StudentCredential.section,
        year: item.StudentCredential.year,
      });
    });

    autoTable(doc, {
      columns: columns,
      body: data,
      didDrawPage: (dataArg) => {
        doc.text(
          '\nEvsu Election System Voters',
          dataArg.settings.margin.top,
          10
        );
      },
    });
    doc.save('EvsuElection_Voters.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.students);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'EvsuElection_Voters');
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
      'EvsuElection_Voters' +
        '_export_' +
        new Date().getTime() +
        EXCEL_EXTENSION
    );
  }
}
