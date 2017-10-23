var posts = [];
var statuses;

var subredditForm = document.querySelector("form");

subredditForm.addEventListener("submit", function(formEvent) {
   formEvent.preventDefault(); // Prevent the page from refreshing on submit

   var inputs = formEvent.target.elements;

   var numPosts = inputs.numPosts.value;
   var subredditValues = [inputs.subreddit1, inputs.subreddit2, inputs.subreddit3,
    inputs.subreddit4, inputs.subreddit5];

   subredditValues = subredditValues.map(function(element) {
      return element.value;
   });

   subredditValues = subredditValues.filter(function(value) {
      return value != "";
   });

   loadSubreddits(subredditValues, numPosts);
});

function loadSubreddits(subreddits, numPosts) {
	// map iterates over each element in the array given (ex. subreddits)
	statuses = subreddits.map(function(subreddit) {
		var url = "https://www.reddit.com/r/" + subreddit + "/hot.json?limit=" + numPosts;

		// requests from URL, returns object from JSON response as data
		// stores the progress in status
		var status = $.get(url);

		status.done(function(data) {
			posts = posts.concat(data.data.children);
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

      $("#inputForm").hide();
      $("#postList").show();
	});
}

function printPosts(post) {
	var title = "<h3 class='lead'><a href=\"" + post.url + "\">" + post.title + "</a></h3>";
	var details = "<p>" + post.score + " points by " + post.author + " in "
	 + post.subreddit + "</p>";

	return "<div class = 'postEntry'>" + title + details + "</div>";
}
