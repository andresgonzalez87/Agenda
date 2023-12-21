import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meeting } from '../interfaces/meeting';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class MeetingService {

  private myAppUrl: string;
  private myApiUrl: string;
  Url = 'http://localhost:3001/api/meetings';
  url = 'http://localhost:3001/api/meetings/newmeeting';

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/meetings'
  }

  getMeetings(): Observable<Meeting[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Meeting[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers: headers })
  }

  addMeeting(meeting: Meeting): Observable<string> {
    return this.http.post<string>(this.url, meeting);
  }

  deleteMeeting(meetingId: number): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<string>(`${this.myAppUrl}${this.myApiUrl}/${meetingId}`, { headers: headers });
  }

}

