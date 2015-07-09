Star.UI = {}

Star.UI.into = function ($elem, elemType, cssClasses) {
  var el = document.createElement(elemType)
  if (cssClasses) {
    cssClasses.map(function (cls) {
      el.classList.add(cls)
    })
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
    Star.UI.renderPostItem(Star.UI.into($elem, "div", ["post"]), puff)
  })
}

Star.UI.renderPostItem = function ($elem, puff) {
  var ups = Star.G.v(puff.sig).in('upvote').run()
  var downs = Star.G.v(puff.sig).in('downvote').run()
  var comments = Star.G.v(puff.sig).in('comment').run()
  Star.UI.into($elem, "button").text("+").click(function () {
    console.log("Expand for ", puff, "clicked!")
  })
  $elem.append("<span class=\"votes\"><span class=\"up\">" + ups.length + "</span> | <span class=\"down\">" + downs.length + "</span></span>")
  $elem.append("<span class=\"mentions\">" + comments.length + "</span>")
  $elem.append("<span class=\"title\">" + puff.payload.title + "</span>")
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
