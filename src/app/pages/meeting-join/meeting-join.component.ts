import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './meeting-join.component.html',
  styleUrls: ['./meeting-join.component.scss'],
})
export class MeetingJoinComponent implements OnInit {
  meetingId = '';
  constructor(public dialogRef: MatDialogRef<MeetingJoinComponent>) {}

  ngOnInit(): void {}
  enteredMeetingId() {
    if (!this.meetingId.trim()) return;
    this.dialogRef.close({meetingId:this.meetingId})
  }
  trim() {
    this.meetingId.trim();
  }
}
