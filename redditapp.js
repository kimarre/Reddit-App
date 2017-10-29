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
   var form = document.getElementById("inputForm");
   var postList = document.getElementById("postList");

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
			postList.appendChild(getPosts(posts[i].data));
		}

      form.style.display = 'none';
      postList.style.display = 'block';
	});
}

function getPosts(post) {
	var title = getTitleElement(post);
	var details = getDetailsElement(post);

   var postEntry = document.createElement("div");
   postEntry.classList.add("postEntry");

   postEntry.appendChild(title);
   postEntry.appendChild(details);

   return postEntry;
}

function getTitleElement(post) {
   var title = document.createElement("h3");
   title.classList.add("lead");

   var link = document.createElement("a");
   link.href = post.url;

   var titleText = document.createTextNode(post.title);

   link.appendChild(titleText);
   title.appendChild(link);

   return title;
}

function getDetailsElement(post) {
   var details = document.createElement("p");
   var detailsText = document.createTextNode(post.score + " points by " +
    post.author + " in " + post.subreddit);

   details.appendChild(detailsText);

   return details;
}
