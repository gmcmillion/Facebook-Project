//Dummy posts
var posts = [
    {
    author: 'Gregg Mcmillion',
    profilePic: '',
    postContent: 'Hello World!!',
    liked: 'false',
    comments: [
        { author: "Gregg Mcmillion", newComment: "This is my 1st comment"},
        { author: "Gregg Mcmillion", newComment: "This is my 2nd comment"}
    ]},
    {
    author: 'Marlyn Cuenca',
    profilePic: '',
    postContent: 'Goodbye World!!',
    liked: 'true',
    comments: [
        { author: "Gregg Mcmillion", newComment: "This is my 3rd comment"},
        { author: "Gregg Mcmillion", newComment: "This is my 4th comment"}
    ]},
    {
    author: 'Molly',
    profilePic: '',
    postContent: '3rd Post',
    liked: 'true',
    comments: [
    ]}
];

var row;
$(document).ready(function() {
    console.log(posts);

    //Populate feed with dummy posts
    for(var i = 0; i < posts.length; i++)
    {
        var divpost = $('<div/>').attr('class', 'post');
        var imgprof = $('<img/>').attr('src', 'images/post-prof-pic.png');      //Alter for correct prof-pics
        var span = $('<span/>').text(posts[i].author);
        var btn1 = $('<button/>').attr('class', 'down-arrow');
        var imgarrow = $('<img/>').attr('src', 'images/down-arrow.png');
        btn1.append(imgarrow);
        var p1 = $('<p/>').attr('class', 'post-content').text(posts[i].postContent);
        var divlike = $('<div/>').attr('class', 'like-comment');
        var btn2 = $('<button/>').attr('class', 'like-btn');
        if(posts[i].liked === 'true') {
            var imglike = $('<img/>').attr('src', 'images/blue-like.png'); 
            var p2 = $('<p/>').text('Like').css('color', '#5793f6'); 
        } else {
            var imglike = $('<img/>').attr('src', 'images/like.png'); 
            var p2 = $('<p/>').text('Like'); 
        }
        btn2.append(imglike).append(p2);
        var btn3 = $('<button/>').attr('class', 'comment-btn')
        var imgcomment = $('<img/>').attr('src', 'images/comment.png');   
        var p3 = $('<p/>').text('Comment'); 
        btn3.append(imgcomment).append(p3);
        divlike.append(btn2).append(btn3);
        divpost.append(imgprof).append(span).append(btn1).append(p1).append(divlike);
        $('#all-posts').append(divpost);
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
        var divpost = $('<div/>').attr('class', 'post');
        var imgprof = $('<img/>').attr('src', 'images/post-prof-pic.png');
        var span = $('<span/>').text('Gregg Mcmillion');
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
        divpost.append(imgprof).append(span).append(btn1).append(p1).append(divlike);
        $('#all-posts').prepend(divpost);
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
    $("#edit-post").click(function() {
        $("#post-dropdown").toggle();

        console.log('edit post');

        //Open modal of the post then edit the comment

    });

    //Delete post
    $("#delete-post").click(function() {
        $("#post-dropdown").toggle();

        //Delete post from html       
        $('#all-posts div:nth-child('+(row+1)+')').remove();
    });

    //Like a post
    $('#all-posts').on('click', '.like-btn', function() { 
        $(this).css({'color': '#5793f6'});                          //Change the text color
        $(this).find('img').attr('src', 'images/blue-like.png')     //Change the img    
    }); 

    //Comment on a post
    $('#all-posts').on('click', '.comment-btn', function() { 
        row = $(this).parent().parent().index();        
        
        //Toggle input box
        $('#comment-box').toggle();
    });

    //Get new comment on submit
    $('#comment-form').submit(function(e) {
        e.preventDefault();
        var comment = $('#new-comment').val();
        console.log(comment+' on row '+row);

        //Post comment under post

    });
});
