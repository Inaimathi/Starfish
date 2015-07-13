Star = {}

Star.V = 0
Star.G = Dagoba.graph()
Star.postsAndLinks = []

Star.Options = {
  contentDepth: 5
}

Star.isType = function (puff, type) {
  return puff.payload.type == type;
}
Star.isVote = function (puff) {
  return Star.isType(puff, "upvote") || Star.isType(puff, "downvote")
}

Star.plot = function (puff) {
  var type = puff.payload.type;
  var target = puff.payload.target;
  var id = Star.isVote(puff) ? (puff.username + type + target) : puff.sig

  if (!Star.G.findVertexById(id)) {
    var vertex = { _id: id, puff: puff }
    Star.G.addVertex(vertex)
    if (target) {
      Star.G.addEdge({ _in: target, _out: id, _label: type })
    }
  } 

  if (type == "post" || type == "link") {
    Star.postsAndLinks.push(id)
  }
  return id
}

Star.inhale = function () {
  // Inefficient version for now.
  // REALLY, what we want is
  // - Only pull puffs of type "upvote"/"downvote"/"comment"/"post"/"link"
  // - Only pour new ones into Star.G
  //
  //   Ideally, this would happen in a stream-wise fashion, with a constant
  // flow of new puffs coming in. For now, we're just calling the
  // importRemoteShells function (no filters, since it doesn't support them
  // yet), and updating synchronously.

  EB.Data.importRemoteShells();
  EB.Data.getCurrentDecryptedLetters().map(Star.plot)
}

Star.exhale = function (type, body, props) {
  var puff = EB.Puff.simpleBuild(type, body, props)
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
