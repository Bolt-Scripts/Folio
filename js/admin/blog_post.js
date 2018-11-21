$(document).ready(() => ko.applyBindings(new BlogPost()));


function BlogPost() {

    title = ko.observable();
    key = ko.observable();
    msg = ko.observable();
    imgurl = ko.observable();

    encryptedPage = "U2FsdGVkX191EFhs1mRvNCSdARuy+WF2AFkb5fnxZHyPEXz70VfucfyE8LEG2TyzK2Cr6rT8YCiG+yAwldiDgQ1XpDZMYaxoyPfvuJ8h/KRhsq6pyW48Z7xZ4J0aCm8KG0OtaZyC0KZ8bfZyE5o4eNTeffw5brNtcVkXk4/nuSqLYNEN7ekFGINt67paUzU20wwcXCy8LlIhMt2dKbA+cER8alps8I6EA1Q5ohxVQYHe8Qdl9a7xcsT09c/vWt8Vj5pzA06ua8uxMHPxeOSXqQI/F8NX6oaBZo+wVFtPwduHuoxR+cIXfCXjm+HnIRYqNzmbKTR5xDCx9QkITVvD2G/6rG+vs2x5XlFw3YCltli7IgdtgOyJAbWzFny+TO6G/gcPha7+qcf2Qscs2rM7QpnpQVEpTIhDeqCR+ymMDEF4C4CXvbh+asguZzQ0y4WWOasSM1GUh1nenjVy2l8CK14od7ExHnz1pRA09Iw6/592BgMJcZ/0ugvg9hJ9eOlqz7CJ988a8XaMSx+bYiRc4JDikuzvhkWDMfmyhBcx5dbaGIsn6KPxKjJgQ7ltWPgO+zZm7olJncDLX1Iw5OnqEuHui7rdHzU0EGH5qpye71Vug34XL1hRgVVnPGBswc9qyQHyiVhBh9ZC6TqHa/Ura2hzf57uuq06wwOUrjnbk1Wfz5keOWcRMT9AHS27+S4yEqv8+Wu6k0HCZ0bTk+QTAsUcZrNci6nWZ6900qrdkaA+k87NKzghwwTdJqhGjCfVSFoUWavn48CL5O5an8a4vQ==";
    encryptedUN = "U2FsdGVkX1+dIw2Su8v8WxWW86FuvuDt9gvfh2veI2A=";
    let formElm = $("#msform")[0];

    unlock = function(){
        formElm.innerHTML = CryptoJS.AES.decrypt(encryptedPage, key()).toString(CryptoJS.enc.Utf8);
        let UN = CryptoJS.AES.decrypt(encryptedUN, key()).toString(CryptoJS.enc.Utf8);

        firebase.auth().signInWithEmailAndPassword(UN, key());

        ko.cleanNode(formElm);
        ko.applyBindings(this, formElm);
    }

    post = function () {
        let ref = database.ref("blogposts");
        let blogpost = {
            title: title(),
            msg: msg(),
            imgurl: imgurl(),
            likes: 0
        };

        ref.push(blogpost, (err)=>{
            if(!err){
                formElm.innerHTML += "<p>Succes</p>"
            }else{
                formElm.innerHTML += "<p>Failure</p>"                
            }
            
            ko.cleanNode(formElm);
            ko.applyBindings(this, formElm);
        });
    }
}