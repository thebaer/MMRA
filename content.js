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
	var dickbar = document.querySelector('.js-postShareWidget');
	if (dickbar != null) {
		dickbar.style.display = 'none';
	}
	var footerDickbar = document.querySelector('footer > .container:first-child');
	if (footerDickbar != null) {
		footerDickbar.style.display = 'none';
	}
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

var shrinkHeaderImages = function() {
	var ridiculousHeaderImage = document.querySelector('figure.graf--layoutFillWidth');
	if (ridiculousHeaderImage != null) {
		ridiculousHeaderImage.style.maxWidth = '700px';
		ridiculousHeaderImage.style.margin = '0 auto';
	}
}

var observer = new MutationObserver(function(mutations){
	mutations.forEach(function(){
		makeReadable();
		shrinkHeaderImages();
	});	
});

var config = {attributes: true};

// Only run this on Medium sites. 
// Ensure that by checking for <meta property="al:ios:app_name" content="Medium"> in the document <head />
var metaCheck = document.head.querySelector('meta[property="al:ios:app_name"]');
if (metaCheck != null && metaCheck.content == "Medium") {
	makeReadable();
	shrinkHeaderImages();

	chrome.storage.sync.get(null, function(items) {
		if (items.hideDickbar) {
			hideDickbar();
		}
		if (items.disableLazyImages) {
			disableLazyLoading();
		}
	});

	observer.observe(document.querySelector('body'), config);
}
