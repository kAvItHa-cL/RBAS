import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  singupForm: FormGroup;
  submitted = false;
  role = [2];
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {

  }

  ngOnInit() {
    this.singupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      adminCheck: ['']
    });
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
    console.log('Role for new User ', this.role);
    this.authService.createUser(this.f.username.value, this.f.email.value, this.f.password.value, this.role);
  }

}
