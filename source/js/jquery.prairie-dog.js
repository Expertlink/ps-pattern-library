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
    this.options        = options;
    this.$element       = $(element);
    this.$parent        = this.options.parent ? $(this.options.parent) : this.$element.parent();
    this.$trigger       = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]');
    this.$backdrop      = null;
    this.isShown        = null;
    this.retainBackdrop = null;
  };

  PrairieDog.TRANSITION_DURATION = 300;

  PrairieDog.DEFAULTS = {
    backdrop: true,
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
      $openSiblings.prairieDog('startRetainingBackdrop');
      $openSiblings.prairieDog('hide');
    } else {
      this.showPrairieDog();
    }
  };

  PrairieDog.prototype.showPrairieDog = function () {
    this.backdrop();
    this.$element.addClass('open');
    this.$element[0].offsetWidth; // force reflow
    this.$element.addClass('in');
    this.$element.on('click.dismiss.vse.prairie-dog', '[data-dismiss="prairie-dog"]', $.proxy(this.hide, this));
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

    this.backdrop();
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
    this.$element.trigger('hidden.vse.prairie-dog');
  };

  PrairieDog.prototype.backdrop = function () {
    if (this.isShown && this.options.backdrop) {

      this.$backdrop = this.$parent.find('.prairie-dog-backdrop');

      if (!this.$backdrop.length) {
        this.$backdrop = $('<div class="prairie-dog-backdrop" />').prependTo(this.$parent);
      }

      this.$backdrop.on('click.dismiss.vse.prairie-dog', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return;
        this.hide();
      }, this));

      if (!this.$backdrop.hasClass('in')) {
        if ($.support.transition) this.$backdrop[0].offsetWidth; // force reflow
        this.$backdrop.addClass('in');
      }

    } else if (!this.isShown && !this.retainBackdrop && this.$backdrop) {

      this.$backdrop.removeClass('in');

      if ($.support.transition) {
        this.$element
          .one('bsTransitionEnd', $.proxy(this.removeBackdrop, this))
          .emulateTransitionEnd(PrairieDog.TRANSITION_DURATION);
      } else {
        this.removeBackdrop();
      }

    } else if (this.retainBackdrop) {
      this.stopRetainingBackdrop();
    }
  };

  PrairieDog.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  PrairieDog.prototype.startRetainingBackdrop = function () {
    this.retainBackdrop = true;
  };

  PrairieDog.prototype.stopRetainingBackdrop = function () {
    this.retainBackdrop = null;
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
