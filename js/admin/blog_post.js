

function BlogPost() {

    title = ko.observable();
    imgurl = ko.observable("");
    description = ko.observable("");
    key = ko.observable();
    msg = ko.observable("");
    tags = ko.observable("");
    cool = ko.observable(0);

    let encryptedUN = "U2FsdGVkX1+dIw2Su8v8WxWW86FuvuDt9gvfh2veI2A=";
    let formElm = $("#msform")[0];
    let posts = [];

    this.unlock = async function () {
        let UN = CryptoJS.AES.decrypt(encryptedUN, key()).toString(CryptoJS.enc.Utf8);

        firebase.auth().signInWithEmailAndPassword(UN, key())
            .then(async (creds) => {

                console.log(creds);

                let postsRef = database.ref("blogposts");
                postsRef.on("value", data => {
                    postsJSON = data.val();
                    let keys = Object.keys(postsJSON);

                    for (let key of keys) {

                        let post = posts.find(x => x.id == key);
                        let pj = postsJSON[key];

                        if (post) {
                            post.date = pj.date;
                            post.cool = pj.cool;
                            continue;
                        }

                        post = pj;
                        post.id = key;
                        posts.push(post);
                        console.log(post);
                    }
                });

                let response = await fetch('post_form.html');
                formElm.innerHTML = await response.text();

                ko.cleanNode(formElm);
                ko.applyBindings(this, formElm);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    FetchFromTitle = function(){
        
        let tit = title();
        let wantedPost = posts.find(x => x.title == tit);
        if(!wantedPost) return;

        console.log(wantedPost);

        imgurl(wantedPost.imgurl);
        description(wantedPost.description);
        msg(wantedPost.msg.join("\n"));
        tags(wantedPost.tags.join(", "));
        cool(Number(wantedPost.cool));
    }

    this.AppendInfo = function(str){
            formElm.innerHTML += `<p>${str}</p>`;

        ko.cleanNode(formElm);
        ko.applyBindings(this, formElm);
    }

    this.UpdatePost = function(existing, blogpost = {}) {
        if (blogpost.description) existing.description = blogpost.description;
        if (blogpost.msg) existing.msg = blogpost.msg;
        if (blogpost.imgurl) existing.imgurl = blogpost.imgurl;
        if (tags() && blogpost.tags) existing.tags = blogpost.tags;
        if(blogpost.cool) existing.cool = blogpost.cool

        console.log(existing);

        let postRef = database.ref(`blogposts/${existing.id}`);
        postRef.transaction(
            () => existing
        );
        let msg = "Updated Post: " + existing.id;
        this.AppendInfo(msg);
        console.log(msg);
    }

    this.post = function () {
        let blogpost = {
            title: title(),
            description: description(),
            msg: msg().split("\n"),
            imgurl: imgurl(),
            likes: 0,
            tags: tags().replace(/\s/g, '').split(","),
            date: new Date().toDateString(),
            cool: Number(cool()),
        };

        let existing = posts.find(x => x.title == blogpost.title);
        if (existing) {
            this.UpdatePost(existing, blogpost);
            return;
        }

        console.log(blogpost);

        let ref = database.ref("blogposts");
        ref.push(blogpost, (err) => {
            if (!err) {
                this.AppendInfo("Success");
            } else {
                this.AppendInfo("Failure");
            }
        });
    }
}

$(document).ready(() => ko.applyBindings(new BlogPost()));