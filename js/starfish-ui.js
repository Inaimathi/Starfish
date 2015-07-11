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
    Star.UI.renderPostItem(Star.UI.into($elem, "div", ["post", "collapsed"]), puff)
  })
}

Star.UI.renderPostItem = function ($elem, puff) {
  var comments = Star.G.v(puff.sig).in('comment').run()
  var title = puff.payload.title;
  if (Star.isType(puff, "link")) {
    title = "<a href=\"" + puff.payload.content + "\">" + title + "</a>";
  }
  if (comments.length == 0) {
    $elem.addClass("ghost-town")
  }
  Star.UI.into($elem, "div", ["row", "top"])
    .append("<span class=\"title col-md-6\">"
	    + "<button class=\"show-comments btn btn-xs\">"
	    + "<span class=\"glyphicon glyphicon-plus\"></span><span class=\"glyphicon glyphicon-minus\"></span></button>"
	    + title + "</span>")
    .append("<span class=\"mentions col-md-2\"><span class=\"glyphicon glyphicon-comment\"></span>" + comments.length + "</span>")
    .append("<span class=\"votes col-md-4\">"
	    + "<span class=\"score\">" + Star.Util.scoreOf(puff) + "</span>"
	    + "<button class=\"down btn btn-danger btn-xs\"><span class=\"glyphicon glyphicon-arrow-down\"></span></button>"
	    + "<button class=\"up btn btn-success btn-xs\"><span class=\"glyphicon glyphicon-arrow-up\"></span></button>"
	    + "</span>")
  if (Star.isType(puff, "post")) {
    Star.UI.into($elem, "div", (comments.length > 0) ? ["row", "content", "loud"] : ["row", "content"])
      .append("<span class=\"content\">" + puff.payload.content + "</span>")
  }
  if (comments.length > 0) {
    Star.UI.renderCommentTree(
      Star.UI.into(Star.UI.into($elem, "div", ["row", "comments"]), "span", ["comments-tree"]),
      comments.map(function (c) { return c.puff }),
      5)
  }
  $elem.find(".show-comments").click(function () {
    $elem.toggleClass("collapsed");
  })
  var $votes = $elem.find(".votes");
  var $score = $votes.children(".score")
  $votes.children(".up").click(function () {
    Star.up(puff.sig);
    $score.text(Star.Util.scoreOf(puff))
  })
  $votes.children(".down").click(function () {
    Star.down(puff.sig);
    $score.text(Star.Util.scoreOf(puff))
  })
  
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
