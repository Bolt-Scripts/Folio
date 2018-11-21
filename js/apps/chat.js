$(document).ready(() => ko.applyBindings(new ChatApp()));


function ChatApp() {
    const maxMsgs = 60;

    chatName = ko.observable("Stranger");
    chatText = ko.observable("");
    chatMessages = ko.observableArray();

    let msgsRef = database.ref("chatMessages");
    let msgDiv = $(".messages-zone")[0]
    let msgInputBox = $("#inputmsgbox")[0]

    let user = null;

    SendMsg = function () {
        if (!user) {
            return;
        }

        let msg = {
            uid: user.uid,
            date: new Date().toString(),
            text: chatText(),
            name: chatName(),
            admin: false
        }

        msgsRef.push(msg);

        chatText("");
        msgInputBox.focus();
    }

    MsgKeyCheck = function(d, e){
        if(e.keyCode == 13 || e.key == "Enter"){
            SendMsg();
            return false;
        }else{
            return true;
        }
    }

    let AddNewMsg = function (msg, bulk = false) {
        msg.date = ((d = new Date(msg.date)) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} - ${d.toLocaleTimeString()}`)();
        msg.name += ": ";
        chatMessages.push(msg);

        if (!bulk) {
            if(chatMessages().length > maxMsgs){
                chatMessages.remove(chatMessages()[0]);
            }

            msgDiv.scrollTop = msgDiv.scrollHeight;
        }
    }

    let PageLoad = async function () {
        if (firebase.auth().currentUser) {
            user = firebase.auth().currentUser;
        } else {
            user = (await firebase.auth().signInAnonymously()).user;
        }
        //console.log(user);

        msgsRef.limitToLast(maxMsgs).on("child_added", data => {
            let dataJSON = data.val();
            AddNewMsg(dataJSON);
        });

        //msgsRef.limitToLast(maxMsgs).once("value", data => {
        //    let dataJSON = data.val();
        //    let keys = Object.keys(dataJSON);
//
        //    for (let key of keys) {
        //        AddNewMsg(dataJSON[key], true);
        //    }
//
        //    msgDiv.scrollTop = msgDiv.scrollHeight;
        //}, err => console.error(err));
    }


    PageLoad();
}