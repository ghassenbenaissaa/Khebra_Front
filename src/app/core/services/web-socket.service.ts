import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, StompSubscription, Frame } from '@stomp/stompjs';
import {BehaviorSubject, Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private brokerURL = 'http://localhost:8088/api/v1/ws';
  private stompClient!: Client;
  private subscription?: StompSubscription;
  private connected = false;
  private email : string;
  private toastr: ToastrService

  public notificationReceived = new Subject<void>();
  private broadcastChannel: BroadcastChannel;
  private conversationSubscriptions: Map<number, StompSubscription> = new Map();

  constructor() {
    this.broadcastChannel = new BroadcastChannel('websocket_channel');
    this.broadcastChannel.onmessage = (event) => {
      if (event.data === 'tab_opened') {
        this.disconnect();
      }
    };

    this.broadcastChannel.postMessage('tab_opened');
  }

  connect(): void {

    const token = localStorage.getItem('token') ?? '';

    //  Append token as query param (not as header)
    const socket = new SockJS(`${this.brokerURL}?token=${encodeURIComponent(token)}`);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame: Frame) => {
        this.connected = true;
        console.log('WebSocket connected:', frame);

      this.email = this.getSub(token)
        this.subscription = this.stompClient.subscribe('/queue/notification/'+this.email, (msg) => {
          this.handleIncomingMessage(msg.body);
        });

      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('WebSocket disconnected');
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate(); // cleanly closes connection
      console.log('**********************WebSocket connection closed due to another tab.');
    }
  }


  send(destination: string, payload: any): void {
    if (!this.connected) {
      console.warn('WebSocket not connected yet');
      return;
    }
    this.stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }


  private handleIncomingMessage(message: string): void {
    try {
      const parsed = JSON.parse(message);

      //  Forward the notification
      this.notificationReceived.next(parsed);
    } catch (e) {
      console.error('Failed to parse incoming message', e);
    }
  }

  //decode token and take email
  getSub(token : string): string | null {

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch {
      return null;
    }
  }


  subscribeToUserConversations(
    userId: number,
    onMessage: (msg: any) => void
  ): StompSubscription | null {
    if (!this.connected || !this.stompClient) {

      return null;
    }


    const subscription = this.stompClient.subscribe(
      `/topic/conversations/${userId}`,
      (message) => {

        try {
          const parsed = JSON.parse(message.body);

          if (parsed.senderId !== userId) {
            onMessage(parsed);
          }else{
          }

        } catch (e) {
          console.error('[WebSocket] Failed to parse user conversation message', e);
        }
      }
    );

    return subscription;
  }





}
