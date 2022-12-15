import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { AdminService } from '../../shared/services/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.component.html',
  styleUrls: ['./admin-tab.component.scss'],
})
export class AdminTabComponent implements OnInit {
  admins: any;
  createAccountModal: boolean = false;
  editAccountModal: boolean = false;
  submitLoading: boolean = false;
  createForm: FormGroup;

  editForm: any = {
    id: null,
    name: null,
    email: null,
    position: null
  };

  cols: any[];
  exportColumns: any[];
  selectedAdmin: any[];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getAdmins();

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'position', header: 'Position' }, 
      { field: 'createdAt', header: 'Date Created' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  openEditModal(data: any) {
    this.editForm = {
      id: data.id,
      name: data.name,
      email: data.email,
      position: data.position
    };

    this.editAccountModal = true;
  }

  editFormSubmit() {
    if (this.editForm.name == '') {
      return this.toast.info('Name is required.');
    }

    if (this.editForm.email == '') {
      return this.toast.info('Email is required.');
    }

    this.submitLoading = true;

    this.adminService.updateAdmin(this.editForm).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.toast.success(response.message);
        this.getAdmins();
        this.editAccountModal = false;
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  getAdmins() {
    this.adminService.getAdmins().subscribe(
      (response: any) => {
        this.admins = response;
      },
      (error: any) => {
        this.toast.error(error.error.message);
      }
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.');
      return;
    }

    this.submitLoading = true;

    this.adminService.addAdmin(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getAdmins();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  getPosition(posId: any) {
    if (posId == 0) {
      return 'Head';
    }

    if (posId == 1) {
      return 'Scholarship Officer';
    }

    if (posId == 2) {
      return ' Administrative Aide';
    }

    if (posId == 3) {
      return 'Staff';
    }

    if (posId == 5) {
      return "Director";
    }
  }

  momentFormatLLL(date: any) {
    return moment(date).format('lll');
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt');

    autoTable(doc, {
      columns: this.exportColumns,
      body: this.admins,
      didDrawPage: (dataArg) => {
        doc.text('\nEvsu Election System Admins', dataArg.settings.margin.top, 10);
      },
    });
    doc.save('EvsuElection_Admin.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.admins);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'EvsuElection_Admin');
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
      'EvsuElection_Admin' +
        '_export_' +
        new Date().getTime() +
        EXCEL_EXTENSION
    );
  }
}
