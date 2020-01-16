var evaluate = function (parseTree) {
	var parseNode = function (node) {
		//magic goes here
	};
	var output = "";
	for (var i = 0; i < parseTree.length; i++) {
		var value = parseNode(parseTree[i]);
		if (typeof value !== "undefined") output += value + "\n";
	}
	return output;
};
