import { Component, OnInit,ViewChild, ElementRef , AfterViewChecked} from '@angular/core';
import {Conversation} from "../../../core/models/conversation";
import {ConversationService} from "../../../core/services/conversation.service";
import {StompSubscription} from "@stomp/stompjs";
import {WebSocketService} from "../../../core/services/web-socket.service";
import {Message} from "../../../core/models/message";
import {MessageService} from "../../../core/services/message.service";

@Component({
  selector: 'app-floating-messenger',
  templateUrl: './floating-messenger.component.html',
  styleUrls: ['./floating-messenger.component.scss']
})
export class FloatingMessengerComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  private shouldScroll = false;

  isExpanded = false;
  selectedConversation: Conversation | null = null;
  conversations: Conversation[] = [];
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  loading: boolean = false;
  newMessage = '';
  currentUserId!: number;
  private conversationSubscriptions: Map<number, StompSubscription> = new Map();

  private conversationSubscription: StompSubscription | null = null;

  constructor(private conversationService: ConversationService,
              private webSocketService: WebSocketService,
              private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadMoreConversations();

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.currentUserId = Number(storedUserId);
      setTimeout(() => {
        this.webSocketService.subscribeToUserConversations(this.currentUserId, (message) => {
          this.handleIncomingMessage(message);
        });
      }, 1000);
    } else {
      this.currentUserId = 0; // TODO handle missing user ID
    }
  }

  private handleIncomingMessage(message: Message): void {
    // If this is the selected conversation, add message and scroll
    if (this.selectedConversation?.id === message.conversationId) {
      this.selectedConversation.messages.push(message);
      this.shouldScroll = true;
    }

    // Refresh the conversation list to get updated order from backend
    this.refreshConversationList();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleMessenger(): void {
    this.isExpanded = !this.isExpanded;
    this.selectedConversation = null;
  }

  loadMoreConversations(): void {
    if (this.loading || (this.totalPages && this.page >= this.totalPages)) return;

    this.loading = true;

    this.conversationService.getAllConversation(this.page, this.size).subscribe(response => {
      this.conversations = [...this.conversations, ...response.content]; // append
      this.totalPages = response.totalPages;
      this.page++;
      this.loading = false;
    });
  }

  closeMessenger(): void {
    this.isExpanded = false;
    this.selectedConversation = null;
  }

  selectConversation(conversation: Conversation): void {
    this.conversationService.GetConversation(conversation.id).subscribe(
      (conv: Conversation) => {
        this.selectedConversation = conv;
        this.shouldScroll = true; // Trigger scroll after conversation loads
      },
      (error) => {
        console.error('Failed to fetch conversation:', error);
      }
    );
  }

  backToConversations(): void {
    this.selectedConversation = null;
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedConversation) {
      const senderId = this.currentUserId;
      // Determine the other participant id:
      const receiverId =
        this.selectedConversation.participant1Id === this.currentUserId
          ? this.selectedConversation.participant2Id
          : this.selectedConversation.participant1Id;

      const messagePayload: Message = {
        text: this.newMessage,
        senderId,
        receiverId,
        conversationId: this.selectedConversation.id,
      };

      this.messageService.sendMessage(messagePayload).subscribe(
        (savedMsg) => {
          // Add message to selected conversation for immediate UI update
          this.selectedConversation?.messages.push(savedMsg);
          this.newMessage = '';
          this.shouldScroll = true;

          // Refresh conversation list to get updated order from backend
          this.refreshConversationList();

        },
        (error) => {
          console.error('Failed to send message:', error);
        }
      );
    }
  }

  getOtherParticipant(conv: Conversation) {
    return conv.participant1Id === this.currentUserId
      ? {
        fullName: conv.participant2FullName,
        imageUrl: conv.participant2ImageUrl,
      }
      : {
        fullName: conv.participant1FullName,
        imageUrl: conv.participant1ImageUrl,
      };
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Auto-scroll failed', err);
    }
  }

  refreshConversations(): void {
    this.page = 0;
    this.conversations = [];
    this.totalPages = 0;
    this.loadMoreConversations();
  }

  // New method for refreshing conversation list while preserving pagination
  private refreshConversationList(): void {
    // Save current state
    const currentPage = this.page;
    const currentTotalPages = this.totalPages;

    // Reset and reload only the conversations we currently have
    this.page = 0;
    this.conversations = [];
    this.totalPages = 0;

    // Load conversations up to the current page
    this.loadConversationsUpToPage(currentPage);
  }

  private loadConversationsUpToPage(targetPage: number): void {
    if (this.loading || this.page > targetPage) return;

    this.loading = true;

    this.conversationService.getAllConversation(this.page, this.size).subscribe(response => {
      this.conversations = [...this.conversations, ...response.content];
      this.totalPages = response.totalPages;
      this.page++;
      this.loading = false;

      // Continue loading if we haven't reached the target page
      if (this.page <= targetPage && this.page < this.totalPages) {
        this.loadConversationsUpToPage(targetPage);
      }
    });
  }

  /*
   private calculateUnreadCount(): void {
     this.unreadCount = this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
   }*/
}
