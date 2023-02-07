(() => {

    $.getJSON("https://api.ipify.org?format=json", function (data) {

        let ip = data.ip.replace(/\./g, ",");
        let loc = (location.host + location.pathname).replace(/\./g, ",").replace(/\//g, "-");
        let pagePath = `/hitCounts/${loc}/${ip}`;
        // console.log(pagePath);

        let ref = database.ref(pagePath);
        let pageViews;
        //ref.on('value', data => {console.log(data)}, err => {});
        ref.transaction(current => { return (pageViews = (current || 0) + 1); });

        //function SetViews(views){
        //    document.getElementById("viewCounter").innerText = "Page Views: " + views;
        //}
    })


})();