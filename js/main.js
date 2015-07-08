EB.init({enableP2P: false, disableSendToServer: true})

function test () {
    var sig = Star.newLink("My Starfish Fork", "https://github.com/Inaimathi/Starfish", ["meta", "github", "code", "javascript"])
    console.log("Posted", sig)
    var comSig = Star.commentOn(sig, "Yup, that's certainly a post...")
    console.log("Commented", sig)
    Star.up(sig)
    Star.up(comSig)
}

$(document).ready(function () {
    console.log("Hello from Starfish")
})
