EB.init({enableP2P: false, disableSendToServer: true})

function test () {
  Star.login("00inaimathi", prompt())
  var a = Star.newLink("My Starfish Fork", "https://github.com/Inaimathi/Starfish", ["meta", "github", "code", "javascript"])
  var b = Star.newPost("A test post, fair listeners", "This is just a test post. Really, we should be allowing straight-up `markdown` format here.", ["meta", "test"])
  var c = Star.newPost("Welcome!", "You can read this by clicking on it. Also, respond to posts/comments, also up/down-vote posts and comments")

  var c1 = Star.commentOn(a, "Yup, that's certainly a post...")
  var c2 = Star.commentOn(c1, "Yes siree bob.")
  var c3 = Star.commentOn(c, "Thank you. It's good to be here.")
  var c4 = Star.commentOn(c3, "Check check")
  var c5 = Star.commentOn(c4, "One. Two.")
  var c6 = Star.commentOn(c5, "Check.")
  var c7 = Star.commentOn(a, "This is a second comment.")

  Star.up(c)
  Star.up(c)
  Star.down(c)
  Star.down(a)
  Star.up(c1)
  Star.up(c1)
  Star.down(c2)
  Star.up(c5)
  Star.down(c5)
  Star.UI.renderPosts($(".posts-list"), Star.postsAndLinks)
}

$(document).ready(function () {
  Star.UI.renderNewPostForm($(".interface"));
  test()
})
