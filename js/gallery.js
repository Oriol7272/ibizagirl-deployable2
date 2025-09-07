(function(W,D){
  console.log("[gallery] render (stub) 40");
  var c=D.getElementById("gallery"); if(!c){return;}
  var pool=W.__IBG_PUBLIC_POOL||[];
  var take=pool.slice(0,40);
  c.innerHTML = take.map(function(n){return "<img loading=\"lazy\" src=\"/full/"+n+"\" alt=\"\"/>";}).join("");
})(window,document);
