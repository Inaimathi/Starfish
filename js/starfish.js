Star = {}

Star.newPost = function (title, body, tags) {
    var puff = EB.Puff.simpleBuild("starfish.v0.post", body, {title: title, tags: tags})
    EB.Data.addPuffToSystem(puff)
}

Star.newLink = function (title, link, tags) {
    var puff = EB.Puff.simpleBuild("starfish.v0.link", link, {title: title, tags: tags})
    EB.Data.addPuffToSystem(puff)
}

Star.commentOn = function (postOrComment, comment) {
    var puff = EB.Puff.simpleBuild("starfish.v0.comment", comment)
    puff.previous = postOrComment.sig
    EB.Data.addPuffToSystem(puff)
}

Star.up = function (postOrComment) {
    var puff = EB.Puff.simpleBuild("starfish.vote", "^");
    puff.previous = postOrComment.sig
    EB.Data.addPuffToSystem(puff)
}

Star.down = function (postOrComment) {
    var puff = EB.Puff.simpleBuild("starfish.vote", "v");
    puff.previous = postOrComment.sig
    EB.Data.addPuffToSystem(puff)
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
	    console.log(res)
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

//////////////////////////////
Star.UI = {}

Star.UI.clear = function () {
    console.log("Clearing UI...")
}

Star.UI.showUser = function () {
    console.log("Showing user...")
}

Star.UI.showError = function (message) {
    console.log("ERROR", message)
}
