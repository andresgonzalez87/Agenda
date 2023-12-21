import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent {

  formRegisterUser: FormGroup;
  loading: boolean = false;

  constructor(
    private form: FormBuilder,
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.formRegisterUser = this.form.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  addUser() {

    const userName = this.formRegisterUser.get('userName')?.value;
    const password = this.formRegisterUser.get('password')?.value;
    const confirmPassword = this.formRegisterUser.get('confirmPassword')?.value;

    if (this.formRegisterUser.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (password != confirmPassword) {
      this.toastr.error('Las contraseñas ingresadas son distintas', 'Error');
      return;
    }

    const user: User = {
      username: userName,
      password: password
    }

    this.loading = true;
    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(`El usuario ${userName} fue registrado con exito`, 'Usuario registrado');
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }
}


