import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  params: any;
  userid; resettoken;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.params = params;
        if (!params.token) {
          this.router.navigate(['/login']);
        } else {
          this.authService.verifyToken(params)
            .subscribe(response => {
            //  console.log('Response', response);
              if (response['code'] === 500) {
                this.router.navigate(['/login']);
              }
            });
        }

      });



    // const queryParams = `?token=${'123'}`;
    // this.http.get('localhost:3000/api/mailer/reset/' + queryParams);
    this.resetForm = this.formBuilder.group({
      newpassword: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  get f() { return this.resetForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.
      resetForm.invalid) {
      return;
    }
    const data = { param: this.params, password: this.f.newpassword.value };
    this.authService.updatePassword(data);
    // this.authService.loginUser(this.f.newpassword.value, this.f.password.value);
  }


}
