Star = {}

Star.V = 0
Star.G = Dagoba.graph()
Star.postsAndLinks = []

Star.Options = {
  contentDepth: 5
}

Star.prefix = "starfish.v" + Star.V + "."
Star.typeOf = function (puff) {
  return puff.payload.type.replace(Star.prefix, "")
}
Star.isType = function (puff, type) {
  return Star.typeOf(puff) == type;
}
Star.isVote = function (puff) {
  return Star.isType(puff, "upvote") || Star.isType(puff, "downvote")
}
Star.isPost = function (puff) {
  return Star.isType(puff, "post") || Star.isType(puff, "link")
}
Star.buildPuff = function (type, body, props) {
  return EB.Puff.simpleBuild(Star.prefix + type, body, props);
}

Star.plot = function (puff) {
  var type = Star.typeOf(puff);
  var target = puff.payload.target;
  var id = Star.isVote(puff) ? (puff.username + type + target) : puff.sig

  if (!Star.G.findVertexById(id)) {
    var vertex = { _id: id, puff: puff }
    Star.G.addVertex(vertex)
    if (target) {
      Star.G.addEdge({ _in: target, _out: id, _label: type })
    }
  }

  if (Star.isPost(puff)) {
    Star.postsAndLinks.push(id)
  }
  return id
}

Star.exhale = function (type, body, props) {
  var puff = Star.buildPuff(type, body, props)
  var vertex = { _id: puff.sig, type: type, puff: puff }
  EB.Data.addPuffToSystem(puff)
  return Star.plot(puff)
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
