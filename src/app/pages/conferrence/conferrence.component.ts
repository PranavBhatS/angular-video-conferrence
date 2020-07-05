import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ClientEvent,
  Stream,
  StreamEvent,
  NgxAgoraService,
  AgoraClient,
} from 'ngx-agora';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-conferrence',
  templateUrl: './conferrence.component.html',
  styleUrls: ['./conferrence.component.scss'],
})
export class ConferrenceComponent implements OnInit {
  ltd = 'agora_pranav_local';
  rmCalls: string[] = [];

  private client: AgoraClient;
  localStream: Stream;
  private uid: number;
  constructor(
    private ngxAgoraService: NgxAgoraService,
    private router: Router,
    private clipboard: Clipboard,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.uid = this.activatedRoute.snapshot.params['id'];
  }
  ngOnDestroy(): void {
    this.leave();
  }
  ngOnInit() {
    this.client = this.ngxAgoraService.createClient({
      mode: 'rtc',
      codec: 'h264',
    });
    this.assignClientHandlers();

    // Added in this step to initialize the local A/V stream
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: true,
      video: true,
      screen: false,
    });
    this.assignLocalStreamHandlers();
    this.initLocalStream(() =>
      this.join(
        (uid) => this.publish(),
        (error) => console.error(error)
      )
    );
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(
    onSuccess?: (uid: number | string) => void,
    onFailure?: (error: Error) => void
  ): void {
    this.client.join(null, 'my-channel', this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, (err) =>
      console.log('Publish local stream error: ' + err)
    );
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }
  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.ltd);
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) => console.error('getUserMedia failed', err)
    );
  }
  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, (error) => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          (renewError) =>
            console.error('Renew channel key failed: ', renewError)
        );
      }
    });
    this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.rmCalls.length) {
        this.rmCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.rmCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.rmCalls = this.rmCalls.filter(
          (call) => call !== `${this.getRemoteId(stream)}`
        );
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }

  leave() {
    this.client.leave(
      () => {
        this.client.unpublish(this.localStream); // unpublish the camera stream
        this.localStream.close();
        this.router.navigate(['']);
      },
      (err) => {}
    );
  }
  muteAudio() {
    if (this.localStream.isAudioOn()) {
      this.localStream.muteAudio();
    } else {
      this.localStream.unmuteAudio();
    }
  }
  muteVideo() {
    if (this.localStream.isVideoOn()) {
      this.localStream.muteVideo();
    } else {
      this.localStream.unmuteVideo();
    }
  }
  copyMeetingId() {
    this.clipboard.copy(String(this.uid));
    this._snackBar.open("meeting id copied",'close',{
      duration: 5000
    })
  }
}
