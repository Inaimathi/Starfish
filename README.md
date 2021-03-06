# Starfish. Distributed community software.

<img src="http://i.imgur.com/DHHroH1.png" alt="Starfish logo" height="400">

##Important
Before moving forward, we should decide on a basic set of goals and a tech stack. If you are interested in the project and want to see it move forward, Watch and/or Star this repository. To get involved, open a new issue at GitHub with your feedback or suggestions. 

##Working title
Starfish

##Summary
The goal of this project is to provide a decentralized alternative to online communities like reddit. As we can see, once website owners begin to control the content posted, censorship can move quickly from banning harassment to removing anything that looks bad to advertisers, or embarrasses the CEO. 

Over time the interests of the website owners and their users begin to diverge. Once users have been lured in and locked in, advertisers become the customers, and users (including their content) become the product. Sooner or later, any activity or content that doesn't appeal to advertisers will be marginalized or banned.

This problem is not unique to reddit. A version of this happened to Digg, and, should some other individually owned community site replace reddit, it will eventually happen to that website as well. The solution is to build a decentralized community that's just as easy to access and use as reddit, but where all content is owned and controlled by the individual users, and where anyone who wants can host a node on the system, or contribute to the underlying software.

Think of it like reddit meets BitTorrent, or "Doge for Discussion".<sup>[1](#footnotes)</sup>


##GOALS
**Make the system not just uncensored, but uncensorable.** Content can get downvoted to oblivion, and users can be blacklisted (or whitelisted) by other users or communities, but no one can be unilaterally kicked off the network. 

**You own and control your own content.** Repost, resell, remove at will. 

**Provide true (encrypted) private messaging**, that cannot be read by non-recipients under any circumstances.<sup>[2](#footnotes)</sup> 

**Make it scale well.** Centralized discussion forms have scaling issues, and the growing pains can be harsh<sup>[3](#footnotes)</sup>. Making Starfish scale well will mean creating easy to use, decentralized services for users to help host content, create communities, and moderate posts.

**Allow users to import their username from reddit.** If you like your username, you should be allowed to keep it.<sup>[4](#footnotes)</sup>


##Proposed tech stack:

**Data structure:** GraphDB. This allows for fast traversal of the relationships between comments, and opens the door to multi-threaded commenting (multiple parents as well as multiple children).

 - Agreed. Using `Dagoba`. Assuming tree structure for the first cut, but DAG shouldn't be hard to put together (we should be careful about cycles. Either disallow them with high confidence, or handle them gracefully. Definitely don't get into the situation where the UI tanks because some jackass managed to predict his next `puff.sig`) *-Inaimathi*

**Front end:** [ReactJS](http://facebook.github.io/react/). This is an open source project from Facebook that breaks the rendering of pages into components. React uses a virtual DOM and does "diffing" to only update the parts of the page that have changed. This makes it fast. One-way data flow and component state make it ideal for decentralized development where individuals can work on a part of the view without worrying about the rest of the page.

 - Writing the first cut manually. Eventually, `starfish-ui.js` should be replaced with whatever DOM-manipulating framework gets chosen. Never worked with [ReactJS](http://facebook.github.io/react/), but wouldn't mind picking it up when I get some more time. *-Inaimathi*

**Data storage and sharing:** Individual posts and messages would be stored in "puff" format, an open standard that's part of the [EveryBit.js](https://github.com/EveryBit-com/everybit.js) library. Puffs are immutable, signed, and can be encrypted on the client for private communication. Because puffs are static, files can be hosted anywhere (i.e. a CDN) and passed around in P2P networks without issues of concurrency or risk of corruption (this is detectable using the signature). 

##Additional thoughts and random ideas

**Karma grows up and becomes a currency unto itself.**  
All community systems use some version of karma to reward good behavior. What if karma in this system became a full-fledged currency, one that could be transferred or exchanged for perks like the ability to create a new community? **Note**: Getting this right could be **extremely tricky**. 

 - Careful here. "Karma" is useful pretty much to the extent that it *isn't* transferable, because once it *is*, you'll likely see the same imbalances you see in government-backed economies (rich-get-richer, inheritances, and so forth). Unless you believe that the richest people in the world are the most trustworthy, this doesn't sound like the right way to go. Limited transferability doesn't seem to have hurt `stackoverflow`, but it seems like it might be a gameable system in the long term. *-Inaimathi*

**Karma can be computed in many different ways.** 
Imagine that individual communities (or even users) can pick their own ratings mechanism. In this decentalized system, everyone would get to see the upvotes of everyone else (for public communities). A user convert that voting information into a simple ups vs downs points system, or filter content according to a more sophisticated system that used a page-rank like algorithm, weighting the upvotes of high karma individuals more than low karma individuals.

**The back end should lock in a protocol, not a language.** 
A natural choice for the JS driven front end might be Node, but there's no reason not to consider Erlang, Go, Nim, or others. So long as the back end is able to persist content and handle requests, there could be multiple implementations of the server side code.

<a name="footnotes"></a>
##Footnotes
1. Doge, or Dogecoin, is an alternative digital currency, like Bitcoin but with a more fun-loving community.
2. Do you trust reddit CEO Ellen Pao not to read your private messages? Apparently she [thinks other people can read her messages](https://www.reddit.com/r/KotakuInAction/comments/39i5g5/ellen_pao_posted_a_link_to_a_private_message_to/). Maybe she can't tell the difference on her screen between what's yours and what's hers.
3. This has been a particular problem with reddit alternatives like Voat, which have been buckling under the load of too many new users flooding in. 
4. Using OAuth to verify username ownership could be tricky in a decentralized world. Users may need to verify their names by altering their profile in some way that's publicly visible.
