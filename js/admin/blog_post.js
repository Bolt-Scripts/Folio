

function BlogPost() {

    title = ko.observable();
    description = ko.observable("");
    key = ko.observable();
    msg = ko.observable("");
    imgurl = ko.observable("");
    tags = ko.observable("");

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

                        if (post) {
                            continue;
                        }

                        post = postsJSON[key];
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

    function UpdatePost(existing, blogpost = {}) {
        if (blogpost.description) existing.description = blogpost.description;
        if (blogpost.msg) existing.msg = blogpost.msg;
        if (blogpost.imgurl) existing.imgurl = blogpost.imgurl;
        if (tags() && blogpost.tags) existing.tags = blogpost.tags;

        console.log(existing);

        let postRef = database.ref(`blogposts/${existing.id}`);
        postRef.transaction(
            () => existing
        );
        let msg = "Updated Post: " + existing.id;
        formElm.innerHTML += "<p>" + msg + "</p>";
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
        };

        let existing = posts.find(x => x.title == blogpost.title);
        if (existing) {
            UpdatePost(existing, blogpost);
            return;
        }

        console.log(blogpost);

        let ref = database.ref("blogposts");
        ref.push(blogpost, (err) => {
            if (!err) {
                formElm.innerHTML += "<p>Success</p>"
            } else {
                formElm.innerHTML += "<p>Failure</p>"
            }

            ko.cleanNode(formElm);
            ko.applyBindings(this, formElm);
        });
    }
}

$(document).ready(() => ko.applyBindings(new BlogPost()));