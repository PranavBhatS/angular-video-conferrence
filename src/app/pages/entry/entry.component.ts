import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MeetingJoinComponent } from '../meeting-join/meeting-join.component';

@Component({
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  constructor(private router:Router,public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  joinMeeting() {
    this.openDialog()
  }
  createMeeting() {
    this.router.navigate(['conferrence',123])
  }
  openDialog() {
    const dialogRef = this.dialog.open(MeetingJoinComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.meetingId) {
        this.router.navigate(['conferrence',result.meetingId])
      }
    });
  }
}
