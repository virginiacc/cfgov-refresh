/* ==========================================================================
   Scripts for Feedback Form organism.
   ========================================================================== */

'use strict';

var FormSubmit = require( '../../organisms/FormSubmit.js' );

var BASE_CLASS = 'o-feedback';

function validateFeedback( fields ) {
	if ( fields.comment && !fields.comment.value ) {
		return "Please enter a comment."
	}
}

var element = document.body.querySelector( '.' + BASE_CLASS );

var opts = {
  validator: validateFeedback, 
  replaceForm: element.getAttribute('data-replace')
 }

var formSubmit = new FormSubmit(
  element,
  BASE_CLASS,
  opts
);

formSubmit.init();