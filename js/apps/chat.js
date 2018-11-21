$(document).ready(() => ko.applyBindings(new ChatApp()));


function ChatApp() {

    chatName = ko.observable("Stranger");
    chatText = ko.observable("");
    chatMessages = ko.observableArray();

    msgsRef = database.ref("chatMessages");

    user = null;

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
    }

    let PageLoad = async function () {
        if (firebase.auth().currentUser) {
            user = firebase.auth().currentUser;
        } else {
            user = (await firebase.auth().signInAnonymously()).user;
        }
        //console.log(user);

        msgsRef.limitToLast(60).on("value", (data) => {
            let dataJSON = data.val();
            let keys = Object.keys(dataJSON);

            let tmpMessages = [];

            for (let key of keys) {
                let tmpMsg = dataJSON[key];
                tmpMsg.date = ((d = new Date(tmpMsg.date)) => `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()} - ${d.toLocaleTimeString()}`)();
                tmpMsg.name += ": ";
                tmpMessages.push(tmpMsg);
            }

            chatMessages(tmpMessages);
            let msgDiv = $(".messages-zone")[0]
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }, err => console.error(err));
    }


    PageLoad();
}