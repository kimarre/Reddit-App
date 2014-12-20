
var subreddits = ["makeupaddiction", "muacirclejerk"];
var posts = [];

//map iteratorates over each element in the array given (ex. subreddits)
var statuses = subreddits.map( function(subreddit) {
	var url = "http://www.reddit.com/r/" + subreddit + "/hot.json?limit=4";

	// requests from URL, returns object from JSON response as data
	// stores the progress in status
	var status = $.get(url);

	status.done(function(data) {
		posts = posts.concat(data.data.children);
		console.log(posts);
	});

	return status;
});

// Checks that each status in the 'statuses' array is done. Runs this when it is.
$.when.apply($, statuses).done(function() {
	posts = posts.sort(function(post1, post2) {
		return post2.data.score - post1.data.score;
	});

	for (var i = 0; i < posts.length; i++) {
		$("#postList").append(printPosts(posts[i].data));
	}
});

function printPosts(post) {
	var title = "<h3 class='lead'><a href=\"" + post.url + "\">" + post.title + "</a></h3>";
	var details = "<p>" + post.score + " points by " + post.author + " in " 
	 + post.subreddit + "</p>";

	return "<div class = 'postEntry'>" + title + details + "</div>";	
}


// $: JQuery object
// .: class
// #: id

//<a href=""> </a>