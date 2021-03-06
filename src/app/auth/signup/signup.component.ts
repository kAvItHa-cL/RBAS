import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  singupForm: FormGroup;
  submitted = false;
  role = [2];
  notsame = false;
  showMsg: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService) {
  }

  ngOnInit() {
    this.singupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      adminCheck: ['']
    });
    //   { validators: this.checkPasswords });
  }

  checkPasswords(pwd, cpwd) { // here we have the 'passwords' group
    // const pass = group.get('password').value;
    // const confirmPass = group.get('confirmpassword').value;
    // console.log(confirmPass)
    // if (pass !== '' && confirmPass !== '') {
    //   return pass === confirmPass ? null : { notSame: true };
    // }
    // return false;
    return pwd === cpwd ? null : { mismatch: true };

  }


  get f() { return this.singupForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.
      singupForm.invalid) {
      return;
    }
    if (this.f.adminCheck.value) {
      this.role = [1];
    }
    const value = this.checkPasswords(this.f.password.value, this.f.confirmpassword.value);
    if (!value) {
      this.authService.createUser(this.f.username.value, this.f.email.value, this.f.password.value, this.role)
        .subscribe(response => {
          this.router.navigate(['/login']);
          this.toaster.success('', 'Registration successful..!');
          this.showMsg = true;
        }, err => {
          // this.authStatusListenenr.next(false);
        });
    } else { this.notsame = true; }
  }

}
