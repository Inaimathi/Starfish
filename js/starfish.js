Star = {}

Star.G = Dagoba.graph()
Star.postsAndLinks = []

Star.exhale = function (type, body, props) {
  var puff = EB.Puff.simpleBuild("starfish.v0." + type, body, props)
  var vertex = { _id: puff.sig, type: type, puff: puff, version: 0 }
  Star.G.addVertex(vertex)
  if (type == "post" || type == "link") {
    Star.postsAndLinks.push(puff.sig)
  }
  if (props.target) {
    Star.G.addEdge({ _in: props.target, _out: puff.sig, _label: type })
  }
  EB.Data.addPuffToSystem(puff)
  return puff.sig
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
