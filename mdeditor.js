$.fn.scrollHeight = function() {
  return this[0].scrollHeight;
};

$.fn.mdEditor = function() {
  var text = $('#md textarea');
  var html = $('#html');
  var collapseHandle = $('#collapse');
  var controls = $('#controls');

  function updateHTML() {
    var stuff = markdown.toHTML(text.val());
    html.html(stuff);
  }

  var scrolled = false;
  function updateHTMLScroll(e) {
    e.preventDefault();
    if(scrolled) {
      scrolled = false;
      return true;
    }
    scrolled = true;
    var perc = (text.scrollTop() / text.scrollHeight());
    html.scrollTop(html.scrollHeight() * perc);
  }

  function updateMDScroll(e) {
    e.preventDefault();
    if(scrolled) {
      scrolled = false;
      return true;
    }
    scrolled = true;
    var perc = (html.scrollTop() / html.scrollHeight());
    text.scrollTop(text.scrollHeight() * perc);
  }

  var oldWidth;
  function toggleHTML() {
    if(html.parent().is(':hidden')) {
      html.parent().show();
      text.parent().parent().css({width: oldWidth});
      text.parent().css({width: oldWidth});
      text.css({width: oldWidth - 4});
      collapseHandle.html("&#9654;");
    } else {
      oldWidth = text.parent().width();

      html.parent().hide();
      text.parent().css({width: 986});
      text.parent().parent().css({width: 986});
      text.css({width: 982});
      collapseHandle.html("&#9664;");
    }
  }

  var controlTimer = null;
  function updateControls() {
    if(controlTimer != null) {
      window.clearTimeout(controlTimer);
      controlTimer = null;
    }

    controls.show();
    controlTimer = window.setTimeout(function() {
      controls.fadeOut();
    }, 1000);
  }

  text.keyup(updateHTML);
  text.scroll(updateHTMLScroll);
  text.mousemove(updateControls);
  html.scroll(updateMDScroll);
  collapseHandle.click(toggleHTML);

  html.css({ height: text.height() });
};
