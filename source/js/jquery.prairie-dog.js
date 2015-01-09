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
    this.options = options;
    this.$element = $(element);
    this.isShown = null;
  };

  PrairieDog.TRANSITION_DURATION = 300;

  PrairieDog.DEFAULTS = {
    show: true
  };

  PrairieDog.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  PrairieDog.prototype.show = function (_relatedTarget) {
    var e    = $.Event('show.vse.prairie-dog', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.$element.addClass('open');
    this.$element[0].offsetWidth; // force reflow
    this.$element.addClass('in');

    this.adjustHeight();

    this.$element.on('click.dismiss.vse.prairie-dog', '[data-dismiss="prairie-dog"]', $.proxy(this.hide, this));
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

    this.resetHeight();

    if ($.support.transition) {
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hidePrairieDog, this))
        .emulateTransitionEnd(PrairieDog.TRANSITION_DURATION);
    }
    else {
      this.hidePrairieDog();
    }
  };

  PrairieDog.prototype.hidePrairieDog = function () {
    this.$element.removeClass('open');
    this.$element.trigger('hidden.vse.prairie-dog');
  };

  PrairieDog.prototype.adjustHeight = function () {
    var $dialog = this.$element.find('.prairie-dog-dialog');
    this.$element.css('min-height', $dialog.height());
  };

  PrairieDog.prototype.resetHeight = function () {
    this.$element.css('min-height', '');
  };

  // PRAIRIE-DOG PLUGIN DEFINITION
  // =============================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('vse.prairie-dog');
      var options = $.extend(
        {},
        PrairieDog.DEFAULTS,
        $this.data(),
        typeof option === 'object' && option
      );

      if (!data) $this.data('vse.prairie-dog', (data = new PrairieDog(this, options)));
      if (typeof option === 'string') {
        data[option](_relatedTarget);
      }
      else if (options.show) {
        data.show(_relatedTarget);
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
    var option  = $target.data('vse.prairie-dog') ? 'toggle' : $.extend(
      { remote: !/#/.test(href) && href },
      $target.data(),
      $this.data()
    );

    if ($this.is('a')) e.preventDefault();

    Plugin.call($target, option, this);
  });

})(jQuery);
