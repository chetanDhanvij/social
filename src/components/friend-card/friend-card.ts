import { Component, Input } from '@angular/core';
import { FriendsProvider } from '../../providers/friends/friends';

/**
 * Generated class for the FriendCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'friend-card',
  templateUrl: 'friend-card.html'
})
export class FriendCardComponent {

  text: string;
  @Input('data') data: any;
  constructor(private friendsProvider: FriendsProvider) {
    console.log('Hello FriendCardComponent Component');
    this.text = 'Hello World';
  }

  addFriend(user){
    console.log(user);
    this.friendsProvider.addFriend(user.key).then(()=>{

    })
  }

}
