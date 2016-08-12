function Chat(game) {
	var input = document.getElementById('chat-input');
    var self = this;
    input.addEventListener("focus", function(e) { self.focus(e); });
    input.addEventListener("focusout", function(e) { self.blur(e); });
    input.addEventListener("blur", function(e) { self.blur(e); });
    input.addEventListener("keydown", function(e) { self.key(e, this) });
    input.tabIndex = 2;
    game.canvas.tabIndex = 1;
    
    this.messages = document.getElementById('chat');
}

Chat.prototype.focus = function() {
	game.input.keyboard.enabled = false;
}

Chat.prototype.blur = function() {
	game.input.keyboard.enabled = true;
}

Chat.prototype.key = function(e, element) {
	
	if (e.keyCode == 27) { 
		game.canvas.focus(); 
	}
	else if (e.keyCode == 13) {
		backend.chatSay({
			content: element.value
		});
		element.value = "";
	}
}

Chat.prototype.append = function(key, data) {
	var div = document.createElement("div");
	div.id = "chat-" + key;
	div.className = "chat message";
	div.innerText = data.content;
	this.messages.appendChild(div);
}

Chat.prototype.update = function(key, data) {
	document.getElementById("chat-"+key).innerText = data.content;
}

Chat.prototype.remove = function(key) {
	this.messages.removeChild(document.getElementById("chat-"+key));
}