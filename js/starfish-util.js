Star.Util = {}

Star.Util.scoreOf = function (puff) {
  var ups = Star.G.v(puff.sig).in('upvote').run()
  var downs = Star.G.v(puff.sig).in('downvote').run()
  return ups.length - downs.length;
}
