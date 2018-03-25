import { Injectable } from '@angular/core';
import { ProfileProvider } from '../profile/profile'
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';
import { UserDataProvider } from '../user-data/user-data';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
/*
  Generated class for the FriendsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FriendsProvider {

  subConnectionType=  new BehaviorSubject({});
  constructor(private profileProvider: ProfileProvider,
              private userDataProvider: UserDataProvider) {
    console.log('Hello FriendsProvider Provider');
    // this.requestsSentSub = new ReplaySubject();
    // let currentUserUid = this.profileProvider.currentUser.uid;
  }

  listenRequestsReceived(){
    return Observable.create(observer => {
          let currentUserUid = this.profileProvider.currentUser.uid;
          let ref = firebase.database().ref(`/requests/${currentUserUid}/requestsReceived/`)
          ref.on('value',(data)=>{
            console.log(data, data.val(), data.key)
            let returnValue = data.val();
            for(let rv of Object.keys(returnValue)){
              this.updateConnectionType(rv,"REQUEST_RECEIVED")
            }
            observer.next(returnValue);
          });

      return () => {
        console.log("OFFFFFFF")
          ref.off()
      };
  })


  }
  initConnectionType(){
    return new Promise((resolve, reject)=>{
      this.getAllConnectionType().then((type)=>{
        this.subConnectionType.next(type);
        resolve(type)
      })
    })

  }

  getRequestsReceived(){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      firebase.database().ref(`/requests/${currentUserUid}/requestsReceived/`).once('value').then((data)=>{
        let requests = [];
        data.forEach((child)=> {
          let req = child.val();
          req.uid = child.key;
          requests.push(req)
          //  commentKey.push(child.key)
        });
        if(requests == null){
          requests = [];
        } 
        console.log("userIds",requests);
        resolve(requests)
      });
    })
  }

  getRequestsSent(){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      firebase.database().ref(`/requests/${currentUserUid}/requestsSent/`).once('value').then((data)=>{
        let requests = [];
        data.forEach((child, i)=> {
          let req = child.val();
          req.uid = child.key
          requests.push(req)
        });
        if(requests == null){
          requests = [];
        } 
        console.log("userIds",requests);
        resolve(requests)
      });
    })
  }

  getNotConnectedUser(){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      this.userDataProvider.getUserList().then((allUsers: any[])=>{
        let allUserKeys = allUsers.map((d)=>{
          return d.key
        })
        let notConnected = allUserKeys.filter((d)=>{
          return d != currentUserUid;
        })
        this.getRequestsReceived().then((requestsReceived: any[])=>{
          let requestsReceivedID = requestsReceived.map((d)=>{
            return d.uid;
          })
          notConnected = notConnected.filter((d)=>{
            return requestsReceivedID.indexOf(d) == -1;
          })
          this.getRequestsSent().then((requestsSent: any[])=>{
            let requestsSentID = requestsSent.map((d)=>{
              return d.uid;
            })
            notConnected = notConnected.filter((d)=>{
              return requestsSentID.indexOf(d) == -1;
            })
            this.getFriends().then((friends: any[])=>{
              let friendsID = friends.map((d)=>{
                return d.uid;
              })
              notConnected = notConnected.filter((d)=>{
                return friendsID.indexOf(d) == -1;
              })
              resolve(notConnected)
            })
          })
        })

      })
    })
  }
  getFriends(uid:any = undefined){
    return new Promise((resolve, reject)=>{
      if(uid == undefined){
        uid = this.profileProvider.currentUser.uid;
      }
      firebase.database().ref(`/friends/${uid}`).once('value').then((data)=>{
        let friends = [];
        data.forEach((child)=> {
          let req = child.val();
          req.uid = child.key;
          friends.push(req)
          //  commentKey.push(child.key)
        });
        if(friends == null){
          friends = [];
        } 
        console.log("userIds",friends);
        resolve(friends)
      });
    })
  }

  getAllConnectionType(){
    //resolve to one of 'NOT_CONNECTED' 'REQUEST_SENT' 'REQUEST_RECEIVED' 'SELF' 'FRIENDS'

    return new Promise((resolve, reject)=>{
      let currentUserUid: string = this.profileProvider.currentUser.uid;
      let requestsReceived: string[];
      let requestsSent: string[];
      let friends: string[];
      let returnObj: any = {};
      this.userDataProvider.getUserList().then((user: any[])=>{
        let uids = user.map(d => d.key)
        this.getRequestsReceived().then((_requestReceived: any[])=>{
          requestsReceived = _requestReceived.map((d)=>{
            return d.uid
          })
          this.getRequestsSent().then((_requestsSent: any[])=>{
            requestsSent = _requestsSent.map((d)=>{
              return d.uid
            })
            this.getFriends().then((_friends: any[])=>{
              friends = _friends.map((d)=>{
                return d.uid
              })
  
              //Logic begins here
              console.log('logic begins herererere')
              for(let uid of uids){
                if(uid == currentUserUid){
                  returnObj[uid] = "SELF"
                }else if(requestsReceived.indexOf(uid)>-1){
                  returnObj[uid] = "REQUEST_RECEIVED";
                }else if(requestsSent.indexOf(uid)>-1){
                  returnObj[uid] = "REQUEST_SENT";
                }else if(friends.indexOf(uid)>-1){
                  returnObj[uid] = "FRIENDS";
                }else{
                  returnObj[uid] = "NOT_CONNECTED";
                }              
              }
  
              resolve(returnObj);
            })
          })
        })
      })

    })
  }
  updateConnectionType(uid, type){
    let connectionType = this.subConnectionType.value;
    connectionType[uid] = type;
    this.subConnectionType.next(connectionType);
  }

  getConnectionType(uids: string[]){
    //resolve to one of 'NOT_CONNECTED' 'REQUEST_SENT' 'REQUEST_RECEIVED' 'SELF' 'FRIENDS'

    return new Promise((resolve, reject)=>{
    this.subConnectionType.subscribe((type)=>{
      console.log("checking type",Object.keys(type).length, type, Object.keys(type).length==0)
       if(Object.keys(type).length == 0){
         console.log("type == {} hence initializing")
         this.initConnectionType()
       }else{
        console.log("type =====", type)
         let returnObj = {}
         for(let uid of uids){
           returnObj[uid] = type[uid];
         }
         this.subConnectionType.unsubscribe();
         resolve(returnObj);
       }
      })
    })
  }
  // getConnectionType(uids: string[]){
  //   //resolve to one of 'NOT_CONNECTED' 'REQUEST_SENT' 'REQUEST_RECEIVED' 'SELF' 'FRIENDS'

  //   return new Promise((resolve, reject)=>{
  //     let currentUserUid: string = this.profileProvider.currentUser.uid;
  //     let requestsReceived: string[];
  //     let requestsSent: string[];
  //     let friends: string[];
  //     let returnObj: any = {};
      
  //     this.getRequestsReceived().then((_requestReceived: any[])=>{
  //       requestsReceived = _requestReceived.map((d)=>{
  //         return d.uid
  //       })
  //       this.getRequestsSent().then((_requestsSent: any[])=>{
  //         requestsSent = _requestsSent.map((d)=>{
  //           return d.uid
  //         })
  //         this.getFriends().then((_friends: any[])=>{
  //           friends = _friends.map((d)=>{
  //             return d.uid
  //           })

  //           //Logic begins here
  //           console.log('logic begins herererere')
  //           for(let uid of uids){
  //             if(uid == currentUserUid){
  //               returnObj[uid] = "SELF"
  //             }else if(requestsReceived.indexOf(uid)>-1){
  //               returnObj[uid] = "REQUEST_RECEIVED";
  //             }else if(requestsSent.indexOf(uid)>-1){
  //               returnObj[uid] = "REQUEST_SENT";
  //             }else if(friends.indexOf(uid)>-1){
  //               returnObj[uid] = "FRIENDS";
  //             }else{
  //               returnObj[uid] = "NOT_CONNECTED";
  //             }              
  //           }

  //           resolve(returnObj);
  //         })
  //       })
  //     })
  //   })
  // }
  addFriend(receiverUid){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      console.log(currentUserUid, receiverUid);
      let promiseArray = [];
      promiseArray[0] = firebase.database().ref(`/requests/${currentUserUid}/requestsSent/${receiverUid}`).set({
        time: firebase.database.ServerValue.TIMESTAMP
      })
      promiseArray[1] = firebase.database().ref(`/requests/${receiverUid}/requestsReceived/${currentUserUid}`).set({
        time: firebase.database.ServerValue.TIMESTAMP,
        seen: false
      })

      Promise.all(promiseArray).then(()=>{
        this.updateConnectionType(receiverUid,"REQUEST_SENT");
          resolve();
      });
    })    
  }
  cancelFriendRequest(receiverUid){
    return new Promise((resolve, reject)=>{
      console.log(receiverUid);
      let currentUserUid = this.profileProvider.currentUser.uid;
      let promiseArray = [];
      promiseArray[0] = firebase.database().ref(`/requests/${currentUserUid}/requestsSent/${receiverUid}`).remove();
      promiseArray[1] = firebase.database().ref(`/requests/${receiverUid}/requestsReceived/${currentUserUid}`).remove();
      Promise.all(promiseArray).then(()=>{
        this.updateConnectionType(receiverUid,"NOT_CONNECTED");
          resolve();
      });
    })
  }

  markFriendRequestAsSeen(receiverUid){
    console.log(receiverUid);
    let currentUserUid = this.profileProvider.currentUser.uid;
    firebase.database().ref(`/requests/${currentUserUid}/requestsReceived/${receiverUid}/seen`).set(true)
  }

  acceptFriendRequest(receiverUid){
    return new Promise((resolve, reject)=>{
      console.log(receiverUid);
      let currentUserUid = this.profileProvider.currentUser.uid;
      let promiseArray = [];
      promiseArray[0] = firebase.database().ref(`/friends/${currentUserUid}/${receiverUid}`).set({time: firebase.database.ServerValue.TIMESTAMP});
      promiseArray[1] = firebase.database().ref(`/friends/${receiverUid}/${currentUserUid}`).set({time: firebase.database.ServerValue.TIMESTAMP});
      promiseArray[2] = firebase.database().ref(`/requests/${currentUserUid}/requestsReceived/${receiverUid}`).remove();
      promiseArray[3] = firebase.database().ref(`/requests/${receiverUid}/requestsSent/${currentUserUid}`).remove();
      Promise.all(promiseArray).then(()=>{
        this.updateConnectionType(receiverUid,"FRIENDS");
          resolve();
      });
    })
  }

}
