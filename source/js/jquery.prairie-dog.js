/**
 * I'm doing my best Bootstrap impression here for how this is structured.
 * Life's short, y'know?
 *
 * (This does depend on Bootstrap transitions, though.)
 */

(function ($) {
  'use strict';

  // PRAIRIE-DOG CLASS DEFINITION
  // ============================

  var PrairieDog = function (element, options) {
    this.options  = options;
    this.$element = $(element);
    this.$parent  = this.options.parent ? $(this.options.parent) : this.$element.parent();
    this.$trigger = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]');
    this.$overlay = this.$parent.find('.prairie-dog-overlay');
    this.$bg      = this.$parent.find('.prairie-dog-bg');
    this.isShown  = null;
    this.handoff  = null;
  };

  PrairieDog.TRANSITION_DURATION = 300;

  PrairieDog.DEFAULTS = {
    show: true,
    trigger: '[data-toggle="prairie-dog"]'
  };

  PrairieDog.prototype.toggle = function () {
    return this.isShown ? this.hide() : this.show();
  };

  PrairieDog.prototype.show = function () {
    var e = $.Event('show.vse.prairie-dog');
    this.$element.trigger(e);
    if (this.isShown || e.isDefaultPrevented()) return;
    this.isShown = true;

    var $openSiblings = this.$parent.find('.prairie-dog-dialog.open').not(this.$element);
    if ($openSiblings.length) {
      $openSiblings.one('hidden.vse.prairie-dog', $.proxy(this.showPrairieDog, this));
      $openSiblings.prairieDog('startHandoff');
      $openSiblings.prairieDog('hide');
    } else {
      this.showPrairieDog();
    }
  };

  PrairieDog.prototype.showPrairieDog = function () {
    // parent
    if (!this.$parent.hasClass('open')) {
      this.adjustHeight();
      this.$parent.addClass('open');
      this.$parent[0].offsetWidth; // force reflow
      this.$parent.addClass('in');
    }
    // this dialog
    this.$element.addClass('open');
    this.$element[0].offsetWidth; // force reflow
    this.$element.addClass('in');
    this.$element.on('click.dismiss.vse.prairie-dog', '[data-dismiss="prairie-dog"]', $.proxy(this.hide, this));
    this.$overlay.on('click.dismiss.vse.prairie-dog', $.proxy(this.hide, this));
    this.$trigger.addClass('active');
  };

  PrairieDog.prototype.hide = function (e) {
    if (e) e.preventDefault();
    e = $.Event('hide.vse.prairie-dog');
    this.$element.trigger(e);
    if (!this.isShown || e.isDefaultPrevented()) return;
    this.isShown = false;

    this.$element
      .removeClass('in')
      .off('click.dismiss.vse.prairie-dog');

    if (!this.handoff) {
      this.$parent.removeClass('in');
    }

    this.$trigger.removeClass('active');

    if ($.support.transition) {
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hidePrairieDog, this))
        .emulateTransitionEnd(PrairieDog.TRANSITION_DURATION);
    } else {
      this.hidePrairieDog();
    }
  };

  PrairieDog.prototype.hidePrairieDog = function () {
    this.$element.removeClass('open');
    if (this.handoff) {
      this.stopHandoff();
    } else {
      this.$parent.removeClass('open');
      this.resetHeight();
    }
    this.$overlay.off('click.dismiss.vse.prairie-dog');
    this.$element.trigger('hidden.vse.prairie-dog');
  };

  PrairieDog.prototype.adjustHeight = function () {
    var bgHeight = this.$bg.outerHeight();
    var borderTop = parseInt(this.$parent.css('border-top-width'), 10);
    var borderBottom = parseInt(this.$parent.css('border-bottom-width'), 10);
    this.$parent.css('min-height', bgHeight + borderTop + borderBottom);
  };

  PrairieDog.prototype.resetHeight = function () {
    this.$parent.css('min-height', '');
  };

  PrairieDog.prototype.startHandoff = function () {
    this.handoff = true;
  };

  PrairieDog.prototype.stopHandoff = function () {
    this.handoff = null;
  };

  // PRAIRIE-DOG PLUGIN DEFINITION
  // =============================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('vse.prairie-dog');
      var options = $.extend(
        {},
        PrairieDog.DEFAULTS,
        $this.data(),
        typeof option === 'object' && option
      );

      if (!data) {
        $this.data('vse.prairie-dog', (data = new PrairieDog(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      } else if (options.show) {
        data.show();
      }
    });
  }

  $.fn.prairieDog             = Plugin;
  $.fn.prairieDog.Constructor = PrairieDog;

  // PRAIRIE-DOG DATA-API
  // ====================

  $(document).on('click.vse.prairie-dog', '[data-toggle="prairie-dog"]', function (e) {
    var $this   = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
    var option  = $target.data('vse.prairie-dog') ? 'toggle' : $.extend($target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    Plugin.call($target, option, this);
  });

})(jQuery);
