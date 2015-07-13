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

Star.UI.renderNewPostForm = function ($elem) {
  $elem.empty()
  var $title = Star.UI.into($elem, "input", ["form-control"])
    .prop("placeholder", "Post Title")
  var $body = Star.UI.into($elem, "textarea", ["form-control"])
    .prop("placeholder", "Post Body")
  var $submit = Star.UI.into($elem, "button", ["btn", "btn-success", "btn-sm"])
    .text("Submit")
  $submit.click(function () {
    var title = $title.val()
    var body = $body.val()
    if (title.length >= 5 && body.length >= 5) {
      Star.newPost($title.val(), $body.val());
      $body.val("");
      $title.val("");
      Star.UI.renderPosts($(".posts-list"), Star.postsAndLinks);
      $elem.removeClass("has-error")
    } else {
      $elem.addClass("has-error")
    }
  })
}

Star.UI.renderReplyForm = function ($elem, puff, fn) {
  $elem.empty()
  Star.UI.into($elem, "button", ["reply", "btn", "btn-primary", "btn-xs"])
    .text("Reply")
    .click(function () {
      $elem.empty()
      var $form = Star.UI.into($elem, "div", ["reply-form"])
      var $body = Star.UI.into($form, "textarea", ["form-control"])
	.prop("placeholder", "Post Body")
      Star.UI.into($form, "button", ["btn", "btn-success", "btn-sm"])
	.text("Submit")
	.click(function () {
	  Star.commentOn(puff.sig, $body.val())
	  if (fn) { fn() };
	})
      Star.UI.into($form, "button", ["btn", "btn-warning", "btn-sm"])
	.text("Cancel")
	.click(function () {
	  Star.UI.renderReplyForm($elem, puff, fn);
	})
      $body.focus();
    })
}

Star.UI.renderPosts = function ($elem, postIds) {
  $elem.empty()
  postIds.map(function (id) {
    var puff = Star.G.findVertexById(id).puff
    Star.UI.renderPostItem(Star.UI.into($elem, "div", ["post", "collapsed"]), puff)
  })
}

Star.UI.voteFor = function ($elem, puff) {
  $elem
    .append("<span class=\"votes\">"
	    + "<span class=\"score\">" + Star.Util.scoreOf(puff) + "</span>"
	    + "<button class=\"down btn btn-danger btn-xs\"><span class=\"glyphicon glyphicon-arrow-down\"></span></button>"
	    + "<button class=\"up btn btn-success btn-xs\"><span class=\"glyphicon glyphicon-arrow-up\"></span></button>"
	    + "</span>")
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
  return $votes
}

Star.UI.renderPostItem = function ($elem, puff) {
  $elem.empty()
  var comments = Star.G.v(puff.sig).in('comment').run()
  var title = puff.payload.title;
  if (Star.isType(puff, "link")) {
    title = "<a href=\"" + puff.payload.content + "\">" + title + "</a>";
  }
  if (comments.length == 0) {
    $elem.addClass("ghost-town")
  } else {
    $elem.removeClass("ghost-town")
  }
  var $info = Star.UI.into($elem, "div", ["row", "top"])
    .append("<span class=\"title col-md-6\">"
	    + "<button class=\"show-comments btn btn-xs\">"
	    + "<span class=\"glyphicon glyphicon-plus\"></span><span class=\"glyphicon glyphicon-minus\"></span></button>"
	    + title + "</span>")
    .append("<span class=\"mentions col-md-2\"><span class=\"glyphicon glyphicon-comment\"></span>" + comments.length + "</span>")

  Star.UI.voteFor($info, puff).addClass("col-md-4")

  if (Star.isType(puff, "post")) {
    Star.UI.into($elem, "div", (comments.length > 0) ? ["row", "content", "loud"] : ["row", "content"])
      .append("<span class=\"content\">" + puff.payload.content + "</span>") // TODO - sanitize
  }
  
  Star.UI.renderReplyForm(Star.UI.into($elem, "div", ["row", "main-reply"]), puff, function () { 
    $elem.removeClass("collapsed");
    Star.UI.renderPostItem($elem, puff)
  })

  if (comments.length > 0) {
    Star.UI.renderCommentTree(
      Star.UI.into(Star.UI.into($elem, "div", ["row", "comments"]), "span", ["comments-tree"]),
      comments.map(function (c) { return c.puff }),
      Star.Options.contentDepth)
  }
  $elem.find(".show-comments").click(function () {
    $elem.toggleClass("collapsed");
  })
}

Star.UI.renderCommentTree = function ($elem, comments, depth) {
  if (depth && depth > 0) {
    $elem.empty()
    var $ul = Star.UI.into($elem, "ul")
    comments.map(function (c) {
      Star.UI.renderTreeComment(Star.UI.into($ul, "li", ["comment"]), c, depth-1)
    })
  }
}

Star.UI.renderTreeComment = function ($elem, puff, depth) {
  $elem.empty()
  Star.UI.renderComment($elem, puff);
  Star.UI.renderReplyForm(Star.UI.into($elem, "div", ["row"]), puff, function () {
    Star.UI.renderTreeComment($elem, puff, depth);
  })
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

Star.UI.renderComment = function ($elem, puff) {
  $elem.empty()
  var $info = Star.UI.into($elem, "div", ["row", "comment-info"])
    .append("<span class=\"col-md-8\">"
	    + "<button class=\"show-replies btn btn-xs\">"
	    + "<span class=\"glyphicon glyphicon-plus\"></span><span class=\"glyphicon glyphicon-minus\"></span></button>"
	    + puff.username.split(":")[0] // TODO - sanitize
	    + "</span>")
  Star.UI.voteFor($info, puff).addClass("col-md-4").addClass("reply");
  Star.UI.into($elem, "div", ["row", "comment-body"])
    .append("<span class=\"col-md-12\">" + puff.payload.content + "</span>") // TODO - sanitize
  $info.find(".show-replies").click(function () {
    $elem.toggleClass("collapsed");
  })
}
