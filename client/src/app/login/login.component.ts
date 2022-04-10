import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import Validation from '../utils/validation';

@Component({
  selector: 'login-comp',
  templateUrl: './login.component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements OnInit {
  //varribles
  //incorrect email or password
  public errorSH = false;
  //user
  credentials: TokenPayload = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 0,
  };
  //validation
  form: FormGroup;
  submitted = false;
  //constructor
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
       // fullname: ['', Validators.required],
       /* username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],*/
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
       // confirmPassword: ['', Validators.required],
       // acceptTerms: [false, Validators.requiredTrue],
      },
     /* {
        validators: [Validation.match('password', 'confirmPassword')],
      }*/
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    //http request
    this.spinnerShow();
    this.auth.login(this.credentials).subscribe(
      (val) => {
        this.spinnerHide();
        this.router.navigateByUrl('/central');
      },
      (err) => {
        this.spinnerHide();
        this.errorSH = true;
      }
    );
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  /*login() {
    this.spinnerShow();
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/central');
      },
      (err) => {
        // console.error(err)
        console.log('helytelen email vagy jelszó vagy mindkettő');
        this.spinnerHide();
        this.errorSH = true;
      }
    );
  }*/
  spinnerShow() {
    this.spinner.show();
  }

  spinnerHide() {
    this.spinner.hide();
  }
}
