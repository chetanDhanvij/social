import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user:any = {};
  newMsg: string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private chatProvider: ChatProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.user = this.navParams.get("user");
  }

  sendMsg(){
    this.chatProvider.sendMsg(this.user.key,{
      type: "text",
      text: this.newMsg
    }).then(()=>{
    }).catch(()=>{
    })
  }

}
