//
// Make Medium Readable Again
//

var makeReadable = function() {
	// Un-position:fixed the top nav bar
	var topNav = document.querySelector('.branch-journeys-top');
	if (topNav) {
		topNav.parentNode.style.position = 'absolute';
	}

	// Remove the "Pardon the interruption" popup.
	// We do this with JS because the .overlay.overlay--lighter element is used
	// for interactions we consent to, like the sign up / log in dialogs, so we
	// don't want to obliterate them too.
	// FIXME: prevent this from breaking signup/login dialogs when the popup
	//   is removed (it works after changing pages).
	var headings = document.evaluate("//h4[contains(., 'one more story in your member preview this month')]", document, null, XPathResult.ANY_TYPE, null );
	var thisHeading = headings.iterateNext();
	if (thisHeading != null) {
		var $overlay = thisHeading.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		$overlay.parentNode.removeChild($overlay);
	}

	// Inject remaining styles
	// This check makes sure the extension works on Chrome and Firefox.
	if (typeof browser === 'undefined') {
		browser = chrome;
	}
	var mediumCSS = browser.runtime.getURL("medium.css");
	if (document.querySelector('head link[href="' + mediumCSS + '"]') == null) {
		document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + mediumCSS + '">');
	}
};

var hideHighlightMenu = function() {
	document.head.insertAdjacentHTML('beforeend', '<style type="text/css">.highlightMenu { display: none; }</style>');
};

var hideDickbar = function() {
	var dickbar = document.querySelector('.js-postShareWidget');
	if (dickbar) {
		dickbar.style.display = 'none';
	}
	var footerDickbar = document.querySelector('footer > .container:first-child');
	if (footerDickbar) {
		footerDickbar.style.display = 'none';
	}
};

var disableLazyLoading = function() {
	// Get all <noscript> tags accompanying dynamically-loading <img>s
	var hiddenMedia = document.querySelectorAll('noscript.js-progressiveMedia-inner');
	if (hiddenMedia.length === 0) {
		return;
	}
	for (var i=0; i<hiddenMedia.length; i++) {
		// Create new <img> element from the one in <noscript> and add it in.
		// This is certainly a roundabout way of doing things, but I didn't want to
		// spend more time reverse-engineering Medium's lazy-loading code.
		var img = new Image();
		var srcMatch = hiddenMedia[i].textContent.match(/src="(https:\/\/[^"]+)"/);
		if (srcMatch != null) {
			img.src = srcMatch[1];
			img.className = hiddenMedia[i].textContent.match(/class="([^"]+)"/)[1];
			hiddenMedia[i].parentNode.appendChild(img);
		}
	}
};

var shrinkHeaderImages = function() {
	var ridiculousHeaderImage = document.querySelector('figure.graf--layoutFillWidth');
	if (ridiculousHeaderImage) {
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

// This extension runs on all domains so it can Make Medium Readable Again even for publications on custom domains.
// Here we make sure the code only runs on Medium sites.
if (document.querySelector('head meta[property="al:ios:app_name"][content="medium" i]')) {
	makeReadable();
	shrinkHeaderImages();

	chrome.storage.sync.get(null, function(items) {
		if (items.hideDickbar) {
			hideDickbar();
		}
		if (items.disableLazyImages) {
			disableLazyLoading();
		}
		if (items.hideHighlightMenu) {
			hideHighlightMenu();
		}
	});

	observer.observe(document.body, config);
}
