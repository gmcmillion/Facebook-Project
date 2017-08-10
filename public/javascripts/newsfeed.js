//Dummy posts (oldest -> newest)
// var posts = [
//     {
//     author: 'Gregg Mcmillion',
//     profilePic: '',
//     postContent: 'Hello World!!',
//     timeStamp: '2006-07-17T09:24:17Z',
//     liked: false,
//     comments: [
//         { author: "Gregg Mcmillion", newComment: "This is my 1st comment"},
//         { author: "Gregg Mcmillion", newComment: "This is my 2nd comment"}
//     ]},
//     {
//     author: 'Marlyn Cuenca',
//     profilePic: '',
//     postContent: 'Goodbye World!!',
//     timeStamp: '2007-07-17T09:24:17Z',
//     liked: true,
//     comments: [
//         { author: "Gregg Mcmillion", newComment: "This is my 3rd comment"},
//         { author: "Gregg Mcmillion", newComment: "This is my 4th comment"}
//     ]},
//     {
//     author: 'Molly',
//     profilePic: '',
//     postContent: 'Another Post',
//     timeStamp: '2017-07-17T09:24:17Z',
//     liked: true,
//     comments: [
//     ]}
// ];

var posts = [];
var row;
$(document).ready(function() {

    //Get all posts which belong to this user
    var post_url = id+"/posts";
    $.ajax({
        url: post_url,
        type: 'GET'
    }).done(function(response) {
        //Store database posts to local data structure
        for(var i = 0; i < response.length; i++) {
            posts[i] = response[i];
        }
        //Populate html
        populate(posts);
    }); 

    function populate(posts) {
        //Populate newsfeed with posts
        for(var i = 0; i < posts.length; i++)
        {
            var divpost = $('<div/>').attr('class', 'post');
            var imgprof = $('<img/>').attr('src', '/images/post-prof-pic.png');      //Alter for correct prof-pics
            var divNameTime = $('<div/>').attr('class', 'div-name-time');
            var span = $('<span/>').text(posts[i].author);
            var timeago = jQuery.timeago(posts[i].timestamp);
            var time = $('<time/>').attr('class', 'timeago').text(timeago);
            divNameTime.append(span).append(time);
            var btn1 = $('<button/>').attr('class', 'down-arrow');
            var imgarrow = $('<img/>').attr('src', '/images/down-arrow.png');
            btn1.append(imgarrow);
            var p1 = $('<p/>').attr('class', 'post-content').text(posts[i].content);
            var divlike = $('<div/>').attr('class', 'like-comment');
            var btn2 = $('<button/>').attr('class', 'like-btn');
            if(posts[i].liked === true) {
                var imglike = $('<img/>').attr('src', '/images/blue-like.png'); 
                var p2 = $('<p/>').text('Like').attr('class', 'liked'); 
            } else {
                var imglike = $('<img/>').attr('src', '/images/like.png'); 
                var p2 = $('<p/>').text('Like').attr('class', 'unliked'); 
            }
            btn2.append(imglike).append(p2);
            var btn3 = $('<button/>').attr('class', 'comment-btn')
            var imgcomment = $('<img/>').attr('src', '/images/comment.png');   
            var p3 = $('<p/>').text('Comment'); 
            btn3.append(imgcomment).append(p3);
            divlike.append(btn2).append(btn3);
            divpost.append(imgprof).append(divNameTime).append(btn1).append(p1).append(divlike);
            divAllComments = $('<div/>').attr('class', 'all-comments');
            divAllComments2 = $('<div/>').attr('class', 'comment-input-div');
            commentForm = $('<form/>').attr('class', 'comment-input-form');
            input1 = $('<input/>').attr('class', 'new-comment').attr('type', 'text').attr('placeholder', 'Write a comment...');
            input2 = $('<input/>').attr('type', 'submit').attr('class', 'comment-submit-button');
            commentForm.append(input1).append(input2);
            divAllComments2.append(commentForm);
            divAllComments.append(divAllComments2);

            //Ajax call for comments
            var post_url = posts[i].id+"/allcomments";
            $.ajax({
                url: post_url,
                type: 'GET',
                async: false,                   //TODO: find alternative for 'async: false' which is depricated
                success: function(response) {
                    if(response.length > 0)
                    {                             
                        //Append Comments
                        for(var j = 0; j < response.length; j++)
                        {
                            var div = $('<div/>').attr('class', 'comment-div');
                            var img = $('<img/>').attr('src', '/images/post-prof-pic.png');
                            var span = $('<span/>').attr('class', 'author').text(response[j].author);
                            var p = $('<p/>').attr('class', 'comment').text(response[j].comment);
                            div.append(img).append(span).append(p);
                            divAllComments.append(div);
                        }    
                    }
                }
            }); 
            divpost.append(divAllComments);
            $('#all-posts').prepend(divpost);
        }
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

        //Ajax call to post
        var post_url = id;
        $.post(post_url, {
            author: author,
            content: post,
            time: isoTime
        }).done(function(response) {  
            //Add post to local data structure
            var len = posts.length;
            posts[len] = response;

            //Generate html code for new post
            var divpost = $('<div/>').attr('class', 'post');
            var imgprof = $('<img/>').attr('src', '/images/post-prof-pic.png');
            var span = $('<span/>').text(posts[len].author);
            var timeago = jQuery.timeago(posts[len].timestamp);
            var time = $('<time/>').attr('class', 'timeago').text(timeago);
            var divNameTime = $('<div/>').attr('class', 'div-name-time');
            divNameTime.append(span).append(time);
            var btn1 = $('<button/>').attr('class', 'down-arrow');
            var imgarrow = $('<img/>').attr('src', '/images/down-arrow.png');
            btn1.append(imgarrow);
            var p1 = $('<p/>').attr('class', 'post-content').text(posts[len].content);
            var divlike = $('<div/>').attr('class', 'like-comment');
            var btn2 = $('<button/>').attr('class', 'like-btn');
            var imglike = $('<img/>').attr('src', '/images/like.png');   
            var p2 = $('<p/>').text('Like'); 
            btn2.append(imglike).append(p2);
            var btn3 = $('<button/>').attr('class', 'comment-btn')
            var imgcomment = $('<img/>').attr('src', '/images/comment.png');   
            var p3 = $('<p/>').text('Comment'); 
            btn3.append(imgcomment).append(p3);
            divlike.append(btn2).append(btn3);
            divpost.append(imgprof).append(divNameTime).append(btn1).append(p1).append(divlike);
            divAllComments = $('<div/>').attr('class', 'all-comments');
            divAllComments2 = $('<div/>').attr('class', 'comment-input-div');
            commentForm = $('<form/>').attr('class', 'comment-input-form');
            input1 = $('<input/>').attr('class', 'new-comment').attr('type', 'text').attr('placeholder', 'Write a comment...');
            input2 = $('<input/>').attr('type', 'submit').attr('class', 'comment-submit-button');
            commentForm.append(input1).append(input2);
            divAllComments2.append(commentForm);
            divAllComments.append(divAllComments2);
            divpost.append(divAllComments);
            $('#all-posts').prepend(divpost);
        });
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
        $('#modal-post-content input[type=text]').val(posts[calc].content);

        $('#myModal').toggle();         //display modal
    });

    //Add friend button
    var userid;
    $('#add-friend-btn').on('click', function(e) {
        e.preventDefault();
        var email = $('#find-friend-input-box').val();

        //Ajax call to find friend
        var post_url = email+"/findfriend";

        $.ajax({
            url: post_url,
            type: "GET"
        }).done(function(response) {
            if(response.length > 0) {
                userid = response[0].id;
                //If user is found, populate modal with response, and add button
                var p1 = $('<p/>').attr('id', 'user-found').text('USER FOUND'); 
                var p2 = $('<p/>').attr('id', 'found-user-email').text(response[0].first_name +' '+ response[0].last_name); 
                var addbtn = $('<button/>').attr('id', 'add-user-btn').attr('type', 'button').text('ADD USER');
                $('.find-friend-modal-content').append(p1).append(p2).append(addbtn);
            } else {
                //Else populate modal with message that friend was not found
                var p1 = $('<p/>').text('USER EMAIL NOT FOUND'); 
                $('.find-friend-modal-content').append(p1);
            }
                            
            //Toggle add friend modal
            $('#find-friends-modal').toggle();
        });
    });

    //Add user as friend
    $('#find-friends-modal').on('click', '#add-user-btn', function(e) {
        e.preventDefault();

        //Ajax call to add friend to friends database
        var post_url = userid+"/addfriend";
        $.ajax({
            url: post_url,
            type: "POST",
            dataType: 'json',
            data: {
                myid: id
            }
        }).done(function(response) {  
            //Close modal 
            $('#find-friends-modal').toggle();
            $('.find-friend-modal-content').find('*').not('.find-friends-close-btn').remove();
        });
    });

    //Adjust currrent post with new edits
    $('#modal-post-content').submit(function(e) {
        e.preventDefault();
        var edits = $('#modal-post-content input[type=text]').val();
        var calc = posts.length - row - 1;

        //Generate post url
        var post_url = posts[calc].id+"/editpost";

        //Patch new edit
        $.ajax({
            url: post_url,
            type: "PATCH",
            dataType: 'json',
            data: {
                edit: edits
            }
        }).done(function(response) {
            //Store edit in html code
            $('#all-posts div:nth-child('+(row+1)+')').find('.post-content').html(edits);

            //Store edit in local database
            posts[calc].postContent = edits;
        });

        //Close modal
        $('#myModal').toggle(); 
    });
    
    //When 'x' is clicked to close 'edit post' modal
    $('.edit-post-close-btn').click(function() {
        $('#myModal').toggle();
    });

    //When 'x' is clicked to close 'find friends' modal
    $('.find-friends-close-btn').click(function() {
        $('#find-friends-modal').toggle();

        //Reset modal
        $('.find-friend-modal-content').find('*').not('.find-friends-close-btn').remove();
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

        //Generate delete url
        var post_url = id+"/deletePost/"+posts[calc].id;
        
        //Delete from api
        $.ajax({
            url: post_url,
            type: "DELETE"
        }).done(function(response) { 
            //Delete from local data structure
            posts.splice(calc, 1);

            //Delete post from html       
            $('#all-posts .post:nth-child('+(row+1)+')').remove();
        });
    });

    //Like or Unlike a post
    $('#all-posts').on('click', '.like-btn', function() { 
        //Update within local data structure
        row = $(this).parent().parent().index();
        var calc = posts.length - row - 1;

        if (posts[calc].liked === false) {
            posts[calc].liked = true;                                   //Update local data
            $(this).find('p').attr('class', 'liked');                   //Change the text color
            $(this).find('img').attr('src', '/images/blue-like.png');   //Change the img  
        } else {
            posts[calc].liked = false;                                  //Update data
            $(this).find('p').attr('class', 'unliked');                 //Change the text color
            $(this).find('img').attr('src', '/images/like.png');        //Change the img  
        }

        //Generate post url
        var post_url = posts[calc].id+"/editlike";

        //Patch likes
        $.ajax({
            url: post_url,
            type: "PATCH",
            dataType: 'json',
            data: {
                like: posts[calc].liked
            }
        }).done(function(response) {

        });
    }); 

    //Toggle comment input box to comment on a post
    $('#all-posts').on('click', '.comment-btn', function() { 
        row = $(this).parent().parent().index();    
                
        //Toggle appropriate input box
        $('#all-posts div:nth-child('+(row+1)+')').find('.comment-input-div').toggle();
    });

    //Get new comment on submit
    $('#all-posts').on('submit', '.comment-input-form', function(e) {
        e.preventDefault();
        $(this).parent().toggle();  //Close input box
        var comment = $(this).find('.new-comment').val();
        this.reset();
        var calc = posts.length - row - 1;

        //Add comment to database
        var post_url = posts[calc].id+'/comment';
        
        $.post(post_url, {
            author: author,
            newComment: comment
        }).done(function(response) {  
            //Store locally
            var commlength = comments.length;
            comments[commlength] = response;

            //Post comment html under post
            var div = $('<div/>').attr('class', 'comment-div');
            var img = $('<img/>').attr('src', '/images/post-prof-pic.png');
            var span = $('<span/>').attr('class', 'author').text(response.author);
            var p = $('<p/>').attr('class', 'comment').text(response.comment);
            div.append(img).append(span).append(p);
            $('#all-posts div:nth-child('+(row+1)+') .all-comments').append(div);
        });
    });
});
