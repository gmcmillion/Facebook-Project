//Dummy posts (oldest -> newest)
var posts = [
    {
    author: 'Gregg Mcmillion',
    profilePic: '',
    postContent: 'Hello World!!',
    timeStamp: '2006-07-17T09:24:17Z',
    liked: false,
    comments: [
        { author: "Gregg Mcmillion", newComment: "This is my 1st comment"},
        { author: "Gregg Mcmillion", newComment: "This is my 2nd comment"}
    ]},
    {
    author: 'Marlyn Cuenca',
    profilePic: '',
    postContent: 'Goodbye World!!',
    timeStamp: '2007-07-17T09:24:17Z',
    liked: true,
    comments: [
        { author: "Gregg Mcmillion", newComment: "This is my 3rd comment"},
        { author: "Gregg Mcmillion", newComment: "This is my 4th comment"}
    ]},
    {
    author: 'Molly',
    profilePic: '',
    postContent: 'Another Post',
    timeStamp: '2017-07-17T09:24:17Z',
    liked: true,
    comments: [
    ]}
];

var row;
$(document).ready(function() {
    //Populate feed with dummy posts
    for(var i = 0; i < posts.length; i++)
    {
        var timeago = jQuery.timeago(posts[i].timeStamp);
        var divpost = $('<div/>').attr('class', 'post');
        var imgprof = $('<img/>').attr('src', 'images/post-prof-pic.png');      //Alter for correct prof-pics
        var divNameTime = $('<div/>').attr('class', 'div-name-time');
        var span = $('<span/>').text(posts[i].author);
        var time = $('<time/>').attr('class', 'timeago').text(timeago);
        divNameTime.append(span).append(time);
        var btn1 = $('<button/>').attr('class', 'down-arrow');
        var imgarrow = $('<img/>').attr('src', 'images/down-arrow.png');
        btn1.append(imgarrow);
        var p1 = $('<p/>').attr('class', 'post-content').text(posts[i].postContent);
        var divlike = $('<div/>').attr('class', 'like-comment');
        var btn2 = $('<button/>').attr('class', 'like-btn');
        if(posts[i].liked === true) {
            var imglike = $('<img/>').attr('src', 'images/blue-like.png'); 
            var p2 = $('<p/>').text('Like').attr('class', 'liked'); 
        } else {
            var imglike = $('<img/>').attr('src', 'images/like.png'); 
            var p2 = $('<p/>').text('Like').attr('class', 'unliked'); 
        }
        btn2.append(imglike).append(p2);
        var btn3 = $('<button/>').attr('class', 'comment-btn')
        var imgcomment = $('<img/>').attr('src', 'images/comment.png');   
        var p3 = $('<p/>').text('Comment'); 
        btn3.append(imgcomment).append(p3);
        divlike.append(btn2).append(btn3);
        divpost.append(imgprof).append(divNameTime).append(btn1).append(p1).append(divlike);
        $('#all-posts').prepend(divpost);
    }

    //Post submit button
    $('#post-form').submit(function(e) {
        e.preventDefault();
        var post = $('#post-input-box').val();
        this.reset();
        buildPost(post);
    });

    //Build a new post
    function buildPost(post) {
        var time = new Date();
        var isoTime = time.toISOString();

        var divpost = $('<div/>').attr('class', 'post');
        var imgprof = $('<img/>').attr('src', 'images/post-prof-pic.png');
        var span = $('<span/>').text('Gregg Mcmillion');
        var timeago = jQuery.timeago(new Date());
        var time = $('<time/>').attr('class', 'timeago').text(timeago);
        var divNameTime = $('<div/>').attr('class', 'div-name-time');
        divNameTime.append(span).append(time);
        var btn1 = $('<button/>').attr('class', 'down-arrow');
        var imgarrow = $('<img/>').attr('src', 'images/down-arrow.png');
        btn1.append(imgarrow);
        var p1 = $('<p/>').attr('class', 'post-content').text(post);
        var divlike = $('<div/>').attr('class', 'like-comment');
        var btn2 = $('<button/>').attr('class', 'like-btn');
        var imglike = $('<img/>').attr('src', 'images/like.png');   
        var p2 = $('<p/>').text('Like'); 
        btn2.append(imglike).append(p2);
        var btn3 = $('<button/>').attr('class', 'comment-btn')
        var imgcomment = $('<img/>').attr('src', 'images/comment.png');   
        var p3 = $('<p/>').text('Comment'); 
        btn3.append(imgcomment).append(p3);
        divlike.append(btn2).append(btn3);
        divpost.append(imgprof).append(divNameTime).append(btn1).append(p1).append(divlike);
        $('#all-posts').prepend(divpost);

        //Create object to add to local array
        var postObj = {
            author: 'Gregg Mcmillion', 
            profilePic: '', 
            postContent: post, 
            timeStamp: isoTime,
            liked: false, 
            comments: []
        };

        //Add to local data structure
        posts[posts.length] = postObj;
    }

    //Dropdown menu for down arrow
    $('#all-posts').on('click', '.down-arrow', function() {
        row = $(this).parent().index();

        $("#post-dropdown").css({
        'position': 'absolute',
            'left': $(this).offset().left - 55,
            'top': $(this).offset().top + $(this).height() + 8
            }).toggle(); 
    });

    //Edit post
    $('#edit-post').click(function() {
        $("#post-dropdown").toggle();   //close dropdown
        var calc = posts.length - row - 1;

        //Populate modal
        $('#modal-author').html(posts[calc].author);
        $('#modal-post-content input[type=text]').attr('value', posts[calc].postContent);

        $('#myModal').toggle();         //display modal
    });

    //Adjust currrent post with new edits
    $('#modal-post-content').submit(function() {
        var edits = $('#modal-post-content input[type=text]').val();
        var calc = posts.length - row - 1;

        //Store edit in html code
        $('#all-posts div:nth-child('+(row+1)+')').find('.post-content').html(edits);

        //Store edit in local database
        posts[calc].postContent = edits;

        //Close modal
        $('#myModal').toggle(); 
    });
    
    //When 'x' is clicked to close modal
    $('.close').click(function() {
        $('#myModal').toggle();
    });

    // Get the modal
    var modal = document.getElementById('myModal');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            $('#myModal').toggle();
        }
    }
    //Delete post
    $("#delete-post").click(function() {
        $("#post-dropdown").toggle();
        var calc = posts.length - row - 1;

        //Delete from local data structure
        posts.splice(calc, 1);

        //Delete post from html       
        $('#all-posts div:nth-child('+(row+1)+')').remove();
    });

    //Like or Unlike a post
    $('#all-posts').on('click', '.like-btn', function() { 
        //Update within local data structure
        row = $(this).parent().parent().index();
        var calc = posts.length - row - 1;

        if (posts[calc].liked === false) {
            posts[calc].liked = true;                                   //Update data
            $(this).find('p').attr('class', 'liked');                   //Change the text color
            $(this).find('img').attr('src', 'images/blue-like.png');    //Change the img  
        } else {
            posts[calc].liked = false;                                  //Update data
            $(this).find('p').attr('class', 'unliked');                 //Change the text color
            $(this).find('img').attr('src', 'images/like.png');         //Change the img  
        }
    }); 

    //Toggle comment input box to comment on a post
    $('#all-posts').on('click', '.comment-btn', function() { 
        row = $(this).parent().parent().index();    
        
        //Toggle input box
        $('.comment-input-div').toggle();
    });

    //Get new comment on submit
    $('.comment-input-form').submit(function(e) {
        e.preventDefault();
        $('.comment-input-div').toggle();
        var comment = $('.new-comment').val();
        this.reset();
        //console.log(comment+' on row '+row);

        //Post comment under post
        var div = $('<div/>').attr('class', 'comment');
        var img = $('<img/>').attr('src', 'images/post-prof-pic.png');
        var p = $('<p/>').attr('class', 'comment').text(comment);
        div.append(img).append(p);
        // NEED TO CHANGE TO APPEND TO APPROPRIATE CHILD
        $('.all-comments').append(div);

        //Add comment to data structure
    });
});
