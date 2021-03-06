'use strict';
$.fn.scrollHeight = function() {
  return this[0].scrollHeight;
};

$.fn.mdEditor = function() {
  var text;
  var html;
  var collapseHandle;
  var controls;

  var element = $(this);
  var container;

  function __controlButton(action, text) {
    return $('<a href="#" class="control" data-action="' + action + '">' + text + '</a>');
  }

  function __init() {
    $('head').append($('<link rel="stylesheet" href="/mdeditor.css" />'));
    container = $('<div class="md-editor-container"></div>');
    container.css({
      position: 'absolute',
      height: element.height(),
      width: element.width(),
      top: element.position().top,
      left: element.position().left
    });
    element.replaceWith(container);

    controls = $('<div class="controls">');
    controls.append(__controlButton('bold', '<b>B</b>'));
    controls.append(__controlButton('italic', '<em>I</em>'));
    controls.append(__controlButton('link', '&lt;a&gt;'));
    controls.append(__controlButton('header', '<b>H</b>'));
    controls.append(__controlButton('image', '<small>img</small>'));
    controls.append(__controlButton('bullet', '&bull;'));
    controls.append(__controlButton('ordered', '1.'));
    controls.append(__controlButton('strike', '<strike>S</strike>'));
    controls.append(__controlButton('underline', '<u>U</u>'));

    collapseHandle = $('<div class="collapse">&#9654;</div>');

    var md = $('<div class="md">');
    text = $('<textarea placeholder="*markdown* goes __here__"></textarea>"');
    text.attr('name', element.attr('name'));
    md.append(text);

    html = $('<div class="html"><em>markdown</em> goes <b>here</b></div>');

    var col1 = $('<div class="col"></div>');
    var col2 = $('<div class="col"></div>');

    col1.append(controls);
    col1.append(md);
    col2.append(html);

    container.append(collapseHandle);
    container.append(col1);
    container.append(col2);
  }

  function updateHTML() {
    var stuff = marked(text.val());
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

  function workControls() {
    var $this = $(this);
    switch($this.data('action')) {
      case 'bold':
        text.surroundSelectedText('__', '__');
        break;
      case 'italic':
        text.surroundSelectedText('*', '*');
        break;
      case 'link':
        var url = prompt("URL for link:");
        text.surroundSelectedText('[', '](' + url + ')');
        break;
      case 'header':
        text.surroundSelectedText('## ', '');
        break;
      case 'image':
        // TODO: optional image retrieval/uploading integration
        var url = prompt("Image URL:");
        text.surroundSelectedText("![", "](" + url + ")");
        break;
      case 'bullet':
        var sel = text.getSelection();
        if(sel.text != '') {
          var items = sel.text.split(/\r|\n/);
          for(var i = 0; i < items.length; i++) {
            items[i] = "* " + items[i];
          }
          text.replaceSelectedText("\n" + items.join("\n"));
        } else {
          text.replaceSelectedText("\n* ");
        }
        break;
      case 'ordered':
        var sel = text.getSelection();
        if(sel.text != '') {
          var items = sel.text.split(/\r|\n/);
          for(var i = 0; i < items.length; i++) {
            items[i] = "1. " + items[i];
          }
          text.replaceSelectedText("\n" + items.join("\n"));
        } else {
          text.replaceSelectedText("\n1. ");
        }
        break;
      case 'strike':
        text.surroundSelectedText('~~', '~~');
        break;
      case 'underline':
        text.surroundSelectedText('<u>', '</u>');
        break;
      default:
        break;
    }
    updateHTML();
  }

  __init();
  text.keyup(updateHTML);
  text.scroll(updateHTMLScroll);
  text.mousemove(updateControls);
  html.scroll(updateMDScroll);
  collapseHandle.click(toggleHTML);
  controls.hover(function() { window.clearTimeout(controlTimer); controlTimer = null; });
  controls.find('a').click(workControls);

  this.val = function() { return text.value; }
};
