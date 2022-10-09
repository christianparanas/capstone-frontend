import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
})
export class LinkifyPipe implements PipeTransform {
  constructor(private _domSanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    return this._domSanitizer.bypassSecurityTrustHtml(
      this.stylize(value, args)
    );
  }

  private stylize(text: string, voters: any): string {
    let stylizedText: string = '';
    if (text && text.length > 0) {
      for (let t of text.split(' ')) {
        if (t.startsWith('@') && t.length > 1) {
          voters.forEach((voter: any) => {
            if (t == `@${voter.username}`) {
              stylizedText += `<a href="/admin/user?id=${voter.id}" class="text-blue-500">${t}</a> `;
            }
          });
        } else stylizedText += t + ' ';
      }
      return stylizedText;
    } else return text;
  }
}
