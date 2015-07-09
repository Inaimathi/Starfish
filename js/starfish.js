Star = {}

Star.V = 0
Star.isVote = function (tp) {
  return tp == "upvote" || tp == "downvote"
}

Star.G = Dagoba.graph()
Star.postsAndLinks = []

Star.plot = function (type, puff) {
  var id = Star.isVote(type) ? puff.username + type + puff.payload.target : puff.sig

  if (!Star.G.findVertexById(id)) {
    var vertex = { _id: id, puff: puff }
    Star.G.addVertex(vertex)
  }

  if (type == "post" || type == "link") {
    Star.postsAndLinks.push(id)
  }

  if (puff.payload.target) {
    Star.G.addEdge({ _in: puff.payload.target, _out: id, _label: type })
  }
  return id
}

Star.exhale = function (type, body, props) {
  var puff = EB.Puff.simpleBuild(type, body, props)
  var vertex = { _id: puff.sig, type: type, puff: puff }
  EB.Data.addPuffToSystem(puff)
  return Star.plot(type, puff)
}

Star.newPost = function (title, body, tags) {
  return Star.exhale("post", body, {title: title, tags: tags})
}

Star.newLink = function (title, link, tags) {
  return Star.exhale("link", link, {title: title, tags: tags})
}

Star.commentOn = function (sig, comment) {
  return Star.exhale("comment", comment, {target: sig})
}

Star.up = function (sig) {
  Star.exhale("upvote", null, {target: sig})
}

Star.down = function (sig) {
  Star.exhale("downvote", null, {target: sig})
}

Star.logout = function (name) {
  EB.switchIdentityTo();
  EB.removeIdentity(name)
  EB.Data.removeAllPrivateShells();
  Star.UI.clear()
}

Star.login = function (name, password) {
  EB.loginWithPassphrase(name, password)
    .then(function(res){
      if(res) {
	Star.UI.showUser()
      } else {
	Star.UI.showError("Login failed...")
      }
    })
}

Star.register = function (name, password) {
  EB.createIdentity(name, password)
    .then(function () {
      Star.UI.showUser()
    })
    .catch(Star.UI.showError)
}
