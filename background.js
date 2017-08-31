//
// Make Medium Readable Again
//

var makeReadable = function() {
	// Un-position:fixed the top nav bar
	var topNav = document.querySelector('.metabar.u-fixed');
	if (topNav != null) {
		topNav.classList.remove('u-fixed');
	}
	// Remove the footer
	var getUpdatesBar = document.querySelector('.js-stickyFooter');
	if (getUpdatesBar != null) {
		getUpdatesBar.style.display = 'none';
	}
};

var hideDickbar = function() {
	document.querySelector('.js-postShareWidget').style.display = 'none';
	document.querySelector('footer > .container:first-child').style.display = 'none';
};

var observer = new MutationObserver(function(mutations){
	mutations.forEach(makeReadable);	
});

var config = {attributes: true};

// Only run this on Medium sites. 
// Ensure that by checking for <meta property="al:ios:app_name" content="Medium"> in the document <head />
var metaCheck = document.head.querySelector('meta[property="al:ios:app_name"]');
if (metaCheck != null && metaCheck.content == "Medium") {
	makeReadable();

	chrome.storage.sync.get(null, function(items) {
		if (items.hideDickbar) {
			hideDickbar();
		}
	});

	observer.observe(document.querySelector('body'), config);
}
