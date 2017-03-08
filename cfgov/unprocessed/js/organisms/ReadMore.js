function ReadMore (opts) {
  var collapsedContainerClass = 'read-more__collapsed';
  var expandedContainerClass = 'read-more__expanded';
  var collapsedTextClass = 'read-more_text__collapsed';

  var $container = $('.read-more');
  var $content =  $('.read-more_content');
  var $text =  $('.read-more_text');
  var $target = $('.read-more_target');

  var settings = {
    lines: 4,
    lineHeight: 22,
    duration: 400,
    startCollapsed: $container.hasClass(collapsedContainerClass)
  }

  $.extend(settings, opts);

  var collapsedHeight = settings.lines * settings.lineHeight + 'px';
  var animating;
  var collapsed;

  function setCollapsedState () {
    $container
      .addClass(collapsedContainerClass)
      .removeClass(expandedContainerClass);
    $text.addClass(collapsedTextClass);
    $content.attr('aria-expanded', 'false').removeAttr('style');
    $target.attr('aria-pressed', 'false');
    animating = false;
    collapsed = true;
  }

  function setExpandedState () {
    $container
      .removeClass(collapsedContainerClass)
      .addClass(expandedContainerClass);
    $text.removeClass(collapsedTextClass);
    $content.attr('aria-expanded', 'true').removeAttr('style');
    $target.attr('aria-pressed', 'true');
    animating = false;
    collapsed = false;
  }

  function collapse (scroll) {
    if (!animating) {
      animating = true;
      $content.animate({
          "height": collapsedHeight
        },
        settings.duration,
        function () {
          setCollapsedState();
      });
      if (scroll) {
        //scrollTop();
      }
    }
  }

  function expand () {
    if (!animating) {
      animating = true;
      var actualHeight = $text.height();
      $text.removeClass(collapsedTextClass);
      $content
      .css({
        "height": collapsedHeight,
        'max-height': '9999px'
      })
      .animate({
        "height": actualHeight + 'px'
      }, settings.duration,
      function () {
        setExpandedState();
      })
    }
  }

  function toggleContents () {
    if (collapsed) {
      expand();
    } else {
      collapse(true);
    }
  }

  function scrollTop () {
    $('html, body').animate({
      scrollTop: $container.offset().top - 20
    }, settings.duration);
  }

  function setupAriaControls () {
    $target.attr('aria-controls', $content.attr('id') || '');
  }

  function setupTargetEventHandler () {
    $container.on('click.readMore', '.read-more_target', function () {
      toggleContents();
    });
  }

  function init () {
    setupAriaControls();
    setupTargetEventHandler();
    if (settings.startCollapsed) {
      collapse();
    } else {
      setExpandedState();
    }
  }

  function destroy () {
    $container.off('click.readMore');
    $content.removeAttr('aria-expanded style');
    $target.removeAttr('aria-pressed aria-controls');
  }

  return {
    init: init,
    destroy: destroy
  }
}

$(document).ready(function() {
  var truncateQuestion = $('.read-more_target').first().is(':visible');
  ReadMore({startCollapsed: truncateQuestion}).init();
});