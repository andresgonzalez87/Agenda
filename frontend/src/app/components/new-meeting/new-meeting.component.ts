import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/interfaces/meeting';
import { ErrorService } from 'src/app/services/error.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'new-meeting-login',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})

export class NewMeetingComponent {

  formMeeting: FormGroup;

  constructor(
    private form: FormBuilder,
    private toastr: ToastrService,
    private _meetingService: MeetingService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.formMeeting = this.form.group({
      title: ['', Validators.required],
      detail: ['', Validators.required],
      date: ['', [Validators.required, this.dayLaborableValidator()]],
      startTime: ['', [Validators.required, this.startTimeValidator()]],
      duration: ['', Validators.required]
    })
  }

  dayLaborableValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        return { dayNoLaborable: true };
      }
      return null;
    };
  }

  startTimeValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) => {
      const startTime = control.value;

      if (startTime < 8 || startTime > 22) {
        return { invalidTime: true };
      }
      return null;
    };
  }

  addMeeting() {
    const title = this.formMeeting.get('title')?.value;
    const detail = this.formMeeting.get('detail')?.value;
    const date = this.formMeeting.get('date')?.value;
    const startTime = this.formMeeting.get('startTime')?.value;
    const duration = this.formMeeting.get('duration')?.value;
    console.log(this.formMeeting.value);

    if (this.formMeeting.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    const meeting: Meeting = {
      title: title,
      detail: detail,
      date: date,
      startTime: startTime,
      duration: duration
    }

    this._meetingService.addMeeting(meeting).subscribe({
      next: (v) => {
        this.toastr.success(`La reunión ${title} fue registrada con éxito`, 'Reunión registrada');
        this.router.navigate(['/dashboard']);
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.msg) {
          this.toastr.error(e.error.msg, 'Error');
        } else {
          if (e.error?.dayNoLaborable) {
            this.toastr.error('La fecha seleccionada es un día no laborable', 'Error');
          } else if (e.error?.invalidTime) {
            this.toastr.error('La hora de inicio es inválida', 'Error');
          } else {
            this._errorService.msjError(e);
          }
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}