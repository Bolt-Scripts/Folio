$(document).ready(() => ko.applyBindings(new Index()));


function Index() {

    posts = ko.observableArray();

    postsJSON = "";

    LikePost = function (post) {
        if (post.likeClicked())
            return;

        post.likeClicked(true);
        setTimeout(() => post.likeClicked(false), 95);

        let likesRef = database.ref(`blogposts/${post.id}/likes`);
        let newLikes = post.likes();
        likesRef.transaction(current => {
            return (newLikes = (current || 0) + 1);
        }, () => { post.likes(newLikes) });
    }

    PageLoad = function () {
        let postsRef = database.ref("blogposts");
        postsRef.on("value", (data) => {
            postsJSON = data.val();
            let keys = Object.keys(postsJSON).reverse();

            if (keys.length <= posts().length)
                return;

            posts.removeAll();

            for (let key of keys) {
                let post = postsJSON[key];
                post.id = key;
                post.likeClicked = ko.observable(false);
                post.likes = ko.observable(post.likes);
                posts.push(post);
            }
        });
    }



    PageLoad();
}