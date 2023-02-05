$(document).ready(() => ko.applyBindings(new Index()));


function Index() {

    const allIdx = 1;

    posts = ko.observableArray();
    displayType = ko.observable("feed-grid");
    allTags = ko.observableArray(["Select", "All"]);
    selectedTags = ko.observableArray([allIdx]);
    mainPost = ko.observable();

    pageLoaded = false;

    postsJSON = "";

    tagSelector = $("#tags")[0];

    LikePost = function (post) {
        if (post.likeClicked())
            return;

        post.likeClicked(true);
        setTimeout(() => post.likeClicked(false), 95);

        let likesRef = database.ref(`blogposts/${post.id}/likes`);
        let newLikes = post.likes();
        likesRef.transaction(
            current => (newLikes = (current || 0) + 1),
            () => post.likes(newLikes)
        );
    }

    PageLoad = function () {
        let postsRef = database.ref("blogposts");

        //.on will update when new stuff comes in
        //not super necessary but it is neat
        postsRef.on("value", data => {
            postsJSON = data.val();
            let keys = Object.keys(postsJSON).reverse();

            for (let key of keys) {

                let post = posts().find(x => x.id == key);
                let pj = postsJSON[key];

                if (post) {
                    //update post
                    post.likes(pj.likes);
                    post.msg(pj.msg);
                    continue;
                }

                post = pj;

                //handle tags
                if (post.tags) {
                    let combinedTags = allTags().concat(post.tags);
                    let uniqueTags = [...new Set(combinedTags)];
                    allTags(uniqueTags);
                } else {
                    post.tags = [];
                }

                post.id = key;
                post.likeClicked = ko.observable(false);
                post.likes = ko.observable(post.likes);
                post.description = ko.observable(post.description);
                post.msg = ko.observable(post.msg);

                post.Click = function () {

                    if (post == mainPost()) return;

                    SetMainPost(post);
                }

                post.Filter = function () {

                    if (selectedTags.indexOf(allIdx) >= 0) return true;
                    if (post.tags.length == 0) return false;

                    for (let i = 0; i < selectedTags().length; i++) {
                        const tag = allTags()[selectedTags()[i]];
                        if (post.tags.indexOf(tag) >= 0) return true;
                    }

                    return false;
                }

                posts.push(post);
            }

            if (!pageLoaded) {
                LoadPostFromSearchParams();
            }

            pageLoaded = true;
        });
    }

    SetTagEnable = function (e) {
        let idx = e.index;

        let selected = selectedTags.indexOf(idx) >= 0;
        e.innerText = (selected ? "✓" : "") + allTags()[idx];
    }

    function SetTagsEnable(select) {
        for (let i = 0; i < select.length; i++) {
            const opt = select[i];
            SetTagEnable(opt);
        }
    }

    SelectTags = function (contex, e) {

        let idx = e.target.selectedIndex;

        if (idx == allIdx) {
            selectedTags.removeAll();
        } else {
            selectedTags.remove(allIdx);
        }

        if (selectedTags.indexOf(idx) == -1) {
            selectedTags.push(idx);
        } else {
            selectedTags.remove(idx);

            if (selectedTags().length == 0) {
                selectedTags.push(allIdx);
            }
        }

        SetTagsEnable(e.target);
        e.target.selectedIndex = 0;
    }



    PageLoad();
}


function SetMainPost(post) {
    
    // SmoothScrollToTop();
    SmoothScrollToElement($("#Title")[0]);

    mainPost(post);

    let searchParams = GetSearchParams();
    searchParams.set("post", post.title);
    let newPath = SearchParamsUrl(searchParams);
    window.history.pushState(newPath, "tttt", newPath);
}

function ClosePost() {
    mainPost(null);
    let searchParams = GetSearchParams();
    searchParams.delete("post");
    let newPath = SearchParamsUrl(searchParams);
    window.history.pushState(newPath, "tttt", newPath);
}

function LoadPostFromSearchParams() {
    let searchParams = GetSearchParams();
    let navPost = searchParams.get("post");
    if (navPost) {
        LoadPost(navPost);
    }
}

function LoadPost(title) {
    let post = posts().find(x => x.title == title);
    mainPost(post);
}

window.onpopstate = function (e) {
    if (!e.state) {
        mainPost(null);
        return;
    }

    LoadPostFromSearchParams();
}

//something is somehow blocking links so just manually handle it here
$(document).on('click', 'a', function (e) {

    console.log(e);
    let href = e.currentTarget.href;
    let targ = e.currentTarget.target;
    window.open(href, targ);
 });