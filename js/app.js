var consumer_key = 'JbATPcYSoF7xKtfzks0jvkdDfq8XHAQq6eYik1Bn';
var currentPage = "#main";
var xhr = new XMLHttpRequest();

//Callback triggered after an HTTP call
xhr.onload = function(e){
    resp = e.target.response;
    if(currentPage === "#detail"){
        parseDetail(resp)
    } else {
        parseList(resp);
    }
}

$.ui.ready(function(){  
    //Define a click listener on refresh button
    $("#refresh").click(function(){
        currentPage = "#main"
        //Make an HTTP call to 500px api to get "fresh" photos
        xhr.open('GET', 'https://api.500px.com/v1/photos?feature=fresh_today&consumer_key='+consumer_key);
        xhr.send();
    });
    
    //Define a click listener on refresh-near button
    $("#refresh-near").click(function(){
        currentPage = "#near"
        //Use xdk API to retrieve user position
        intel.xdk.geolocation.getCurrentPosition(function(pos){
            var geo = pos.coords.latitude+","+pos.coords.longitude+",50km";
            //Make an HTTP call to 500px api to get photos located around our position
            xhr.open('GET', 'https://api.500px.com/v1/photos/search?geo='+geo+'&consumer_key='+consumer_key);
            xhr.send();            
        });
    });
});

function loadImage(item){
    currentPage = "#detail";
    //Make an HTTP call to 500px api to get photo details
    xhr.open('GET', 'https://api.500px.com/v1/photos/'+item.id+'?consumer_key='+consumer_key);
    xhr.send();
}

//populate photo list given the json we had in response to our call to 500px API
function parseList(resp){
    var data = JSON.parse(resp);
    var images = $.map(data.photos, function(index, item){
        var img = $('<img></img>').attr('src', item.image_url).attr('title', item.name)
            .click(function(){
                //On click on photo icon, download photos details and navigate to details page, using pop animation
                loadImage(item);
                $.ui.loadContent("detail", false, false, "pop"); 
            });
        return img[0];
    });
    var items = $.map(images, function(item){
        var item =$('<li>').append(item);
        return item[0];
    });
    $(currentPage+" .list").empty().append(items);
}

//populate photo details page given the json we had in response to our call to 500px API
function parseDetail(resp){
    var data = JSON.parse(resp);
    console.log(data);
    $(currentPage+" img").attr('src', data.photo.image_url);
    $(currentPage+" .text_item").append(data.photo.name);  
}
