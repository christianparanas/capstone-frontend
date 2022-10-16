import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

constructor() { }

openPDF(){
  let DATA: any = document.getElementById('htmlData');
  html2canvas(DATA).then((canvas) => {
  let fileWidth = 208;
  let fileHeight = (canvas.height * fileWidth) / canvas.width;
  const FILEURI = canvas.toDataURL('image/png');
  let PDF = new jsPDF('p', 'mm', 'a4');
  let position = 0;
  PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  window.open(PDF.output('bloburl'))
});
}

downloadPDF(htmlId: any, filename: any ): void {
  let DATA: any = document.getElementById(htmlId);
  html2canvas(DATA).then((canvas) => {
    let fileWidth = 208;
    let fileHeight = (canvas.height * fileWidth) / canvas.width;
    const FILEURI = canvas.toDataURL('image/png');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    PDF.save(`${filename}.pdf`);
    // window.open(PDF.output('bloburl'))
  });

}
}