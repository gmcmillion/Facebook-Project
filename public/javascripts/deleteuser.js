$(document).ready(function() {
    $('#delete-btn').on('click', function() {
        //Generate delete url
        var post_url = "./delete/"+id;
        
        //Delete from api
        $.ajax({
            url: post_url,
            type: "DELETE"
        }).done(function(response) { 
            //Redirect to homepage
            window.location.href = '/';
        });
    });
});