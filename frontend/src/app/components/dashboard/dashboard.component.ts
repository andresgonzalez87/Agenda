import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/interfaces/meeting';
import { ErrorService } from 'src/app/services/error.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
})

export class DashboardComponent {

  listMeeting: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  searchDate: string = '';
  firstDayOfWeek: Date = new Date();
  lastDayOfWeek: Date = new Date();
  loading: boolean = true;
  
  

  constructor(

    private _meetingService: MeetingService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getMeetings()
  }

  getMeetings() {
    this._meetingService.getMeetings().subscribe(data => {
      console.log(data);
      this.listMeeting = data;
      this.applyWeekFilter();
      this.loading = false;
    },
      (error) => {
        console.error('Error al obtener reuniones:', error);
        this.toastr.error('Ocurrió un error al obtener las reuniones', 'Error');
        this.loading = false;
      }
    );
  }

  applyWeekFilter() {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    this.filteredMeetings = this.listMeeting.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= firstDayOfWeek && meetingDate <= lastDayOfWeek;
    });
  }

  deleteMeeting(meetingId: number | undefined) {
    if (meetingId === undefined) {
      console.error('ID de reunión indefinido. No se puede eliminar.');
      return;
    }
    this._meetingService.deleteMeeting(meetingId).subscribe(
      () => {
        this.toastr.success('Reunión eliminada exitosamente', 'Éxito');
        this.getMeetings();
      },
      error => {
        console.error('Error al eliminar reunión:', error);
        this.toastr.error('Ocurrió un error al eliminar la reunión', 'Error');
      }
    );
  }

  filterMeetingsByDate() {
    if (this.searchDate && this.searchDate.trim() !== '') {
      const searchDateObj = new Date(this.searchDate);
      searchDateObj.setMinutes(searchDateObj.getMinutes() + searchDateObj.getTimezoneOffset());
      const formattedSearchDate = this.datePipe.transform(searchDateObj, 'yyyy-MM-dd');

      this.filteredMeetings = this.listMeeting.filter((meeting) => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setMinutes(meetingDate.getMinutes() + meetingDate.getTimezoneOffset());
        return this.datePipe.transform(meetingDate, 'yyyy-MM-dd') === formattedSearchDate;
      })

        .sort((a, b) => a.startTime - b.startTime);

      if (this.filteredMeetings.length === 0) {
        this.toastr.info('No hay reuniones para la fecha seleccionada', 'Información');
      }
    } else {
      const currentDate = new Date();
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

      this.filteredMeetings = this.listMeeting.filter((meeting) => {
        const meetingDate = new Date(meeting.date);
        return meetingDate >= firstDayOfWeek && meetingDate <= lastDayOfWeek;
      });

      if (this.filteredMeetings.length === 0) {
        this.toastr.warning('No hay reuniones para la semana actual', 'Advertencia');
      }
    }
  }

  formatMeetingDate(date: Date): string {
    const meetingDate = new Date(date);
    meetingDate.setMinutes(meetingDate.getMinutes() + meetingDate.getTimezoneOffset());
    return this.datePipe.transform(meetingDate, 'dd-MM-yyyy') || '';
  }
}  