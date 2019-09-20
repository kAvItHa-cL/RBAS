import { PasswordResetMailerService } from './../../Mailer/password-reset-mailer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  fpForm: FormGroup;
  submitted = false;
  message: string;

  constructor(private formBuilder: FormBuilder, private resetMailService: PasswordResetMailerService) {

  }

  ngOnInit() {
    this.fpForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get f() { return this.fpForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.
      fpForm.invalid) {
      return;
    }
    //console.log('Email ', this.f.email.value);
    this.resetMailService.sendMail(this.f.email.value)

      .subscribe(() => {
        this.message = ' We have sent a Password Reset Link to your account ';
      })
      ;
  }


}
