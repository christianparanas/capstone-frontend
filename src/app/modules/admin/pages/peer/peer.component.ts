import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';
import { EventService } from '../../shared/services/event.service';
import { TweetService } from '../../shared/services/tweet.service';
import { ElectionService } from '../../shared/services/election.service';

@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss'],
})
export class PeerComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  user: any = [];
  profile: any = [];
  userId: any;
  chatModal: boolean = false;

  chatId: any = null;
  message: string = '';

  chat: any = [];
  currentChatId: any = '';

  tweets: any = [];
  tweet: any = '';

  submitLoading: boolean = false;
  isLoading: boolean = true;
  reactLoading: boolean = false;
  tweetCommentsModal: boolean = false;
  comment: string = '';
  comments: any = [];
  commentTweetId: any = '';
  tweetPostOwner: any = null;

  voters: any = [];
  mentionItems: any = [];

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private location: Location,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private chatService: ChatService,
    private eventService: EventService,
    private tweetService: TweetService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;
      this.getProfile();
    });

    this.getNewMsgEvent();
    this.getTweetEvent();
  }

  getNewMsgEvent() {
    this.eventService.newMsg().subscribe((response: any) => {
      if (response.receiverId == this.profile.id) {
        this.chat.push({
          message: response.message,
          UserId: response.senderId,
        });
      }
    });
  }

  openChat() {
    this.eventService.closeChat(this.currentChatId);

    const data = {
      userOneId: this.user.id,
      userTwoId: this.profile.id,
    };

    this.chatService.getChat(data).subscribe(
      (response: any) => {
        response.forEach((res: any) => {
          if (res.Chat.ChatParticipants[0].UserId == this.user.id) {
            this.chat = res.Chat.ChatMessages;
            this.chatId = res.Chat.id;

            this.currentChatId = res.Chat.id;
            this.eventService.openChat(this.chatId);
          }
        });
      },
      (error: any) => {}
    );

    this.chatModal = true;
    this.scrollToBottom();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        if (this.userId == response.id) {
          return this.router.navigate(['/account']);
        }

        this.profile = response;

        this.getVoters();
        this.getUser(this.userId);
      },
      (error: any) => {}
    );
  }

  getUser(id: any) {
    this.userService.getUser(id).subscribe(
      (response: any) => {
        this.user = response;

        this.tweets = response.Tweets;

        response.Tweets.forEach((tweet: any) => {
          if (tweet.id == this.commentTweetId) {
            this.comments = tweet.TweetComments;
          }
        });

        this.submitLoading = false;
      },
      (error: any) => {}
    );
  }

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).fromNow();
  }

  chatTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  sendMessage() {
    if (this.message == '') {
      return this.toast.info('Please type something.', {
        position: 'top-right',
      });
    }

    this.chat.push({
      UserId: this.profile.id,
      message: this.message,
      createdAt: new Date(),
    });

    this.eventService.sendMsg({
      chatId: this.chatId,
      receiverId: this.user.id,
      senderId: this.profile.id,
      message: this.message,
    });

    this.scrollToBottom();
    this.message = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  scroll() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  getTweetEvent() {
    this.eventService.getTweetEvent().subscribe((response: any) => {
      this.getUser(this.userId);
    });
  }

  openCommentModal(tweetId: any) {
    this.tweetCommentsModal = true;

    this.tweets.forEach((tweet: any) => {
      if (tweet.id == tweetId) {
        this.comments = tweet.TweetComments;

        this.tweetPostOwner = tweet.User.id;
      }
    });

    this.commentTweetId = tweetId;
  }

  commentTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  checkReactors(reactors: any) {
    let bool;

    reactors.forEach((reactor: any) => {
      if (reactor.UserId == this.profile.id) {
        bool = true;
        return;
      }
    });

    return bool;
  }

  reactTweet(tweetId: number) {
    if (this.reactLoading == true) {
      return;
    }

    this.reactLoading = true;

    this.tweetService
      .reactTweet({
        tweetId: tweetId,
        receiverId: this.user.id,
        senderId: this.profile.id,
      })
      .subscribe(
        (response: any) => {
          this.reactLoading = false;
          this.getUser(this.userId);
          this.eventService.sendTweetEvent();
        },
        (error: any) => {
          console.log(error);
          this.reactLoading = false;
        }
      );
  }

  postComment() {
    if (this.comment.trim() == '') {
      this.toast.info('Please type something.');
      return;
    }

    const data: any = {
      tweetId: this.commentTweetId,
      comment: this.comment,
      receiverId: this.tweetPostOwner,
      senderId: this.profile.id,
    };

    this.tweetService.postTweetComment(data).subscribe(
      (response: any) => {
        this.getUser(this.userId);
        this.comment = '';
        this.eventService.sendTweetEvent();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  navigateToUser(id: any) {
    if (id == this.profile.id) {
      return this.router.navigate([`/account`]);
    }

    this.router.navigate([`/user`], {
      queryParams: { id: id },
    });
  }

  getVoters() {
    const data = {
      course: 0,
      section: 0,
      year: 0,
    };

    this.electionService.getVoters(data).subscribe(
      (response: any) => {
        this.voters = response;

        response.forEach(async (voter: any) => {
          if (voter.id == this.profile) {
            return;
          }

          this.mentionItems.push(voter.username);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
