self.addEventListener('message', function(e) {
    setInterval(function() {
        self.postMessage(e.data);
    }, 10000);
}, false);