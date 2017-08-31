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

var disableLazyLoading = function() {
	var hiddenMedia = document.querySelectorAll('.js-progressiveMedia-inner');
	if (hiddenMedia == null) {
		return;
	}
	for (var i=0; i<hiddenMedia.length; i++) {
		var template = document.createElement('template');
		template.innerHTML = hiddenMedia[i].textContent;
		hiddenMedia[i].parentNode.appendChild(template.content.firstChild);
	}
};

// Only run this on Medium sites. 
// Ensure that by checking for <meta property="al:ios:app_name" content="Medium"> in the document <head />
var metaCheck = document.head.querySelector('meta[property="al:ios:app_name"]');
if (metaCheck != null && metaCheck.content == "Medium") {
	makeReadable();

	chrome.storage.sync.get(null, function(items) {
		if (items.hideDickbar) {
			hideDickbar();
		}
		if (items.disableLazyImages) {
			disableLazyLoading();
		}
	});
}
