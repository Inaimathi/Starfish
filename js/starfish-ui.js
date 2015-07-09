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
    var puff = Star.G.findVertexById(id).puff
    Star.UI.renderPostItem(Star.UI.into($elem, "div", ["post"]), puff)
  })
}

Star.UI.renderPostItem = function ($elem, puff) {
  var ups = Star.G.v(puff.sig).in('upvote').run()
  var downs = Star.G.v(puff.sig).in('downvote').run()
  var comments = Star.G.v(puff.sig).in('comment').run()
  $elem.append("<span class=\"votes\"><span class=\"up\">" + ups.length + "</span> | <span class=\"down\">" + downs.length + "</span></span>")
  $elem.append("<span class=\"mentions\">" + comments.length + "</span>")
  $elem.append("<span class=\"title\">" + puff.payload.title + "</span>")
  if (comments.length > 0) {
    Star.UI.renderCommentTree(Star.UI.into($elem, "span", ["comments-tree"]), 
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
      var $more = Star.UI.into($elem, "button", ["more-button"])
      $more.text("Load more...")
      $more.click(function () {
	console.log("TODO: show more tree")
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

// Star.UI.renderPostComments = function ($elem, id) {
//   $elem.empty()
//   var q = Star.G.v(id).in('comment').take(1)
//   var res = q.run()
//   while (res) {
//     Star.UI.renderComment(Star.UI.into($elem, "div"), res[0].puff)
//     res = q.run()
//   }
// }

Star.UI.renderComment = function ($elem, puff) {
  $elem.empty()
  $elem.html(puff.payload.content)
}
