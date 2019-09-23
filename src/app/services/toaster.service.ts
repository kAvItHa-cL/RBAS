import { Injectable } from '@angular/core';
declare var toastr: any;
@Injectable({ providedIn: 'root' })
export class ToasterService {
  constructor() { }

  success(title?: string, message?: string) {
    toastr.success(title, message);
  }


  info(title?: string, message?: string) {
    toastr.info(title, message);
  }


  warning(title?: string, message?: string) {
    toastr.warning(title, message);
  }

  error(title?: string, message?: string) {
    toastr.error(title, message);
  }


}
