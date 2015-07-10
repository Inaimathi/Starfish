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
  console.log("TODO: Clearing UI...")
}

Star.UI.showUser = function () {
  console.log("TODO: Showing user...")
}

Star.UI.showError = function (message) {
  console.log("TODO: ERROR", message)
}

Star.UI.renderPosts = function ($elem, postIds) {
  $elem.empty()
  postIds.map(function (id) {
    var puff = Star.G.findVertexById(id).puff
    Star.UI.renderPostItem(Star.UI.into($elem, "div", ["post"]), puff)
  })
}

Star.UI.renderPostItem = function ($elem, puff) {
  var ups = Star.G.v(puff.sig).in('upvote').run()
  var downs = Star.G.v(puff.sig).in('downvote').run()
  var comments = Star.G.v(puff.sig).in('comment').run()
  $top = Star.UI.into($elem, "div", ["row"])
  $top.append("<span class=\"title col-md-8\">" + puff.payload.title + "</span>")
  $top.append("<span class=\"mentions col-md-2\">" + comments.length + "</span>")
  $top.append("<span class=\"votes col-md-2\"><span class=\"up\">" + ups.length + "</span><span class=\"down\">" + downs.length + "</span></span>")
  $mid = Star.UI.into($elem, "div", ["row"])
  console.log("RENDERING POST", puff.type, puff)
  if (puff.payload.type == "post") {
    console.log("RENDERIN BODY...")
    $mid.append("<span class=\"content\">" + puff.payload.content + "</span>")
  }
  if (comments.length > 0) {
    Star.UI.renderCommentTree(Star.UI.into($mid, "span", ["comments-tree"]),
			      comments.map(function (c) { return c.puff }),
			      2)
  }
}

Star.UI.renderCommentTree = function ($elem, comments, depth) {
  if (depth && depth > 0) {
    $elem.empty()
    var $ul = Star.UI.into($elem, "ul")
    comments.map(function (c) {
      Star.UI.renderTreeComment(Star.UI.into($ul, "li"), c, depth-1)
    })
  }
}

Star.UI.renderTreeComment = function ($elem, puff, depth) {
  Star.UI.renderComment($elem, puff);
  var coms = Star.G.v(puff.sig).in('comment').run()
  if (coms && coms.length > 0) {
    if (depth && depth > 0) {
      Star.UI.renderCommentTree(Star.UI.into($elem, "ul"),
				coms.map(function (c) { return c.puff }),
				depth)
    } else {
      var $more = Star.UI.into($elem, "button", ["more-button", "btn", "btn-xs", "btn-primary"])
      $more.text("Show responses...")
      $more.click(function () {
	$more.remove()
	Star.UI.renderCommentTree(Star.UI.into($elem, "ul"),
				  coms.map(function(c) { return c.puff }),
				  10)
      })
    }
  }
}

Star.UI.renderCommentList = function ($elem, comments) {
  $elem.empty()
  var $ul = Star.UI.into($elem, "ul")
  comments.map(function (c){
    Star.UI.renderComment(Star.UI.into($ul, "li"), c)
  })
}

Star.UI.renderComment = function ($elem, puff) {
  $elem.empty()
  $elem.addClass("comment")
  // TODO - markdown processing and sanitation
  Star.UI.into($elem, "p").html(puff.payload.content)
}
