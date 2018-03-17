
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the SqlChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlChatProvider {
  private dbName: string = 'data.db';
  constructor(private sqlite: SQLite) {
    console.log('Hello SqlChatProvider Provider');
  }

  init(){
    return new Promise((resolve,reject)=>{
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      })
      .then((db: SQLiteObject) => { 
        db.executeSql('CREATE TABLE IF NOT EXISTS tbl_chats (msgId TEXT, fromUser TEXT, toUser TEXT, type TEXT, text TEXT, img TEXT, datetime NUMERIC, PRIMARY KEY(msgId, toUser))', {})
        .then(() =>{
          console.log('Executed SQL'); 
          resolve();
        } )
        .catch(e => console.log(e));  
      })
      .catch(e =>{
        console.log(e); 
        reject(e);
      });
    })
  }

  sendMsg(msgId, fromUser, toUser, type, text, img, datetime){
    return new Promise((resolve,reject)=>{
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      })
      .then((db: SQLiteObject) => { 
        let query = "INSERT INTO tbl_chats (msgId, fromUser, toUser, type, text, img, datetime) VALUES (?,?,?,?,?,?,?)";
        db.executeSql(query, [msgId, fromUser, toUser, type, text, img, datetime])
        .then(() =>{
          this.readAll(db);
          console.log('sendMsg added to database');
          resolve()
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });  
      })
      .catch(e => console.log(e));
    })
  }

  readAll(db){
    return new Promise((resolve,reject)=>{
        let query = "SELECT * from tbl_chats";
        db.executeSql(query,[])
        .then((res) =>{
            let _res= [];
            console.log(res)
            for(var i=0; i<res.rows.length; i++) {
              _res.push(res.rows.item(i))
            }
            console.log(_res)
          console.log('test read');
          resolve(_res)
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });  
    })
  }

  chatList(){}

}
