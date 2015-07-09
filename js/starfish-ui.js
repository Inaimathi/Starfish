Star.UI = {}

Star.UI.into = function ($elem, elemType, cssClass) {
  var el = document.createElement(elemType)
  if (cssClass) {
    el.classList.add(cssClass)
  }
  $elem.append(el)
  return $(el)
}

Star.UI.clear = function () {
  console.log("Clearing UI...")
}

Star.UI.showUser = function () {
  console.log("Showing user...")
}

Star.UI.showError = function (message) {
  console.log("ERROR", message)
}

Star.UI.renderPosts = function ($elem, postIds) {
  $elem.empty()
  postIds.map(function (id) {
    var puff = Star.G.v(id).run()[0].puff
    Star.UI.renderPostItem(Star.UI.into($elem, "div", "post"), puff)
  })
}

Star.UI.renderPostItem = function ($elem, puff) {
  var voteCount = Star.G.v(puff.sig).in('downvote', 'upvote').run().length
  var comments = Star.G.v(puff.sig).in('comment').run()
  $elem.append("<span>" + puff.payload.title + " -- Votes " + voteCount + ", Mentions " + comments.length + "</div>")
}

Star.UI.renderPostComments = function ($elem, id) {
  $elem.empty()
  var q = Star.G.v(id).in('comment')
  var res = q.run()
  while (res) {
    Star.UI.renderComment(Star.UI.into($elem, "div"))
  }
}

Star.UI.renderComment = function ($elem, puff) {
  $elem.empty()
  $elem.html(puff.payload.content)  
}
