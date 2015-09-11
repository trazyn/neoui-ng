;(function() {
var util_ng_args, ui_accordion_accordion, ui_accordion_accordion_ng, ui_autoComplete_autoComplete, ui_autoComplete_autoComplete_ng, util_dateutil, ui_calendar_calendar, ui_calendar_calendar_ng, ui_ripple_ripple, ui_dropdown_dropdown, ui_dropdown_dropdown_ng, ui_loading_loading, ui_loading_loading_ng, util_poll, ui_progress_progress, ui_modal_modal, ui_message_message, ui_message_message_ng, ui_modal_modal_ng, ui_pagination_pagination, ui_pagination_pagination_ng, ui_progress_progress_ng, ui_rate_rate, ui_rate_rate_ng, ui_ripple_ripple_ng, ui_sidenav_sidenav, ui_sidenav_sidenav_ng, ui_lavalamp_lavalamp, ui_tab_tab, ui_tab_tab_ng, ui_toast_toast, ui_toast_toast_ng, ui_tree_tree, ui_tree_tree_ng, ui_validation_validation, ui_validation_validation_ng, bundle;
util_ng_args = function () {
  function args($scope, $attrs, types) {
    var options = {}, isolateBindings = $scope.$$isolateBindings;
    for (var key in isolateBindings) {
      var attr = isolateBindings[key], type;
      if (attr.attrName in $attrs.$attr) {
        if (types && (type = types[key]), type) {
          options[key] = args[type]($scope[key]);
        } else
          options[key] = $scope[key];
      }
    }
    return options;
  }
  args.boolean = function (value) {
    return [
      'true',
      '1'
    ].indexOf((value || '').toString()) > -1;
  };
  args.int = function (value) {
    return +value;
  };
  args.date = function (value) {
    var date = new Date(value);
    if (isNaN(+date)) {
      return new Date();
    }
  };
  args.string = function (value) {
    return (value || '') + '';
  };
  args.json = function (value) {
    try {
      return JSON.parse(value);
    } catch (ex) {
      return {};
    }
  };
  /** Get the arguments definition */
  return args;
}();
(function ($) {
  'use strict';
  var namespace = '$ui.accordion', Accordion = function (target, settings) {
      var recent;
      target.delegate(settings.selector4pane, 'click', function (e) {
        var self = $(this), height = self.innerHeight(), content = self.find(settings.selector4content);
        e.stopPropagation();
        e.preventDefault();
        if (!settings.multiple && recent && recent.get(0) !== this) {
          +function (recent) {
            recent.height(recent.innerHeight()).animate({ height: recent.attr('data-height') }, settings.duration, function () {
              recent.removeClass('open');
              settings.onCollapse(recent.attr('index'));
            });
          }(recent);
        }
        self.toggleClass('open');
        if (self.hasClass('open')) {
          self.height(height).attr('data-height', height).animate({ height: height + content.innerHeight() }, settings.duration, function () {
            self.css('height', '');
            settings.onExpand(self.attr('index'));
          });
          recent = self;
        } else {
          self.animate({ height: self.attr('data-height') }, settings.duration, function () {
            self.css('height', '').removeAttr('data-height');
            settings.onCollapse(self.attr('index'));
          });
        }
      });
      this.$node = target;
      this.settings = settings;
    };
  Accordion.prototype = {
    expandAll: function () {
      this.$node.find(this.settings.selector4pane).each(function () {
        var self = $(this);
        !self.hasClass('open') && self.trigger('click');
      });
    },
    collapseAll: function () {
      this.$node.find(this.settings.selector4pane).filter('.open').trigger('click');
    },
    expand: function (index) {
      this.$node.find(this.settings.selector4pane).filter('[index=\'' + index + '\']:not(.open)').trigger('click');
    },
    collapse: function (index) {
      this.$node.find(this.settings.selector4pane).filter('.open[index=\'' + index + '\']').trigger('click');
    },
    toggle: function (index) {
      this.$node.find(this.settings.selector4pane).filter('[index=\'' + index + '\']').trigger('click');
    }
  };
  $.fn.accordion = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Accordion(this, $.extend({}, $.fn.accordion.defaults, options));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.accordion.defaults = {
    multiple: false,
    duration: 300,
    onExpand: $.noop,
    onCollapse: $.noop,
    selector4pane: '>.pane',
    selector4content: '.content:first',
    selector4head: '.head:first'
  };
}(window.jQuery || window.$));
ui_accordion_accordion = undefined;
ui_accordion_accordion_ng = function (args) {
  /**
   * example:
   *
      <s-accordion>
          <s-accordion-pane
              index="1"
              head="Subpane 1">
                  <s-accordion>
                      <s-accordion-pane index="1">
                          <s-accordion-head>
                              Inner Subpane 1
                          </s-accordion-head>
                          <s-accordion-content>
                              Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.
                          </s-accordion-content>
                      </s-accordion-pane>
  
                      <s-accordion-pane
                          index="2"
                          head="Inner Subpane 2"
                          content="Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.">
                      </s-accordion-pane>
                  </s-accordion>
          </s-accordion-pane>
  
          <s-accordion-pane
              index="2"
              head="Subpane 2"
              content="Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.">
          </s-accordion-pane>
      </s-accordion>
   * */
  angular.module('$ui.accordion', []).directive('sAccordion', [
    '$rootScope',
    function ($rootScope) {
      function controller($scope, $element, $attrs) {
        var accordion = $($element).accordion({
          multiple: $scope.multiple,
          onExpand: ($scope.onExpand || $.noop)(),
          onCollapse: ($scope.onCollapse || $.noop)()
        });
        $scope.$watch('multiple', function (value) {
          accordion.settings.multiple = !!value;
          accordion.collapseAll();
        });
        this['$accordion'] = $scope.controller = accordion;
      }
      return {
        scope: {
          multiple: '=',
          controller: '=',
          onExpand: '&',
          onCollapse: '&'
        },
        restric: 'EA',
        transclude: true,
        replace: true,
        template: '<div class=\'ui accordion\' ng-transclude></div>',
        controller: controller
      };
    }
  ]).directive('sAccordionPane', function () {
    function link($scope, $element, $attrs, controller) {
      var accordion = controller['$accordion'], head = $element.find('>.head'), content = $element.find('>.content');
      if ($scope.head) {
        head.length ? head.html($scope.head) : $element.append($('<div class=\'head\'>' + $scope.head + '</div>'));
      }
      if ($scope.content) {
        if (content.length) {
          content.html($scope.content);
        } else {
          $('<div class=\'content\'>' + $scope.content + '</div>').appendTo($element);
        }
      } else {
        $element.append($('<div class=\'content\'></div>').html($element.find('>:not(.head)')));
      }
      $element.attr('index', $scope.index);
      if ($scope.index && [
          'true',
          '1'
        ].indexOf($scope.isOpen) > -1) {
        /** Reduce execution priority, after $digest */
        setTimeout(function () {
          accordion.expand($scope.index);
        });
      }
    }
    return {
      scope: {
        isOpen: '@',
        index: '@',
        head: '@',
        content: '@'
      },
      restric: 'EA',
      require: '^sAccordion',
      transclude: true,
      replace: true,
      template: '<div class=\'pane\' ng-transclude></div>',
      link: link
    };
  }).directive('sAccordionHead', function () {
    return {
      restric: 'EA',
      transclude: true,
      replace: true,
      template: '<div class=\'head\' ng-transclude></div>'
    };
  }).directive('sAccordionContent', function () {
    return {
      restric: 'EA',
      transclude: true,
      replace: true,
      template: '<div class=\'content\' ng-transclude></div>'
    };
  });
}(util_ng_args);
(function ($, undefined) {
  'use strict';
  var namespace = '$ui.autoComplete', AutoComplete = function (ele, settings) {
      var self = this,
        /** Cache the matched result */
        cache = {},
        /** Current input value */
        query,
        /** Current suggestion item */
        suggestion,
        /** The raw data */
        data,
        /** Loading, error, success */
        indicator,
        /** Front input */
        fg,
        /** Backend input */
        bg;
      this.$node = ele;
      this.settings = settings;
      this.list = $('<div tabindex=-1 style=\'position: absolute; outline: 0;\' class=\'' + settings.class4list + '\'>').appendTo(ele);
      function setupCache(key, data) {
        if (key) {
          cache[settings.fuzzy ? key.toLowerCase() : key] = data;
        } else {
          /** Clean the cache */
          cache = {};
        }
      }
      function fromCache(key) {
        return cache[settings.fuzzy ? key.toLowerCase() : key];
      }
      function highlight(text, query) {
        var regex = {
          '^': new RegExp('^' + query, 'i'),
          '*': new RegExp(query, 'ig'),
          '$': new RegExp(query + '$', 'i')
        }[settings.localMatch];
        if (regex && settings.highlight) {
          return text.replace(regex, '<span class=\'' + settings.class4highlight + '\'>' + query + '</span>');
        }
        return text;
      }
      function suggest(force) {
        settings.timer = setTimeout(function () {
          var value = fg.value, currentValue = value ? value.replace(new RegExp('^.{1,}' + settings.delimiter + '', 'g'), '') : '', showSuggestion = function () {
              if (data.length) {
                /** Cache current result */
                setupCache(query, data);
                for (var html = '', i = 0, length = data.length; i < length; ++i) {
                  var item = data[i], value = item[settings.valueKey], text = item[settings.textKey] || value;
                  html += '<li value=\'' + value + '\' data-index=\'' + i + '\'>' + settings.formatter(item, i, highlight(text, query), query, settings) + '</li>';
                }
                setbg();
                self.list.html('<ul>' + html + '</ul>');
                /** Only one result that just select it */
                if (1 === data.length && settings.autoSelect && query.toLowerCase() === data[0][settings.textKey]['toLowerCase']()) {
                  select(data[0]);
                  return;
                }
              } else {
                /** Invalid input, reset the component value */
                $(fg).trigger('focusout');
                return finishSuggest();
              }
              self.list.css({
                'top': fg.offsetHeight,
                'left': 0,
                'width': fg.offsetWidth
              }).addClass('show');
            };
          query = currentValue;
          if (query.length >= settings.minChars) {
            if (!force) {
              /** Try to get data from cache */
              data = fromCache(query) || function (key) {
                var i = 0, res;
                while (key = key.replace(new RegExp('.{1}$'), ''), key) {
                  res = fromCache(key);
                  if (res && res.length < settings.breaksize) {
                    break;
                  }
                }
                return res;
              }(query);
            } else {
              data = false;
            }
            if (data && fromCache(query)) {
              showSuggestion();
            } else {
              filter.call(self, data, query, indicator).done(function () {
                data = this.userData;
                /** Bind cache to DOM for debug */
                settings.cacheKey && ele.data(settings.cacheKey, cache);
                showSuggestion();
              });
            }
          } else {
            bg.value = '';
            self.list.removeClass('show');
          }
        }, 100);
      }
      function finishSuggest() {
        bg.value = '';
        self.stopSuggest();
        self.list.removeClass('show');
      }
      function setbg() {
        var prefix = fg.value.indexOf(',') !== -1 ? fg.value.replace(/\,[^,]+$/, ' ') : '';
        return query && (bg.value = prefix + data[0][settings.textKey]['replace'](new RegExp('^' + query, 'i'), query));
      }
      function setfg(value) {
        if (fg.value.indexOf(settings.delimiter) === -1) {
          return fg.value = value;
        }
        return fg.value = fg.value.replace(new RegExp(settings.delimiter + '[^+' + settings.delimiter + ']+$'), ',') + value;
      }
      function select(item, multiple) {
        var value, index, valid = [];
        if (!item) {
          return;
        }
        value = ele.data('data-value');
        index = fg.value.toLowerCase().split(settings.delimiter).lastIndexOf(item[settings.textKey]['toLowerCase']());
        if (index !== -1) {
          query = item[settings.textKey];
          bg.value = fg.value = fg.value.replace(new RegExp(query, 'i'), query);
          /** Remove other suggestion */
          data = [item];
          value = value instanceof Array ? value : [];
          value.length = fg.value.split(settings.delimiter).length;
          value[index] = item;
          value.forEach(function (v) {
            valid.push(v);
          });
          ele.data('data-value', valid);
        }
        if (multiple || multiple === undefined) {
          settings.set.call(ele, valid, settings);
          /** Remove other suggestion */
          self.list.find('ul').html(suggestion.attr('data-index', 0));
          /** Cache this result for fast suggest */
          setupCache(query, data);
          finishSuggest();
        }
      }
      /** 'true': up, 'false': down */
      function move(current, direction) {
        if (data && !data.length || !self.list.hasClass('show') || settings.ajax && settings.ajax.request && settings.ajax.request.state() === 'pending') {
          return;
        }
        /** If just one item don't show the list */
        if (1 === data.length && settings.autoSelect && fg.value.toLowerCase() === data[0][settings.textKey]['toLowerCase']()) {
          return;
        }
        bg.value = '';
        if (!self.list.get(0).parentNode) {
          /** Show the result */
          setbg();
          return self.list.addClass('show');
        }
        var index, item;
        if (current.length) {
          suggestion = direction ? current.prev() : current.next();
          suggestion.addClass(settings.class4selected);
          self.list.scrollTop(suggestion.attr('data-index') * suggestion.height());
          if (suggestion.length) {
            setfg(data[suggestion.attr('data-index')][settings.textKey]);
            index = suggestion.attr('data-index');
          } else {
            setbg();
            setfg(query);
          }
        } else {
          self.list.find(direction ? 'li:last' : 'li:first').addClass(settings.class4selected);
          setfg(data[index = direction ? data.length - 1 : 0][settings.textKey]);
        }
        if (index !== undefined) {
          item = data[index];
          setupCache(item[settings.textKey]['toLowerCase'](), [item]);
        }
      }
      (fg = ele.find(settings.selector4input), bg = fg.next(), fg).attr('autocomplete', 'off')  /** Keys navigation */.on('keydown', function (e) {
        var keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            UP: 38,
            DOWN: 40
          }, which = e.which;
        if (ele.is('[disabled]')) {
          return;
        }
        switch (true) {
        case which === keys.DOWN || which === keys.UP || which === keys.RETURN || which === keys.TAB:
          var hint = self.list.find('li.' + settings.class4selected), index = hint.attr('data-index');
          /** Reset current hint */
          suggestion = hint.removeClass(settings.class4selected);
          break;
        case which === keys.ESC || which === keys.RETURN || which === keys.TAB:
          finishSuggest();
          break;
        }
        switch (which) {
        case keys.DOWN:
          move(hint, 0);
          break;
        case keys.UP:
          move(hint, 1);
          break;
        case keys.ESC:
          setfg(query);
          break;
        case keys.RETURN:
          if (index !== undefined) {
            select(data[index]);
          } else {
            /** Reset query string */
            query = '';
            if (settings.ajax && settings.ajax.enterforce) {
              suggest(true);
            } else {
              finishSuggest();
            }
          }
          break;
        case keys.TAB:
          if (settings.tabComplete) {
            if (data.length && (fg.value.length && bg.value !== fg.value)) {
              setfg(data[0][settings.textKey]);
              select(data[0]);
              e.preventDefault();
              e.stopPropagation();
            }
          }
          break;
        default:
          suggest();
        }
      })  /** Clear suggestion, apply value to component */.on('focusout', function (e) {
        var values = fg.value ? fg.value.split(settings.delimiter) : 0, valid = [];
        if (self.list.is(':hover')) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.relatedTarget === self.list[0]) {
          return;
        }
        ele.removeData('data-value');
        if (values.length) {
          for (var i = 0, length = values.length; i < length; ++i) {
            var value = values[i], matched = fromCache(value);
            if (value && matched && matched.length === 1 && matched[0][settings.textKey] === value) {
              valid.push(value);
            } else if (settings.inputAnything === false) {
              indicator.addClass(settings.class4error);
            }
          }
          if (valid.length) {
            /** Set the value */
            for (var i = 0, length = valid.length; i < length; ++i) {
              select(fromCache(valid[i])[0], i === length - 1);
            }
          } else
            settings.set.call(ele, [], settings);
        } else {
          /** Clear the component data */
          settings.set.apply(ele, [
            [],
            settings
          ]);
        }
        query = '';
        finishSuggest();
      })  /** Suggest current content */.on('focus', function () {
        suggestion = self.list.find('li:first');
        indicator.removeClass(settings.class4error);
        suggest();
      });
      fg = fg[0];
      bg = bg[0];
      indicator = self.$node.find(settings.selector4indicator).on('click', function (e) {
        /** Clear the input value */
        if (indicator.hasClass(settings.class4error)) {
          $(fg).val(bg.value = '').trigger('focusout');
          indicator.removeClass('error');
        }
      });
      self.list.delegate('li', 'click', function (e) {
        var item = data[this.getAttribute('data-index')];
        if (item) {
          setfg(item[settings.textKey]);
          select(item);
        }
        query = '';
        e.preventDefault();
        e.stopPropagation();
      }).delegate('li', 'mouseout', function (e) {
        suggestion.removeClass(settings.class4selected);
        e.preventDefault();
        e.stopPropagation();
      }).delegate('li', 'mouseover', function (e) {
        suggestion.removeClass(settings.class4selected);
        suggestion = $(this).addClass(settings.class4selected);
        e.preventDefault();
        e.stopPropagation();
      });
      this.setupCache = setupCache;
      this.fromCache = fromCache;
      !settings.showHint && bg && (bg.style.display = 'none');
    };
  function filter(data, query, indicator) {
    var self = this, settings = this.settings, res = [], deferred, regexs = {
        '^': '^${text}',
        '$': '${text}$',
        '*': '${text}'
      }, ajax = settings.ajax, request, regex;
    if (!data && settings.lookup && settings.lookup.length) {
      res = res.concat(settings.lookup);
    }
    if (!data && ajax) {
      indicator.addClass(settings.class4loading);
      deferred = $.Deferred();
      request = ajax.request = ajax.dataProxy(query);
      request.then(function (data) {
        if ('function' === typeof ajax.dataFilter) {
          data = ajax.dataFilter(data);
        }
        res = res.concat(data);
        deferred.resolve();
      }).done(ajax.done).fail(ajax.fail).always(ajax.always, function () {
        indicator.removeClass(settings.class4loading);
      });
    } else if (data) {
      res = res.concat(data);
    }
    if (settings.localMatch instanceof RegExp) {
      regex = settings.localMatch;
    } else {
      regex = new RegExp((regexs[settings.localMatch.toLowerCase()] || regexs[settings.localMatch = '^']).replace(/\${text}/, query), settings.fuzzy ? 'i' : '');
    }
    return $.when(deferred || (deferred = $.Deferred().resolve())).done(function () {
      res = $.grep(res, function (item) {
        return regex.test(item[settings.textKey]);
      });
      this.userData = res;
    });
  }
  AutoComplete.prototype = {
    disabled: function () {
      this.stopSuggest();
      this.$node.attr('disabled', true);
      var settings = this.settings, input = this.$node.find(settings.selector4input);
      input.add(input.next()).attr('disabled', true);
      return this;
    },
    enabled: function () {
      var input = this.$node.find(this.settings.selector4input);
      input.add(input.next()).removeAttr('disabled');
      return this;
    },
    stopSuggest: function () {
      var settings = this.settings;
      clearTimeout(settings.timer);
      settings.ajax && settings.ajax.request && settings.ajax.request.abort();
      return this;
    },
    val: function (value) {
      var settings = this.settings, text = [], dataValue = [];
      if (value) {
        value = value instanceof Array ? value : [value];
        for (var i = 0, length = value.length; i < length; ++i) {
          var v = value[i];
          text.push(v[settings.textKey]);
          dataValue.push(v[settings.valueKey]);
          this.setupCache(text[i], [v]);
        }
        this.$node.data('data-value', value).find(settings.selector4input).val(text.join());
        return this;
      } else
        return this.$node.data('data-value');
    }
  };
  $.fn.autoComplete = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new AutoComplete(this, $.extend({}, $.fn.autoComplete.defaults, options || {}));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.autoComplete.defaults = {
    delimiter: ',',
    minChars: 1,
    cacheKey: 'autoComplete-data',
    class4loading: 'sync',
    class4error: 'error',
    class4selected: 'selected',
    class4highlight: 'highlight',
    class4list: 'list',
    selector4input: 'input:first',
    selector4indicator: '.icon:first',
    valueKey: 'value',
    textKey: 'text',
    breaksize: 10,
    inputAnything: true,
    highlight: false,
    showHint: true,
    /** Case sensitive */
    fuzzy: true,
    /** 'first', 'contains', 'last' */
    localMatch: '^',
    autoSelect: false,
    tabComplete: true,
    /** Local data */
    lookup: [],
    set: $.noop,
    /** From service */
    ajax: undefined,
    formatter: function (item, index, highlightText, query, settings) {
      var value = item[settings.valueKey], text = item[settings.textKey] || value;
      return settings.highlight ? highlightText : text;
    }
  };
}(window.jQuery));
ui_autoComplete_autoComplete = undefined;
ui_autoComplete_autoComplete_ng = function (args) {
  /**
   * example:
   *
       <s-autocomplete
           ng-model="reps"
           ajax="ajax"
           highlight="true"
           value-key="full_name"
           text-key="name"
           local-match="'*'"
           show-hint="false"
           placeholder="Search GitHub Repository">
           <div class="rep">
               <p>
               {{ $text }} - <a href="{{ owner.html_url }}" title="Author by {{ owner.login }}">{{ owner.login }}</a>
               </p>
               <p>
               <code><i class="icon github3"></i><a href="{{ html_url }}" title="{{ full_name }}">{{ html_url }}</a></code>
               </p>
               <p>
               <code>{{ watchers.toLocaleString() }} Watchers</code>
               <code>{{ forks.toLocaleString() }} Forks</code>
               <code>{{ language }}</code>
               <code>Last update: {{ updated_at }}</code>
               <code class="issue"><i class="icon issue"></i>{{ open_issues_count }}</code>
               </p>
           </div>
       </s-autocomplete>
   * */
  angular.module('$ui.autoComplete', []).directive('sAutocomplete', [
    '$rootScope',
    '$compile',
    function ($rootScope, $compile) {
      function link($scope, $element, $attrs, undefined, link) {
        var options = args($scope, $attrs, { 'showHint': 'boolean' }), autoComplete, transclude, markup, html, inProgress = false;
        transclude = link($scope);
        markup = transclude.parent().html().trim();
        transclude.remove();
        if (markup) {
          options.formatter = function (item, index, highlightText, query, settings) {
            var value = item[settings.valueKey], text = item[settings.textKey] || value;
            html = markup.replace(/\{\{\s*\$value\s*\}\}/g, value).replace(/\{\{\s*\$index\s*\}\}/g, index).replace(/\{\{\s*\$text\s*\}\}/g, highlightText);
            html = $compile(html)(angular.extend($scope.$parent.$new(), item));
            $scope.$parent.$apply();
            html = angular.element('<w>').append(html).html();
            return html;
          };
        }
        options.set = function (data, settings) {
          if (!$rootScope.$$phase) {
            inProgress = !inProgress;
            $scope.value = data;
            $scope.$apply();
            inProgress = !inProgress;
          }
        };
        $element.find($.fn.autoComplete.defaults.selector4input).attr('placeholder', options.placeholder || '');
        autoComplete = $($element).autoComplete(options);
        $scope.$watch('value', function (value) {
          !inProgress && autoComplete.val(value);
        });
        $scope.$watch('lookup', function (value) {
          if (value !== autoComplete.settings.lookup) {
            autoComplete.settings.lookup = value;
          }
        });
        $scope.$watch('disabled', function (value) {
          var disabled = $scope.disabled;
          if (disabled === 'true' || disabled) {
            autoComplete.disabled();
          } else {
            autoComplete.enabled();
          }
        });
        $scope.$watch('localMatch', function (value) {
          var modes = [
              '^',
              '$',
              '*'
            ], settings = autoComplete.settings;
          if (modes.indexOf(value) !== -1 && value !== settings.localMatch) {
            autoComplete.setupCache();
            settings.localMatch = value;
            autoComplete.val(autoComplete.val());
          }
        });
        $scope.$watch('highlight', function (value) {
          autoComplete.settings.highlight = value;
        });
        $scope.$watch('fuzzy', function (value) {
          var settings = autoComplete.settings;
          if (settings.fuzzy !== value) {
            settings.fuzzy = value;
            autoComplete.setupCache();
            /** Use current value rebuild the cache */
            autoComplete.val(autoComplete.val());
          }
        });
        $scope.$watch('tabComplete', function (value) {
          autoComplete.settings.tabComplete = value;
        });
      }
      return {
        scope: {
          lookup: '=',
          ajax: '=',
          minChars: '@',
          valueKey: '@',
          textKey: '@',
          breaksize: '@',
          placeholder: '@',
          delimiter: '@',
          inputAnything: '@',
          showHint: '@',
          fuzzy: '=',
          tabComplete: '=',
          highlight: '=',
          localMatch: '=',
          disabled: '=ngDisabled',
          value: '=ngModel'
        },
        transclude: true,
        replace: true,
        template: '<div class="ui autoComplete">' + '<input class="ui text front" type="text" placeholder="Type for search..." />' + '<input class="ui text hint" type="text" tabindex="-1" />' + '<i class="icon"></i>' + '</div>',
        link: link
      };
    }
  ]);
}(util_ng_args);
(function (exports) {
  /**
   * See python date format
   *
   * %a - Abbreviated weekday name
   * %A - Full weekday name
   * %b - Abbreviated month name
   * %B - Full month name
   * %c - date and time, as "%a %b %e %H:%M:%S %Y"
   * %d - Zero-padded day of the month as a decimal number[01, 31]
   * %e - Space-padded day of the month as a decimal number [1, 31]
   * %H - Hour(24-hour clock) as decimal number[00, 23]
   * %I - Hour(12-hour clock) as a decimal number[01, 12]
   * %j - Day of the year as a decimal number[001, 366]
   * %m - Month as a decimal number[01, 12]
   * %M - Minute as a decimal number[00, 59]
   * %L - Milliseconds as a decimal number[000, 999]
   * %p - Either AM or PM
   * %S - Second as a decimal number[00, 59]
   * %U - Week nunber of the year(Sunday as the first day of the week) as a decimal number[00, 53]
   * %w - Weekday as a decimal number[0(Sunday), 6]
   * %x - Date, as "%m/%d/%Y"
   * %X - Time, as "%H:%M:%S"
   * %y - Year without century as a decimal number[00, 99]
   * %Y - Year with century as a decimal number
   * %Z - Tiem zone offset, such as "-0700"
   * %% - A literal "%" character
   * */
  var Dateutil = function (value, options) {
    switch (true) {
    case value instanceof Date:
      break;
    case typeof value === 'number':
      value = new Date(value);
      break;
    case typeof value === 'string':
      value = new Date(value);
      break;
    default:
      value = new Date();
    }
    this.value = defaultValue = isNaN(value) ? new Date() : value;
    this.settings = $.extend({}, Dateutil.defaults, options || {});
  };
  Dateutil.defaults = {
    format: '%Y-%m-%d',
    abbreviatedWeekdayName: [
      'Sun',
      'Mon',
      'Tues',
      'Wed',
      'Thur',
      'Fri',
      'Sat'
    ],
    weekdayName: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Satruday'
    ],
    abbreviatedMonthName: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'
    ],
    monthName: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  };
  Dateutil.prototype = {
    format: function (format) {
      var self = this, value = this.value, settings = this.settings,
        /** Shortcuts */
        abbreviatedWeekdayName = settings.abbreviatedWeekdayName, weekdayName = settings.weekdayName, abbreviatedMonthName = settings.abbreviatedMonthName, monthName = settings.monthName, fullYear = value.getFullYear(), year = value.getYear(), month = value.getMonth(), date = value.getDate(), day = value.getDay(), hour = value.getHours(), minute = value.getMinutes(), second = value.getSeconds(), milliSecond = value.getMilliseconds(), timeZoneOffset = value.getTimezoneOffset();
      return (format || settings.format).replace(/(yyyy|MM|dd|HH|mm|ss|%a|%A|%b|%B|%c|%d|%e|%H|%I|%j|%m|%M|%L|%p|%S|%U|%w|%x|%X|%y|%Y|%Z|%%)/g, function (match, post, originalText) {
        switch (match) {
        case 'yyyy':
          return fullYear;
        case 'MM':
          return month + 1;
        case 'dd':
          return date;
        case 'HH':
          return hour;
        case 'mm':
          return minute;
        case 'ss':
          return second;
        case '%a':
          return abbreviatedWeekdayName[day];
        case '%A':
          return weekdayName[day];
        case '%b':
          return abbreviatedMonthName[month];
        case '%B':
          return monthName[month];
        case '%c':
          return self.format.call({
            settings: settings,
            value: value
          }, '%a %b %e %H:%M:%S %Y');
        case '%d':
          return ('0' + date).slice(-2);
        case '%e':
          return date;
        case '%H':
          return ('0' + hour).slice(-2);
        case '%I':
          return hour <= 12 ? hour : hour - 12;
        case '%j':
          var i = 0, increment = 0;
          while (i++ < month) {
            increment += new Date(fullYear, i, 0).getDate();
          }
          return ('00' + (increment + date)).slice(-3);
        case '%m':
          return ('0' + (month + 1)).slice(-2);
        case '%M':
          return ('0' + minute).slice(-2);
        case '%L':
          return ('00' + milliSecond).slice(-3);
        case '%p':
          return hour > 11 ? 'PM' : 'AM';
        case '%S':
          return ('0' + second).slice(-2);
        case '%U':
          return ('0' + Math.ceil(self.format.call({
            settings: settings,
            value: value
          }, '%j') / 7)).slice(-2);
        case '%w':
          return day;
        case '%x':
          return self.format.call({
            settings: settings,
            value: value
          }, '%m/%d/%Y');
        case '%X':
          return self.format.call({
            settings: settings,
            value: value
          }, '%H:%M:%S');
        case '%y':
          return year;
        case '%Y':
          return fullYear;
        case '%Z':
          return timeZoneOffset;
        case '%%':
          return '%';
        }
      });
    },
    nice: function () {
      var diff = (new Date() - this.value) / 1000, days = Math.floor(diff / 86400);
      if (diff < 0) {
        return this.format.call({
          settings: this.settings,
          value: this.value
        });
      } else if (diff < 60) {
        return 'just ago';
      } else if (diff < 120) {
        return '1 minute ago';
      } else if (diff < 3600) {
        return Math.floor(diff / 60) + ' minutes ago';
      } else if (diff < 7200) {
        return '1 hour ago';
      } else if (diff < 86400) {
        return Math.floor(diff / 3600) + ' hours ago';
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return days + ' days ago';
      } else if (days < 31) {
        Math.ceil(days / 7) + ' weeks ago';
      } else if (days >= 31) {
        return 'more than 5 weeks ago';
      }
    },
    day: function (value) {
      return new Date(+this.value + value * 3600 * 1000 * 24);
    },
    name: function (name, format) {
      var date = this.value, offset, mapping = {
          'monday': 1,
          'tuesday': 2,
          'wednesday': 3,
          'thursday': 4,
          'friday': 5,
          'saturday': 6,
          'sunday': 7
        };
      if (date.getDay() === 0) {
        offset = date.getDay() + (mapping[name] - 7);
      } else {
        offset = -(date.getDay() - mapping[name]);
      }
      return this.format.call({
        settings: this.settings,
        value: this.day(offset)
      }, format);
    },
    monday: function (format) {
      return this.name('monday', format);
    },
    tuesday: function (format) {
      return this.name('tuesday', format);
    },
    wednesday: function (format) {
      return this.name('wednesday', format);
    },
    thursday: function (format) {
      return this.name('thursday', format);
    },
    friday: function (format) {
      return this.name('friday', format);
    },
    saturday: function (format) {
      return this.name('saturday', format);
    },
    sunday: function (format) {
      return this.name('sunday', format);
    },
    yesterday: function (format) {
      return this.format.call({
        settings: this.settings,
        value: this.day(-1)
      }, format);
    },
    tomorrow: function (format) {
      return this.format.call({
        settings: this.settings,
        value: this.day(1)
      }, format);
    },
    week: function (value) {
      return this.day(value * 7);
    },
    lastWeek: function (format) {
      return this.format.call({
        settings: this.settings,
        value: this.week(-1)
      }, format);
    },
    nextWeek: function (format) {
      return this.format.call({
        settings: this.settings,
        value: this.week(1)
      }, format);
    },
    month: function (value) {
      var date = this.value, current = [
          date.getFullYear(),
          date.getMonth()
        ], offset = [
          Math.floor(value / 12),
          value % 12
        ];
      return new Date(current[0] + offset[0], current[1] + offset[1], date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds());
    }
  };
  exports = exports || window;
  exports.dateutil = function () {
    var instance = {};
    Dateutil.apply(instance, arguments);
    return $.extend(instance, Dateutil.prototype);
  };
  return exports;
}(window.jQuery));
util_dateutil = undefined;
ui_calendar_calendar = function () {
  var namespace = '$ui.calendar', Calendar = function (target, settings) {
      var defaultDate, current, inAnimate = false, show = function (step) {
          var container = calendar.find('.content .dates.current'), label = [], steps = [step];
          if (inAnimate) {
            return;
          }
          if (settings.double) {
            if (step instanceof Date) {
              steps.push(new Date(step.getFullYear(), step.getMonth() + 1));
            } else {
              steps.push(step > 0 ? 1 : -1);
            }
          }
          for (var i = 0, length = steps.length; i < length; ++i) {
            var step = steps[i];
            (function (container, step) {
              var prev, next, animation, html;
              prev = container.prev();
              next = container.next();
              step = step || new Date();
              switch (step) {
              /** Previous month */
              case -1:
                if (1 === current[1]) {
                  --current[0];
                  current[1] = 12;
                } else
                  --current[1];
                break;
              /** Next month */
              case 1:
                if (12 === current[1]) {
                  ++current[0];
                  current[1] = 1;
                } else
                  ++current[1];
                break;
              /** Next year */
              case 12:
                ++current[0];
                break;
              /** Previous year */
              case -12:
                --current[0];
                break;
              default:
                current = [
                  step.getFullYear(),
                  step.getMonth() + 1,
                  1
                ];
              }
              label.push(settings.months[current[1] - 1] + ' , ' + current[0]);
              html = calc(new Date(current.join('/')), defaultDate, settings);
              if (step instanceof Date || steps[0] === void 0) {
                return container.html(html).css('height', 'auto');
              }
              inAnimate = true;
              animation = step > 0 ? next : prev;
              animation.html(html);
              container.animate({ 'height': animation.height() }, 200);
              animation.animate({ 'left': '1%' }, 200, function () {
                container.html(html);
                animation.css('left', step > 0 ? '100%' : '-100%');
                /** Unlock animation */
                i === steps.length && (inAnimate = 0);
              });
            }(container.eq(step > -1 ? i : length - 1 - i), step));
            if (step < 0) {
              label = label.reverse();
            }
            calendar.find('.date').html(label.join(' - '));
          }
        }, input = target.find(settings.selector4input), trigger = target.find(settings.selector4trigger), header = [], template = '<div tabindex=-1 class=\'container\' >' + '<div class=\'control\'>' + '<div class=\'icon first\'></div>' + '<div class=\'icon prev\'></div>' + '<div class=\'date\'>Today</div>' + '<div class=\'icon next\'></div>' + '<div class=\'icon last\'></div>' + '</div>' + '<div class=\'content\'>' + '<div class=\'days\'>' + '<div class=\'header\'></div>' + '<div class=\'dates prev\'></div>' + '<div class=\'dates current\'></div>' + '<div class=\'dates next\'></div>' + '</div>' + '</div>', calendar;
      this.$node = target;
      this.settings = settings;
      input.attr({
        'name': target.attr('name'),
        'placeholder': settings.placeholder
      });
      if (settings.showTime) {
        template += '<div class=\'time\'>' + '<input name=\'hour\' maxlength=2 value=\'00\' />' + '<input name=\'minute\' maxlength=2 value=\'00\' />' + '<input name=\'second\' maxlength=2 value=\'00\' />' + '</div>';
      }
      for (var i = 0, length = settings.daysOfTheWeek.length; i < length; header.push('<div>' + settings.daysOfTheWeek[i++] + '</div>'));
      switch (true) {
      case 'string' === typeof settings.defaultDate:
        defaultDate = new Date(settings.defaultDate);
        input.val($.dateutil(defaultDate).format(settings.format));
        break;
      default:
        if (input.val()) {
          defaultDate = new Date(input.val());
          if (isNaN(+defaultDate)) {
            input.val('');
            defaultDate = new Date();
          }
        } else
          defaultDate = new Date();
      }
      trigger.on('click', function (e) {
        var rect, container;
        /** Prevent multiple instance */
        if (inAnimate || trigger.is('[disabled]') || calendar && calendar.hasClass('show')) {
          return;
        }
        rect = input[0].getBoundingClientRect();
        e.preventDefault();
        e.stopPropagation();
        calendar = $(template);
        if (settings.double) {
          container = calendar.find('.content .days');
          container.clone().appendTo(calendar.addClass('double').find('.content'));
        }
        calendar.find('.header').html(header.join(''));
        show(defaultDate);
        calendar.appendTo(target).css({
          'top': rect.height + 20,
          'z-index': 999
        }).delegate('.icon.prev', 'click', function (e) {
          show(-1);
          e.preventDefault();
        }).delegate('.icon.next', 'click', function (e) {
          show(1);
          e.preventDefault();
        }).delegate('.date', 'click', function () {
          show();
        }).delegate('.icon.first', 'click', function (e) {
          show(-12);
          e.preventDefault();
        }).delegate('.icon.last', 'click', function (e) {
          show(12);
          e.preventDefault();
        }).delegate('div.day', 'click', function () {
          var self = $(this), date, value;
          if (!self.hasClass('invalid')) {
            date = new Date(this.getAttribute('data-date') + ' ' + (calendar.find('input[name=hour]').val() || 0) + ':' + (calendar.find('input[name=minute]').val() || 0) + ':' + (calendar.find('input[name=second]').val() || 0));
            value = $.dateutil(date).format(settings.format);
            input.val(value).focus();
            settings.onSelect(value);
            input.trigger('change');
            defaultDate = date;
            setTimeout(function () {
              calendar.remove();
            });
          }
        }).delegate('input', 'focusout', function (e) {
          var self = $(this);
          switch (true) {
          case this.name === 'hour' && (+self.val() || 99) > 23:
            self.val('00');
            break;
          case (+self.val() || 99) > 59:
            self.val('00');
            break;
          }
        }).delegate('input', 'keyup', function (e) {
          var self = $(this);
          if (e.keyCode !== 38 && e.keyCode !== 40) {
            return;
          }
          if (isNaN(self.val()) || +self.val() < 0) {
            return self.val('00');
          }
          /** Handle key down */
          if (e.keyCode === 40) {
            if (+self.val() > 0) {
              self.val(('0' + (+self.val() - 1)).slice(-2));
            } else {
              self.val(this.name === 'hour' ? '23' : '59');
            }
            return;
          }
          /** Handle key up */
          if (this.name === 'hour' && this.value === '23' || +this.value === 59) {
            return self.val('00');
          }
          self.val(('0' + (+self.val() + 1)).slice(-2));
        }).on('focusout', function (e) {
          if (calendar.is(':hover')) {
            return;
          }
          inAnimate = 1;
          calendar.removeClass('show');
          setTimeout(function () {
            calendar.remove();
            inAnimate = 0;
          }, 300);
        });
        /** Force reflow */
        calendar.offset();
        calendar.addClass('show');
        setTimeout(function () {
          /** After the transition hold the focus */
          calendar.focus();
        }, 300);
      });
    };
  function calc(date, defaultDate, settings) {
    var prev = new Date(date.getFullYear(), date.getMonth(), 0), next = new Date(date.getFullYear(), date.getMonth() + 1, 1), now = new Date(), range = {
        prev: [
          prev.getDate() - prev.getDay(),
          prev.getDate()
        ],
        current: [
          1,
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        ],
        next: [
          1,
          6 - next.getDay() + 1
        ]
      }, isValid = function (date, start) {
        var minDate = settings.minDate && new Date(settings.minDate), maxDate = settings.maxDate && new Date(settings.maxDate), date = new Date(date.getFullYear(), date.getMonth(), start);
        if (minDate || maxDate) {
          if (date >= minDate && date <= maxDate || !maxDate && date >= minDate || !minDate && date <= maxDate) {
            return ' valid ';
          }
          return ' invalid ';
        }
        return ' ';
      }, html = '';
    for (var start = range.prev[0], end = range.prev[1]; end - start !== 6 && start <= end; ++start) {
      html += '<div class=\'day ' + isValid(prev, start) + ' adjacent prev\' ' + 'data-date=\'' + [
        prev.getFullYear(),
        prev.getMonth() + 1,
        start
      ].join('/') + '\'>' + start + '</div>';
    }
    for (var start = range.current[0], end = range.current[1]; start <= end; ++start) {
      var clazz = isValid(date, start);
      start < now.getDate() && (clazz += ' past ');
      date.getFullYear() === defaultDate.getFullYear() && date.getMonth() === defaultDate.getMonth() && start === defaultDate.getDate() && (clazz += ' current ');
      date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && start === now.getDate() && (clazz += ' today ');
      html += '<div class=\'day ' + clazz + '\' data-date=\'' + [
        date.getFullYear(),
        date.getMonth() + 1,
        start
      ].join('/') + '\'>' + start + '</div>';
    }
    for (var start = range.next[0], end = range.next[1]; end - start !== 6 && start <= end; ++start) {
      html += '<div class=\'day ' + isValid(next, start) + ' adjacent next\' ' + ' data-date=\'' + [
        next.getFullYear(),
        next.getMonth() + 1,
        start
      ].join('/') + '\'>' + start + '</div>';
    }
    return html;
  }
  Calendar.prototype = {
    val: function (value) {
      var input = this.$node.find(':input');
      if (value && !isNaN(+new Date(value))) {
        var date = new Date(value);
        input.val($.dateutil(date).format(this.settings.format));
      } else
        return input.val();
    },
    disabled: function () {
      var settings = this.settings;
      this.$node.find(settings.selector4input + ' , ' + settings.selector4trigger).attr('disabled', true);
    },
    enabled: function () {
      var settings = this.settings;
      this.$node.find(settings.selector4input + ' , ' + settings.selector4trigger).removeAttr('disabled');
    },
    focus: function () {
      this.$node.find(':input').focus();
    }
  };
  $.fn.calendar = function (options, force) {
    var settings, instance = this.data(namespace);
    if (!instance || true === force) {
      settings = $.extend({}, $.fn.calendar.defaults, options || {}), instance = new Calendar(this, settings);
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.calendar.defaults = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    daysOfTheWeek: [
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S'
    ],
    format: '%Y-%m-%d',
    formatter4cell: $.noop(),
    onSelect: $.noop,
    showTime: false,
    double: false,
    minDate: undefined,
    maxDate: undefined,
    placeholder: 'Year - Month - Day',
    defaultDate: new Date(),
    selector4input: ':input',
    selector4trigger: '.icon.calendar'
  };
}();
ui_calendar_calendar_ng = function (args) {
  /**
   * example:
   *
      <s-calendar
          ng-disabled="isDisabled"
          ng-model="date"
          placeholder="Year-Month-Day"
          double="twoMonths"
          show-time="showTime"
          min-date="minDate"
          max-date="maxDate"
          on-select="onClick"
          default-date="defaultDate"
          ng-model="date">
      </s-calendar>
   * */
  angular.module('$ui.calendar', []).directive('sCalendar', [
    '$rootScope',
    function ($rootScope) {
      function link($scope, $element, $attrs) {
        var options = args($scope, $attrs), calendar, settings;
        options.onClick = function (value) {
          if ($rootScope.$$pahse) {
            return;
          }
          ($scope.onClick() || $.noop)(value);
          $scope.defaultDate = value;
          $scope.$apply();
        };
        $scope.$watch('minDate', function (value) {
          $rootScope.$$phase || (settings.minDate = value);
        });
        $scope.$watch('maxDate', function (value) {
          !$rootScope.$$phase && (settings.maxDate = value);
        });
        $scope.$watch('double', function (value) {
          settings.double = value;
        });
        $scope.$watch('defaultValue', function (value) {
          if (!$rootScope.$$phase) {
            settings.defaultDate = value;
          }
        });
        $scope.$watch('disabled', function (value) {
          calendar[value ? 'disabled' : 'enabled']();
        });
        calendar = $($element).calendar(options), settings = calendar.settings;
      }
      return {
        scope: {
          disabled: '=ngDisabled',
          showTime: '=',
          placeholder: '@',
          format: '@',
          defaultDate: '=ngModel',
          minDate: '=',
          maxDate: '=',
          onClick: '&',
          double: '='
        },
        restric: 'E',
        replace: true,
        template: '<div class="ui calendar">' + '<input class="ui text" type="text" readonly="readonly" />' + '<i class="icon calendar"></i>' + '</div>',
        link: link
      };
    }
  ]);
}(util_ng_args);
(function ($) {
  var namespace = '$ui.ripple', Ripple = function (target, settings) {
      var self = this, duration = settings.duration + 'ms', ripple = target.find('span.ripple');
      this.$node = target.css('position', 'relative');
      this.settings = settings;
      if (!ripple.length) {
        var max = Math.max(target.innerHeight(), target.innerWidth());
        ripple = $('<span class=\'ripple\'>').css({
          width: max,
          height: max
        }).appendTo(target);
      }
      if (settings.autoBind) {
        target.on('click', function (e) {
          !self.$node.is('[disabled]') && self.show(e);
        });
      }
      ripple.css({
        '-webkit-animation-duration': duration,
        '-moz-animation-duration': duration,
        '-ms-animation-duration': duration,
        '-o-animation-duration': duration,
        'animation-duration': duration
      });
    };
  Ripple.prototype = {
    disabled: function () {
      this.$node.attr('disabled', true);
      return this;
    },
    enabled: function () {
      this.$node.attr('disabled', false);
      return this;
    },
    show: function (e) {
      var self = this, settings = self.settings, offset = this.$node.offset(), X = e ? e.pageX : offset.left + this.$node.outerWidth() / 2, Y = e ? e.pageY : offset.top + this.$node.outerHeight() / 2, rect = this.$node[0].getBoundingClientRect(), ripple = this.$node.find('span.ripple'), doc = $(document), position = {
          top: Y - rect.top - ripple[0].offsetHeight / 2 - doc.scrollTop(),
          left: X - rect.left - ripple[0].offsetWidth / 2 - doc.scrollLeft()
        };
      clearTimeout(self.timer);
      settings.speed = settings.speed || settings.originalSpeed;
      settings.speed && self.disabled().$node.addClass(settings.class4progress);
      (function f(self, ripple, speed, position) {
        self.timer = setTimeout(function () {
          ripple.removeClass('show').css({
            top: position.top,
            left: position.left,
            background: settings.color || '#' + Math.floor(Math.random() * 4095 + 0).toString(15)
          });
          setTimeout(function () {
            ripple.addClass('show');
            speed ? f(self, ripple, speed, position) : setTimeout(function () {
              ripple.removeClass('show');
            }, settings.duration << 1);
          }, 100);
        }, self.settings.speed);
        if (self.settings.random) {
          var height = ripple[0]['offsetHeight'], width = ripple[0]['offsetWidth'];
          position = {
            top: Y - rect.top - document.body.scrollTop - (Math.random() * (0 - height) + height),
            left: X - rect.left - document.body.scrollLeft - (Math.random() * (0 - width) + width)
          };
        }
      }(self, ripple, self.settings.speed, position));
      return this;
    },
    hide: function (status) {
      var self = this, $node = this.$node, settings = this.settings, clazz;
      if (settings.originalSpeed === void 0) {
        settings.originalSpeed = settings.speed;
      }
      settings.speed = 0;
      clearTimeout(self.timer);
      $node.removeClass(settings.class4progress);
      clazz = status === true || undefined === status ? settings.class4done : settings.class4fail;
      $node.addClass(clazz);
      setTimeout(function () {
        self.enabled();
        $node.removeClass(clazz);
      }, settings.speed);
      return this;
    }
  };
  $.fn.ripple = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Ripple(this.addClass('ui ripple'), $.extend({}, $.fn.ripple.defaults, options || {}));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.ripple.defaults = {
    speed: 0,
    duration: 400,
    random: false,
    color: false,
    autoBind: true,
    class4progress: 'ripple-progress',
    class4done: 'ripple-done',
    class4fail: 'ripple-fail'
  };
}(window.jQuery));
ui_ripple_ripple = undefined;
ui_dropdown_dropdown = function () {
  var namespace = '$ui.dropdown', Dropdown = function (target, settings) {
      var self = this,
        /** Shortcutts */
        title, content;
      target = $(target).attr('tabindex', 1);
      this.$node = target;
      this.settings = settings;
      title = target.find(settings.selector4title).html(settings.nothing);
      content = target.find(settings.selector4content);
      target.on('focusout', function (e, immediate) {
        setTimeout(function () {
          if (immediate || !target.is(':focus') && !content.is(':focus')) {
            target.removeClass('open');
          }
        }, 300);
      })  /** Update the text */.on('update.dropdown', function (e) {
        var text = [], lis = content.find('li.selected');
        for (var i = 0; i < lis.length; text.push(settings.data[lis.eq(i++).attr('data-index')][settings.textKey]));
        text = text.join(',') || settings.nothing;
        title.html(text).attr('title', text);
        if (settings.autoWidth) {
          content.css({
            'width': target.width(),
            'display': 'block'
          });
        } else {
          content.css('display', '');
        }
      })  /** Show the content */.on(settings.type, function (e) {
        var deferred, data = settings.data;
        if (target.is('[disabled]') || target.hasClass(settings.class4loading)) {
          return;
        }
        if (data instanceof Array) {
          if (!target.hasClass('open')) {
            target.addClass('open').focus();
          }
          return;
        }
        /** Ajax loading */
        deferred = (data || $.noop)();
        target.addClass(settings.class4loading);
        $.when(deferred).done(function (result) {
          if (result instanceof Array) {
            data = result;
          } else if (this instanceof Array) {
            data = this;
          } else {
            throw new Error('Invalid data');
          }
          settings.data = data;
          renderList(target.find(settings.selector4content), settings);
          target.addClass('open');
        }).fail(function () {
          target.addClass('error');
        }).always(function () {
          target.removeClass(settings.class4loading);
        });
      })  /** Select an item */.delegate('li', 'select.dropdown', function () {
        var self = $(this);
        if (false === settings.multiple) {
          content.find('li.selected').removeClass('selected');
        }
        self.addClass('selected');
      })  /** Deselect */.delegate('li', 'deselect.dropdown', function () {
        var self = $(this);
        if (true === settings.required && self.hasClass('selected') && content.find('li.selected').length === 1) {
          return;
        }
        self.removeClass('selected');
      })  /** Item toggle */.delegate('li', 'click toggle', function (e) {
        var item = $(this), selected;
        if (!item.is('[disabled]')) {
          selected = item.hasClass('selected');
          if (selected) {
            item.trigger('deselect.dropdown');
          } else {
            item.trigger('select.dropdown');
          }
          target.trigger('update.dropdown');
          settings.onSelect.call(item, settings.data[item.attr('data-index')], settings);
          if (settings.closeOnSelect) {
            target.trigger('focusout', 'Force close the dropdown~');
          }
          e.preventDefault();
          e.stopPropagation();
        }
      });
      self.render(settings.data);
    };
  Dropdown.prototype = {
    render: function (data) {
      var settings = this.settings;
      settings.data = data;
      if (settings.data instanceof Array) {
        renderList(this.$node.find(settings.selector4content), settings);
      }
      return this;
    },
    val: function (value) {
      var settings = this.settings, res = [];
      if (value) {
        value = value instanceof Array ? value : [value];
        for (var i = value.length; --i >= 0;) {
          var index = settings.data.indexOf(value[i]), item = this.$node.find('ul li[data-index=\'' + index + '\']');
          if (item.length) {
            item.trigger('select.dropdown');
            res.push(value[i][settings.valueKey]);
          }
        }
        this.$node.trigger('update.dropdown');
      } else {
        this.$node.find('li.selected').each(function () {
          res.push(settings.valueKey ? this.getAttribute('data-value') : settings.data[this.getAttribute('data-index')]);
        });
        return res;
      }
      return this;
    },
    add: function (data) {
      var settings = this.settings, data = settings.data.concat(data);
      this.settings.data = data;
      renderList(this.$node.find(settings.selector4content), this.settings);
      return this;
    },
    selectAll: function () {
      var $node = this.$node, settings = this.settings, selected = $node.find('ul li');
      if (settings.multiple) {
        selected.addClass('selected');
      } else if (!selected.filter('.selected').length) {
        selected.first().addClass('selected');
      }
      $node.trigger('update.dropdown');
      return this;
    },
    deselectAll: function () {
      this.$node.find('ul li').removeClass('selected');
      this.$node.trigger('update.dropdown');
      return this;
    },
    disabled: function () {
      this.$node.attr('disabled', true);
      return this;
    },
    enabled: function () {
      this.$node.removeAttr('disabled');
      return this;
    },
    open: function () {
      this.$node.addClass('open');
    },
    close: function () {
      this.$node.removeClass('open');
    }
  };
  function renderList(content, settings) {
    var lis = function () {
      var res = '';
      for (var data = settings.data, i = 0, length = settings.data.length; i < length; ++i) {
        var item = data[i], li = '<li ' + (item.disabled ? ' disabled=\'disabled\' ' : '') + 'data-value=\'' + item[settings.valueKey] + '\' ' + 'data-index=\'' + i + '\' ' + 'title=\'' + item[settings.textKey] + '\'>' + settings.formatter(item, settings) + '</li>';
        res += $('<p>').append($(li).attr('data-index', i)).html();
      }
      return res;
    }();
    content.css('display', 'none').html('<ul>' + lis + '</ul>').trigger('update.dropdown');
    if (settings.ripple) {
      content.find('> ul > li').addClass('ui ripple').each(function () {
        $(this).ripple();
      }).ripple();
    }
  }
  $.fn.dropdown = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Dropdown(this, $.extend({}, $.fn.dropdown.defaults, options));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.dropdown.defaults = {
    nothing: 'Please select',
    selector4title: '.title:first',
    selector4content: '.content:first',
    class4loading: 'sync',
    type: 'click',
    multiple: false,
    required: false,
    data: [],
    textKey: 'text',
    valueKey: 'value',
    ripple: true,
    autoWidth: false,
    closeOnSelect: true,
    onSelect: $.noop,
    formatter: function (item, settings) {
      return '<span>' + (item[settings.textKey] || item[settings.valueKey]) + '</span>';
    }
  };
}();
ui_dropdown_dropdown_ng = function (args) {
  /**
   * example:
   *
      <s-dropdown
          data="ajax"
          ng-disabled="isDisabled"
          ng-model="reps"
          required="required"
          auto-width="true"
          text-key="full_name"
          value-key="false"
          multiple="multiple"
          close-on-select="false"
          nothing="Multiple and less one item">
          <p>
              {{ name }} - <a href="{{ owner.html_url }}" title="Author by {{ owner.login }}">{{ owner.login }}</a>
          </p>
          <p>
              <code><i class="icon github3"></i><a href="{{ html_url }}" title="{{ full_name }}">{{ html_url }}</a></code>
          </p>
          <p>
              <code>{{ watchers.toLocaleString() }} Watchers</code>
              <code>{{ forks.toLocaleString() }} Forks</code>
              <code>{{ language }}</code>
              <code>Last update: {{ updated_at }}</code>
              <code class="issue"><i class="icon issue"></i>{{ open_issues_count }}</code>
          </p>
      </s-dropdown>
   * */
  angular.module('$ui.dropdown', []).directive('sDropdown', [
    '$rootScope',
    '$compile',
    function ($rootScope, $compile) {
      function link($scope, $element, $attrs, undefined, link) {
        var options = args($scope, $attrs, {
            'closeOnSelect': 'boolean',
            'autoWidth': 'boolean'
          }), dropdown, transclude, markup, html;
        options.onSelect = function (item, settings) {
          if (!$rootScope.$$phase) {
            $scope.value = dropdown.val();
            $scope.$apply();
            ($scope.onSelect() || $.noop).apply(this, arguments);
          }
        };
        options.valueKey = options.valueKey === 'false' ? false : options.valueKey;
        transclude = link($scope);
        if (transclude.length) {
          markup = transclude.parent().html().trim();
          transclude.remove();
          if (markup) {
            options.formatter = function (item, settings) {
              markup;
              html = $compile(markup)(angular.extend($scope.$parent.$new(), item));
              $scope.$parent.$apply();
              html = angular.element('<w>').append(html).html();
              return html;
            };
          }
        }
        dropdown = $($element).dropdown(options);
        /** Get the reference */
        options = dropdown.settings;
        $scope.$watch('value', function (value) {
          dropdown.val(value);
        });
        $scope.$watch('data', function (data) {
          dropdown.render(data);
        });
        $scope.$watch('multiple', function (value) {
          options.multiple = +value === 1;
        });
        $scope.$watch('required', function (value) {
          options.required = !!value;
        });
        $scope.$watch('disabled', function (value) {
          value ? dropdown.disabled() : dropdown.enabled();
        });
        dropdown.val($scope.value);
      }
      return {
        scope: {
          disabled: '=ngDisabled',
          value: '=ngModel',
          data: '=',
          textKey: '@',
          valueKey: '@',
          autoWidth: '@',
          onSelect: '&',
          type: '@',
          nothing: '@',
          closeOnSelect: '@',
          multiple: '=',
          required: '='
        },
        restric: 'E',
        transclude: true,
        replace: true,
        template: '<div class=\'ui dropdown\'>' + '<i class=\'icon status\'></i>' + '<p class=\'title\'></p>' + '<div class=\'content\'></div>' + '</div>',
        link: link
      };
    }
  ]);
}(util_ng_args);
(function ($) {
  'use strict';
  var namespace = '$ui.loading', Loading = function (target, settings) {
      this.$node = target = $(target);
      this.settings = settings;
      target.parent().css('position', 'relative');
    };
  Loading.prototype = {
    show: function () {
      this.$node.addClass('show');
      return this;
    },
    hide: function (callback) {
      this.$node.removeClass('show');
      return this;
    }
  };
  $.fn.loading = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Loading(this, options || {});
      this.data(namespace, instance);
    }
    return instance;
  };
}(window.jQuery));
ui_loading_loading = undefined;
ui_loading_loading_ng = function () {
  /**
   * example:
   *
      <s-loading class="global"></s-loading>
   * */
  angular.module('$ui.loading', []).directive('sLoading', function () {
    function link($scope, $element, $attrs) {
      var loading;
      $scope.controller = loading = $($element).loading();
      if ([
          '1',
          'true'
        ].indexOf($attrs.autoShow) !== -1) {
        loading.show();
      }
    }
    return {
      scope: {
        controller: '=',
        autoShow: '@'
      },
      template: '<div class=\'ui loading\'></div>',
      replace: true,
      restric: 'E',
      link: link
    };
  });
}();
(function (factory) {
  if (true) {
    util_poll = function () {
      return typeof factory === 'function' ? factory() : factory;
    }();
  } else {
    var exports = window || this;
    exports.Poll = factory();
  }
}(function () {
  'use strict';
  var tasks = {}, config = {
      interval: 5000,
      delay: false  /** TODO: */
    }, create = function (task) {
      var deferred = $.Deferred(), wait = function () {
          task.action(deferred);
          return deferred.promise();
        }, runner = function () {
          return setTimeout(function () {
            $.when(wait()).done(function () {
              /** Already removed */
              if (void 0 === tasks[task.name]) {
                /** Force to clean the queue of tasks */
                destory(task.name);
                return;
              }
              delete task.delay;
              /** Update the task */
              create(task);
            }).fail(function () {
              destory(task.name);
            });
          }, task.interval);
        };
      /** Apply the default configuration */
      task = $.extend({}, config, task);
      task.name = task.name || 'Task$' + Math.random().toString(16).replace(/^0\./, '');
      tasks[task.name] = {
        deferred: deferred,
        value: true === task.delay ? runner : runner()
      };
      return task.name;
    }, destory = function (id) {
      if (id) {
        var instance = tasks[id];
        if (instance) {
          clearTimeout(instance.value);
          delete tasks[id];
        }
      } else
        tasks = {};
    };
  return {
    /**
     * Add a task and return the task id
     *
     * @param task 	Array/Object
     * */
    add: function (task) {
      var register = function (task) {
          return 'function' === typeof task.action && create(task);
        }, id, ids = [];
      if ($.isArray(task)) {
        for (var i = task.length; --i >= 0;) {
          id = register(task[i]);
          id && ids.push(id);
        }
      } else
        (id = register(task)) && ids.push(id);
      return ids;
    },
    /**
     * Start a task
     *
     * @param taskid 	String
     * */
    start: function (taskid) {
      var task = tasks[taskid];
      if (task && 'function' === typeof task.value) {
        return task.value = task.value();
      }
      return 0;
    },
    /**
     * Remove task
     *
     * @param [id] String, Without id will be remove all
     * */
    remove: destory
  };
}));
ui_progress_progress = function (poll) {
  var namespace = '$ui.progress', Progress = function (target, settings) {
      var self = this;
      this.$node = target;
      this.settings = settings;
      if (settings.template) {
        this.$node.html(settings.template);
      }
    };
  Progress.prototype = {
    start: function () {
      var settings = this.settings;
      this.set(0);
      this.runner && poll.remove(this.runner);
      this.runner = runner.call(this, settings);
      /** Fadein */
      this.$node.find(settings.selector4bar + ',' + settings.selector4icon).css({
        'opacity': 1,
        'visibility': 'visible',
        'display': ''
      });
      poll.start(this.runner);
      return this;
    },
    set: function (status) {
      this.status = status;
      this.settings.render.call(this, status);
      return this;
    },
    done: function () {
      var self = this, settings = this.settings;
      self.set(1);
      setTimeout(function () {
        self.$node.find(settings.selector4bar + ',' + settings.selector4icon).css({
          'opacity': 0,
          'visibility': 'hidden'
        });
        setTimeout(function () {
          self.set(0);
          self.$node.find(settings.selector4icon).css('display', 'none');
        }, 800);
      }, 400);
      poll.remove(self.runner);
      return this;
    },
    inc: function () {
      var status = this.status, settings = this.settings;
      status += Math.random() * settings.seed;
      status = status > settings.max ? settings.max : status;
      this.status = status;
      return this;
    },
    dec: function () {
      var status = this.status, settings = this.settings, value = Math.random() * settings.seed;
      status -= value;
      status = status < 0.02 ? value : status;
      this.status = status;
      return this;
    }
  };
  function runner(settings) {
    var self = this;
    return poll.add({
      action: function (deferred) {
        var status = +self.status || 0;
        status += Math.random() * settings.seed;
        status = status > settings.max ? settings.max : status;
        self.set(status);
        deferred.resolve();
      },
      delay: true,
      interval: settings.speed
    });
  }
  $.fn.progress = function (options) {
    var settings, instance = this.data(namespace);
    if (!instance) {
      settings = $.extend({}, $.fn.progress.defaults, options || {});
      settings.max = settings.max > 1 ? 0.99123 : settings.max;
      instance = new Progress(this, settings);
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.progress.defaults = {
    seed: 0.05,
    speed: 800,
    max: 0.99123,
    template: '<div class=\'bar\'><div></div></div><div class=\'spinner\'><div></div></div>',
    selector4bar: '.bar',
    selector4icon: '.spinner',
    render: function (status) {
      this.$node.find(this.settings.selector4bar).css({
        'width': status * 100 + '%',
        '-webkit-transition': 'all .2s ease-out',
        '-moz-transition': 'all .2s ease-out',
        '-ms-transition': 'all .2s ease-out',
        '-o-transition': 'all .2s ease-out',
        'transition': 'all .2s ease-out'
      });
    }
  };
}(util_poll);
ui_modal_modal = function () {
  $.fn.modal = function (options) {
    var template = [
        '<div class=\'ui modal animate\'>',
        '<div style=\'height: 100%;\'>',
        '<h3 class=\'title\'></h3><div class=\'icon close transition rotate\'></div>',
        '<div class=\'ui loading\'></div>',
        '<div class=\'ui progress\'></div>',
        '<div class=\'content\'></div>',
        '</div>',
        '</div>',
        '<div class=\'ui overlay\'></div>'
      ].join(''), modal = $(template), close = function () {
        $(document).off('keyup', closeByESC).off('click', closeByDocument);
        options.onClose();
        modal.removeClass('show');
        setTimeout(function () {
          modal.remove();
        }, 300);
      }, closeByESC = function (e) {
        27 === e.keyCode && close();
      }, closeByDocument = function (e) {
        $(e.target).hasClass('overlay') && close();
      }, loading = modal.find('.ui.loading:first').loading(), progress = modal.find('.ui.progress:first').progress(), deferred = $.Deferred(), show = function () {
        var head = modal.find('.title'), body = modal.find('.content'), overlay = modal.last();
        /** ~Head~ */
        options.showTitle ? head.html(options.title) : head.hide().next().hide();
        /** ~Body~ */
        if (options.content instanceof Function) {
          options.content.call(body, deferred, loading, close);
        } else {
          body.html(options.content);
          deferred.resolve();
        }
        modal.addClass([
          options.animation,
          options.class4modal || ''
        ].join(' '));
        /** Show the overlay */
        overlay.addClass(options.modal ? 'show' : 'blank');
        /** Close the modal */
        if (options.closeByESC || options.closeByDocument) {
          var trigger = $(document).add(modal);
          true === options.closeByDocument && modal.off('click', closeByDocument).on('click', closeByDocument);
          if ('boolean' === typeof options.closeByESC) {
            trigger.off('keyup', closeByESC).on('keyup', closeByESC);
          }
        }
        modal.delegate('.close', 'click', close);
        modal.first().css(options.css).attr(options.attr);
        setTimeout(function () {
          modal.first().addClass('show');
        }, 100);
        if (options.draggable) {
          var handle = options.draggable;
          head.css('cursor', 'move');
          modal.drag(function (ev, dd) {
            $(this).css({
              'width': modal.width(),
              'height': modal.height(),
              top: dd.offsetY,
              left: dd.offsetX,
              '-webkit-transform': 'none',
              '-moz-transform': 'none',
              '-ms-transform': 'none',
              'transform': 'none'
            });
          }, { handle: handle === true ? '.title' : handle });
        }
        modal.appendTo(document.body);
      };
    options = $.extend({}, $.fn.modal.defaults, options || {});
    if (this === $) {
      options.target ? $(options.target).on('click', show) : options.autoShow && show();  /** Use a dom as trigger */
    } else
      this.on('click', show);
    return {
      open: show,
      close: close,
      loading: loading,
      progress: progress,
      $node: modal
    };
  };
  $.fn.modal.defaults = {
    title: 'Modal.JS',
    showTitle: true,
    modal: true,
    draggable: true,
    css: { 'min-width': 480 },
    attr: {},
    class4modal: '',
    closeByESC: true,
    closeByDocument: false,
    animation: 'slide',
    content: '<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don\'t forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>',
    autoShow: true,
    onClose: $.noop
  };
  /** Export to $ */
  $.modal = $.fn.modal;
}();
ui_message_message = function () {
  var show = function (options) {
    var defaults = {
      showTitle: false,
      closeByDocument: true
    };
    setTimeout(function () {
      $.modal($.extend(true, {}, defaults, options));
    }, 250);
  };
  $.message = {
    message: function (type, message, delay) {
      var options = {
        content: function (ready, loading, close) {
          var template = [
            '<div class=\'ui message ',
            type,
            ' tooltip top\' data-tooltip=\'Close outside close the message\'>',
            '<div class=\'flag\'><i class=\'icon\'></i></div>',
            '<div class=\'content\'><p>',
            message,
            '</p></div>',
            '</div>'
          ];
          this.parent().css('overflow', 'visible');
          this.css({
            'overflow': 'visible',
            'display': 'table',
            'padding': 0
          }).html(template.join('')).parent().css('background', 'none');
          if (delay = +delay, delay > 100) {
            setTimeout(close, delay);
          }
          ready.resolve();
        }
      };
      show(options);
    },
    error: function (message, delay) {
      this.message('error', message, delay);
    },
    info: function (message, delay) {
      this.message('info', message, delay);
    },
    warn: function (message, delay) {
      this.message('warn', message, delay);
    },
    success: function (message, delay) {
      this.message('success', message, delay);
    },
    confirm: function (options) {
      var noop = function () {
        }, settings = $.extend({}, {
          onOk: noop,
          onClose: noop
        }, options || {});
      show({
        title: settings.title || 'Confirm',
        showTitle: true,
        class4modal: 'confirm',
        content: function (ready, loading, close) {
          this.html('<div style=\'margin-top: 10px\'>' + settings.message + '</div>' + '<div class=\'action\'>' + '<button class=\'ui transition button success\' name=\'ok\'>Ok</button>' + '<button class=\'ui transition button\' name=\'close\'>Cancel</button>' + '</div>').parents('.modal:first').css('max-width', 400);
          this.delegate('button[name=ok]', 'click', function (e) {
            var res = settings.onOk();
            if (res === undefined || res) {
              close();
            }
          }).delegate('button[name=close]', 'click', function (e) {
            settings.onClose();
            close();
          });
          ready.resolve();
        }
      });
    }
  };
}();
ui_message_message_ng = function (undefined) {
  angular.module('$ui.message', []).factory('$message', function () {
    return $.message;
  });
}(ui_message_message);
ui_modal_modal_ng = function (undefined) {
  angular.module('$ui.modal', []).factory('$modal', [
    '$rootScope',
    '$compile',
    function ($rootScope, $compile) {
      var defaults = {
          scope: undefined,
          template: undefined,
          templateUrl: undefined  /** Overwrite the jQuery plugin default settings */
        }, Modal = function (options) {
          var $modal, settings, html, waiting;
          if (!options.template && !options.templateUrl) {
            throw new Error('Expected modal to have exacly one of either \'template\' or \'templateUrl\'');
          }
          if (options.template) {
            html = options.template;
          } else {
            waiting = $.Deferred();
            html = function (deferred, loading, close) {
              var self = $(this);
              $.ajax({
                url: options.templateUrl,
                dataType: 'html'
              }).done(function (data) {
                self.html(data);
                deferred.resolve();
                waiting.resolve();
              });
            };
          }
          $.when(waiting).done(function () {
            $compile($modal.$node[0])(options.scope || $rootScope.$new());
            options.scope.$apply();
          });
          settings = angular.extend({}, defaults, options, {
            /** Overwite the jQuery plugin default settings */
            content: html,
            autoShow: true
          });
          $modal = $.modal(settings);
          return $modal;
        };
      return {
        open: function (options) {
          return Modal(options);
        }
      };
    }
  ]);
}(ui_modal_modal);
ui_pagination_pagination = function () {
  var namespace = '$ui.pagination', Pagination = function (target, settings) {
      var index = settings.index, total = settings.total;
      index = +index || 0;
      total = +total || index;
      /** Swap index and total */
      index > total && (index ^= total, total ^= index, index ^= total);
      settings.index = index;
      settings.total = total;
      this.$node = target;
      this.settings = settings;
      render(target, settings);
      target.delegate('[data-index]:not(.current)', 'click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        settings.index = +this.getAttribute('data-index');
        settings.onPageChange(settings.index, settings);
        render(target, settings);
      }).delegate(settings.selector4input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          $(this).next().trigger('click');
        }
      }).delegate(settings.selector4jump, 'click', function (e) {
        var input = $(this).prev(), value = +input.val();
        if (value >= 1 && value <= settings.total) {
          settings.index = value;
          settings.onPageChange(value, settings);
          render(target, settings);
        } else {
          input.select();
        }
      });
    };
  function render(target, settings) {
    var index = settings.index, total = settings.total, head = '', tail = '', page = [], content = target.find(settings.selector4content);
    if (total <= 7) {
      for (var i = 1; i <= total; page += ' ' + i++);
    } else {
      /** Need a head? */
      index - 3 > 2 && (head = '1 2 ...');
      /** Has tail? */
      index + 3 < total && (tail = '...');
      if (head) {
        total - index > 3 && page.push(index - 2, index - 1, index);
      } else
        for (var i = index < 3 ? 6 : index + 3; --i >= 1; page.unshift(i));
      if (tail) {
        index > 5 && page.push(index + 1, index + 2);
      } else
        for (var i = total - (3 === total - index ? 6 : 5); ++i <= total; page.push(i));
      page.unshift(head);
      page.push(tail);
    }
    /** Trim the blank item */
    page = ($.isArray(page) ? page : [page]).join(' ').replace(/^\s+|\s$/g, '').split(' ');
    for (var i = 0, length = page.length; i < length; ++i) {
      if (+page[i]) {
        page[i] = page[i] == index ? '<span class=current>' + index + '</span>' : '<a data-index=\'' + page[i] + '\'>' + page[i] + '</a>';
      } else
        page[i] = '<span class=\'normal\'>...</span>';
    }
    /** Show PREV */
    index > 1 && page.unshift($('<a class=\'icon prev\' data-index=\'' + (index - 1) + '\'></a>'));
    /** Show NEXT */
    index < total && page.push($('<a class=\'icon next\' data-index=\'' + (index + 1) + '\'></a>'));
    content.html(page);
    target.find(settings.selector4input).val(index);
  }
  Pagination.prototype = {
    val: function (value) {
      var settings = this.settings;
      if (!value) {
        return settings.index;
      } else {
        settings.index = value;
        render(this.$node, settings);
      }
      return this;
    }
  };
  $.fn.pagination = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Pagination(this, $.extend({}, $.fn.pagination.defaults, options));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.pagination.defaults = {
    index: 1,
    total: 1,
    onPageChange: $.noop,
    selector4content: '.content',
    selector4input: 'input:text',
    selector4jump: '[name=go]'
  };
}();
ui_pagination_pagination_ng = function () {
  /**
   * example:
   *
      <s-pagination index="index" max="20"></s-pagination>
   * */
  angular.module('$ui.pagination', []).directive('sPagination', [
    '$rootScope',
    function ($rootScope) {
      function link($scope, $element, $attrs) {
        var pagination = $($element).pagination({
          index: $scope.index,
          total: $scope.total,
          onPageChange: function (index, settings) {
            if (!$rootScope.$$pahse) {
              $scope.index = index;
              $scope.$apply();
              ($scope.onPageChange() || $.noop)(index, settings);
            }
          }
        });
        $scope.$watch('index', function (value) {
          pagination.val(value);
        });
        $scope.$watch('total', function (total) {
          pagination.settings.total = total;
          pagination.val(pagination.val());
        });
      }
      return {
        scope: {
          index: '=',
          total: '=',
          onPageChange: '&'
        },
        template: '<div class=\'ui pagination\'>' + '<div class=\'content\'></div>' + '<span class=\'normal\'>跳转至</span>' + '<input type=\'text\' maxleng=\'4\'>' + '<span name=\'go\'>GO</span>' + '</div>',
        replace: true,
        restric: 'EA',
        link: link
      };
    }
  ]);
}();
ui_progress_progress_ng = function () {
  /**
   * example:
   *
      <s-progress
          theme="ios"
          auto-start="true"
          controller="progress">
      </s-progress>
   * */
  angular.module('$ui.progress', []).directive('sProgress', function () {
    function link($scope, $element, $attrs) {
      var progress;
      /** Some function on the prototype don't extend it */
      $scope.controller = progress = $($element).progress();
      if ([
          'true',
          '1'
        ].indexOf($scope.autoStart) > -1) {
        progress.start();
      }
    }
    return {
      scope: {
        autoStart: '@',
        controller: '='
      },
      restric: 'E',
      replace: true,
      template: '<div class=\'ui progress\'></div>',
      link: link
    };
  });
}();
ui_rate_rate = function () {
  var namespace = '$ui.rate', Rate = function (target, settings) {
      var self = this, enabled = true, stars = target.find(settings.selector4star);
      target  /** Highlight */.on('mouseover', function (e) {
        var star = e.target;
        if (!enabled) {
          return;
        }
        stars.removeClass(settings.class4selected).find('i[style]').removeAttr('style');
        star = $(star);
        star.prevAll().add(star).addClass(settings.class4highlight);
        star.nextAll().removeClass(settings.class4highlight);
      }).on('mouseleave', function (e) {
        setTimeout(function () {
          if (!target.is(':hover')) {
            stars.removeClass(settings.class4highlight);
            self.val(self.val());
          }
        });
      })  /** Selected */.delegate(settings.selector4star, 'click', function (e) {
        var star = e.target, value;
        if (enabled) {
          value = stars.index(star) + 1;
          settings.onSelect.call(star, value);
          /** Hack the firefox event bubbles */
          self.disabled().val(value);
          setTimeout(self.enabled, 50);
        }
      });
      this.disabled = function () {
        enabled = 0;
        return this;
      };
      this.enabled = function () {
        enabled = true;
        return this;
      };
      this.$node = target;
      this.settings = settings;
      if (settings.defaultValue) {
        self.val(settings.defaultValue);
      }
    };
  Rate.prototype = {
    val: function (value) {
      var settings = this.settings;
      if (value) {
        var index = 0, stars = this.$node.find(settings.selector4star);
        this.$node.attr('data-value', value = +parseFloat(value).toFixed(1));
        index = Math.floor(value);
        /** Reset recent state */
        stars.removeClass(settings.class4selected).find('>i[style]').removeAttr('style');
        $(stars.splice(0, index)).addClass(settings.class4selected);
        if (index < 5) {
          stars.first().removeClass(settings.class4highlight).addClass(settings.class4selected).find('>i').css({ width: (value - index) * 100 + '%' });
        }
        return this;
      } else
        return +this.$node.attr('data-value') || 0;
    }
  };
  $.fn.rate = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      this.data(namespace, instance = new Rate(this, $.extend({}, $.fn.rate.defaults, options)));
    }
    return instance;
  };
  $.fn.rate.defaults = {
    onSelect: $.noop,
    selector4star: '>span',
    class4highlight: 'highlight',
    class4selected: 'selected',
    defaultValue: 0
  };
}();
ui_rate_rate_ng = function () {
  /**
   * example:
   *
      <s-rate
          ng-model="value"
          ng-disabled="false"
          on-click="onClick( value )">
      </s-rate>
   * */
  angular.module('$ui.rate', []).directive('sRate', function () {
    function link($scope, $element, $attrs) {
      var rate = $($element).rate({
        onSelect: function (value) {
          $scope.value = value;
          $scope.$apply();
          if ('function' === typeof $scope.onSelect) {
            $scope.onSelect.apply(this, arguments);
          }
        }
      });
      $scope.$watch('value', function (value) {
        rate.val(value);
      });
      $scope.$watch('disabled', function (value) {
        (value ? rate.disabled : rate.enabled)();
      });
    }
    return {
      scope: {
        value: '=ngModel',
        disabled: '=ngDisabled',
        onSelect: '&'
      },
      restric: 'E',
      replace: true,
      template: '<div class=\'ui rate\'>' + '<span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span>' + '</div>',
      link: link
    };
  });
}();
ui_ripple_ripple_ng = function (args) {
  /**
   * example:
   *
      <div class="block example"
          s-ripple
          duration="800"
          speed="800"
          random="true"
          color="color"
          controller="ripple"
          auto-bind="false">
      </div>
   * */
  angular.module('$ui.ripple', []).directive('sRipple', function () {
    function link($scope, $element, $attrs) {
      var options = args($scope, $attrs, {
          random: 'boolean',
          autoBind: 'boolean'
        }), ripple;
      $scope.controller = ripple = $($element).addClass('ui ripple').ripple(options);
      $scope.$watch('color', function (value) {
        ripple.hide();
        ripple.settings.color = value;
      });
      $scope.$watch('disabled', function (value) {
        (value ? ripple.disabled : ripple.enabled).call(ripple);
      });
    }
    return {
      scope: {
        controller: '=',
        disabled: '=ngDisabled',
        speed: '@',
        duration: '@',
        random: '@',
        autoBind: '@',
        color: '='
      },
      restric: 'A',
      link: link
    };
  });
}(util_ng_args);
ui_sidenav_sidenav = function () {
  var instance;
  function show(options) {
    return $.modal($.extend({}, $.extend({}, $.sidenav.defaults, options), {
      showTitle: false,
      animation: options.class4nav,
      class4modal: 'sidenav',
      closeByDocument: true,
      css: { 'height': '100%' }
    }));
  }
  $.sidenav = function (options) {
    instance && instance.close();
    return {
      right: function () {
        options.animation = 'right';
        return instance = show(options);
      },
      left: function () {
        options.animation = 'left';
        return instance = show(options);
      },
      close: function () {
        instance && instance.close();
      }
    };
  };
  $.sidenav.defaults = {
    /** Same to the modal component */
    content: '',
    onClose: $.noop,
    class4nav: ' '
  };
}();
ui_sidenav_sidenav_ng = function () {
  /**
   * example:
   *
      <s-sidenav id="profile" controller="profile">
          <ul>
              <li class="avatar">
                  <a href="//github.com/trayn" class="ui tooltip right" data-tooltip="View On GitHub">
                      <img src="/images/5271843.jpg" alt="fs3kuu">
                  </a>
              </li>
              <li>News</li>
              <li>Feeds</li>
              <li>Messages</li>
              <li>Friends</li>
              <li>Photos</li>
              <li>Music</li>
              <li class="exit">
                  <i class="icon exit"></i>
              </li>
          </ul>
      </s-sidenav>
   * */
  angular.module('$ui.sidenav', []).directive('sSidenav', [
    '$rootScope',
    '$compile',
    function ($rootScope, $compile) {
      function link($scope, $element, $attrs, undefined, link) {
        var sidenav, content = function (deferred, loading, close) {
            this.html($element);
            $compile(this.find('.ui.sidenav >*'))($scope);
            deferred.resolve();
          };
        if ($scope.templateUrl) {
          content = function (deferred, loading, close) {
            var self = this;
            $.ajax({
              url: templateUrl,
              dataType: 'html'
            }).done(function (data) {
              self.html(data);
              $compile(self)($scope);
              $scope.$apply();
            }).always(function () {
              deferred.resolve();
            });
          };
        } else {
          /** Detach from the document root */
          $element.detach();
        }
        sidenav = $.sidenav({
          content: content,
          onClose: $scope.onClose
        });
        $scope.instance = sidenav;
        $rootScope.$$phase || $scope.$apply();
      }
      return {
        scope: {
          instance: '=controller',
          templateUrl: '@',
          onClose: '&'
        },
        restric: 'E',
        transclude: true,
        replace: true,
        template: '<div class=\'ui sidenav\' ng-transclude></div>',
        link: link
      };
    }
  ]);
}();
(function ($, window) {
  var namespace = '$ui.lavalamp', Lavalamp = function (target, settings) {
      var current = target.find(settings.selector4current), indicator = $(settings.indicator).appendTo(target);
      function move(ele, animate) {
        var position, properties;
        if (ele.is('[disabled]')) {
          return;
        }
        position = ele.position(), properties = settings.properties(position, ele);
        (animate = animate === undefined ? true : animate) ? indicator.stop(true, false).animate(properties, settings.speed) : indicator.css(properties);
      }
      function hold(ele) {
        move(ele);
        current = $(ele);
      }
      this.$node = target;
      this.settings = settings;
      if (current.length === 0) {
        current = target.find(settings.selector4item).eq(0);
      }
      current.length && move(current, false);
      target.delegate(settings.selector4item, 'mouseover', function (e) {
        move($(this));
      }).delegate(settings.selector4item, 'mouseout', function (e) {
        move(current);
      }).delegate(settings.selector4item, 'click', function (e) {
        settings.holdByClick && hold(this);
      });
      this.move = move;
      this.hold = hold;
    };
  $.fn.lavalamp = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Lavalamp(this, $.extend({}, $.fn.lavalamp.defaults, options || {}));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.lavalamp.defaults = {
    selector4current: '.selected',
    selector4item: 'li:not(.indicator)',
    indicator: '<li class=\'indicator\'/>',
    speed: 222,
    holdByClick: true,
    properties: function (position, ele) {
      return {
        left: position.left + 'px',
        top: ele.innerHeight() + ele[0]['offsetTop'] + 'px',
        width: ele.innerWidth() + 'px',
        height: 0
      };
    }
  };
}(window.jQuery, window));
ui_lavalamp_lavalamp = undefined;
ui_tab_tab = function () {
  var namespace = '$ui.tab', Tab = function (target, settings) {
      var instance = this,
        /** Recent actived item */
        currentNav, currentTab;
      this.settings = settings;
      this.$node = target;
      this.$navs = target.find('> div.nav > .item');
      this.$tabs = target.find('> div.content > .item');
      /**
       * Set current tab
       * Priority:
       *  .selected > settings.selected > :first
       * */
      currentNav = this.$navs.filter('.selected:first');
      if (currentNav.length) {
        if (settings.selected !== undefined) {
          currentNav = this.$navs.filter('[' + settings.rule + '=' + settings.selected + ']');
        } else {
          currentNav = this.$navs.first();
        }
        currentNav.addClass('selected');
      }
      currentTab = this.$tabs.filter('[' + settings.rule + '=' + currentNav.attr(settings.rule) + ']').addClass('selected');
      this.$navs.not(currentNav).removeClass('selected');
      this.$tabs.not(currentTab).removeClass('selected');
      /** After the tab has rendered */
      setTimeout(function () {
        var options = {
          selector4item: '.item',
          indicator: '<div class=\'indicator\' />',
          holdByClick: false,
          animation: settings.duration
        };
        if (settings.lavalamp) {
          instance.lavalamp = target.find('> div.nav').lavalamp(options);
        }
      }, 300);
      if (settings.ripple) {
        this.$navs.each(function () {
          $(this).addClass('ui ripple').ripple(settings.ripple);
        });
      }
      target.delegate('.menu.ui.dropdown.icon', 'click', function (e) {
        var dropdown = $(this).dropdown({
            onSelect: function (item) {
              instance.active(item.value);
            }
          }), list = [], selected;
        instance.$navs.each(function () {
          var self = $(this), text = self.text().trim();
          list.push({
            text: text,
            value: self.attr('data-index'),
            disabled: self.is('[disabled]')
          });
          if (self.hasClass('selected')) {
            selected = list[list.length - 1];
          }
        });
        dropdown.render(list).val(selected).open();
      }).delegate('.nav > .item', 'click', function (e) {
        var self = $(this), tab,
          /** Show page after the ajax has been completed */
          startup, index = self.attr(settings.rule),
          /** Loaded page via ajax */
          page = self.attr('data-page'), dispatch = function () {
            var onSelect = settings.onSelect || {};
            if ('function' === typeof onSelect || typeof (onSelect = onSelect[index]) === 'function') {
              /** Wait angularjs digest(), use setTimeout() reduce the execution priority */
              setTimeout(function () {
                onSelect.call(self, tab, settings);
              });
            }
          }, finish = function () {
            if (tab.length) {
              tabs.length ? tabs.last().after(tab) : target.find('> div.content').append(tab);
              instance.$tabs = tabs = tabs.add(tab);
              instance.active(startup);
            }
          }, focus = function () {
            var scroller = self.parent(), offset = self.offset().left - scroller.width();
            scroller.scrollLeft(offset);
          },
          /** Shortcuts */
          navs = instance.$navs, tabs = instance.$tabs, class4success = settings.class4success, class4error = settings.class4error, class4loading = settings.class4loading;
        if (self.is('[disabled]') || self.hasClass('selected')) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return;
        }
        if (!self.hasClass('selected') && index !== undefined) {
          tab = tabs.filter('[' + settings.rule + '=' + index + ']:first');
          /** Has been loaded */
          if (tab.length) {
            /** Clear the queue */
            startup = undefined;
            currentNav && currentNav.removeClass('selected');
            currentNav = self.removeClass(class4success).addClass('selected');
            if (currentTab) {
              currentTab.removeClass('selected');
            }
            /** Set animation direction */
            if (currentTab.nextAll().index(tab) !== -1) {
              tab.removeClass('right').addClass('left');
            } else
              tab.removeClass('left').addClass('right');
            focus();
            currentTab = tab.addClass('selected');
            settings.lavalamp && instance.lavalamp && instance.lavalamp.hold(self);
            dispatch(index, tab, settings);
            return;
          }
          /** Lazy load */
          if (instance.render && instance.render[index]) {
            var render = instance.render[index];
            startup = index;
            delete instance['render']['index'];
            tab = $('<div class=\'item\' ' + settings.rule + '=\'' + index + '\'>').attr(settings.rule, index).html(typeof render === 'string' ? render : render.call(self, settings));
          }  /** Do Ajax call */ else if (page = page && page.replace(/^\s+|\s+$/g, ''), page) {
            if (self.hasClass(class4loading)) {
              startup = index;
            } else {
              $.ajax({
                url: page,
                dataType: 'html'
              }).done(function (responseText) {
                tab = $('<div class=\'item\'>').attr(settings.rule, index).html(responseText);
                self.removeClass(class4loading).addClass(class4success);
                finish();
              }).fail(function (xhr) {
                self.removeClass([
                  class4loading,
                  class4success
                ].join(' ')).addClass(class4error);
                tab = $('<div class=\'item error\'>').attr(settings.rule, index).html('<h5>Faild to load: </h5>\'' + page + '\'' + '<blockquote>' + xhr.statusText + '</blockquote>');
                finish();
              });
              startup = index;
              self.removeClass(class4error + ' ' + class4success).addClass(class4loading);
            }
          } else
            /** Invalid tab */
            self.removeClass([
              class4loading,
              class4success
            ].join(' ')).addClass(class4error);
          finish();
        }
      });
    };
  Tab.prototype = {
    add: function (items) {
      var navs = this.$navs, tabs = this.$tabs, settings = this.settings,
        /** Active the tab */
        actived;
      items = items instanceof Array ? items : [items];
      for (var i = 0, length = items.length; i < length; ++i) {
        var item = items[i];
        if (item.index && /** Duplicate */
          !navs.filter('[' + settings.rule + '=' + item.index + ']').length) {
          var nav = $([
            '<div class=\'item\' ',
            settings.rule,
            '=\'',
            item.index,
            '\'>',
            item.name || item.index,
            '</div>'
          ].join(''));
          item.page && nav.attr('data-page', item.page);
          if ('string function'.indexOf(typeof item.render) > -1) {
            if (item.immediate) {
              var tab, html = '', render = item.render;
              html = typeof render === 'string' ? render : render.call(nav, settings);
              tab = $('<div class=\'item\' ' + settings.rule + '=\'' + item.index + '\'>').html(html);
              tabs.length ? tabs.last().after(tab) : this.$node.find('> div.content').append(tab);
              tabs = this.$tabs = tabs.add(tab);
            } else {
              (this.render = this.render || {})[item.index] = item.render;
            }
          }  /** Render the content by an ajax call */ else if (item.page) {
            nav.attr('data-page', item.page);
          }
          /** Update index */
          if (!navs.length) {
            this.$node.find('> div.nav').append(nav);
          } else {
            navs.last().after(nav);
          }
          navs = this.$navs = navs.add(nav);
          /** Add ink ripple effect */
          settings.ripple && nav.ripple(settings.ripple);
          /** Set the default selected */
          if (settings.selected == item.index) {
            item.actived = true;
          }
          /** Set startup tab */
          actived = item.actived ? item.index : actived;
        }
      }
      actived && this.active(actived);
      return this;
    },
    remove: function (index) {
      var settings = this.settings, navs = this.$navs, tabs = this.$tabs, selector;
      selector = '[' + settings.rule + '=' + index + ']';
      if (index) {
        navs.add(tabs).filter(selector).remove();
        index = navs.index(navs.filter(selector));
        navs.splice(index, 1);
        /** Content can be lazy load, so they have different index value */
        index = tabs.index(tabs.filter(selector));
        tabs.splice(index, 1);
        this.render && delete this.render[index];
        this.active(navs.last().attr(settings.rule));
      }
      return this;
    },
    getTab: function (index) {
      var settings = this.settings;
      if (index) {
        return this.$tabs.filter('[' + settings.rule + '=' + index + ']');
      } else {
        return this.$tabs.filter('div.selected');
      }
    },
    active: function (index) {
      var nav, settings = this.settings;
      nav = this.$navs.filter('[' + settings.rule + '=\'' + index + '\']').trigger('click');
      return this;
    },
    isActive: function (index) {
      var settings = this.settings;
      return this.$navs.filter('[' + settings.rule + '=' + index + ']').is('.selected');
    },
    disabled: function (indexes) {
      var navs = this.$navs, settings = this.settings;
      if (indexes) {
        indexes = indexes instanceof Array ? indexes : [indexes];
        while (indexes.length) {
          navs.filter('[' + settings.rule + '=' + indexes.pop() + ']').attr('disabled', true);
        }
      } else {
        navs.attr('disabled', true);
      }
      return this;
    },
    enabled: function (indexes) {
      var navs = this.$navs, settings = this.settings;
      if (indexes) {
        var i, nav;
        indexes = indexes instanceof Array ? indexes : [indexes];
        while (indexes.length) {
          i = indexes.pop();
          nav = navs.filter('[' + settings.rule + '=' + i + ']');
          if (nav.is('[disabled]')) {
            nav.removeAttr('disabled');
            this.active(i);
          }
        }
      } else {
        navs.removeAttr('disabled');
      }
      return this;
    }
  };
  $.fn.tab = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Tab(this, $.extend({}, true, $.fn.tab.defaults, options || {}));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.tab.defaults = {
    rule: 'data-index',
    class4loading: 'sync',
    class4error: 'error',
    class4success: 'success',
    selected: 0,
    ripple: { duration: 800 },
    lavalamp: true
  };
}();
ui_tab_tab_ng = function (args) {
  /**
   * example:
   *
      <s-tab-set selected="selected" on-select="onSelect">
          <s-tab ng-repeat="tab in tabs" header="{{ tab.header }}" index="{{ tab.index }}" ng-disabled="tab.disabled" template-url="{{ tab.page }}">
              <div ng-bind-html="tab.content"></div>
          </s-tab>
      </s-tab-set>
   * */
  angular.module('$ui.tab', []).directive('sTabSet', [
    '$rootScope',
    '$parse',
    function ($rootScope, $parse) {
      function controller($scope, $element, $attrs) {
        var options = args($scope, $attrs, {
            'ripple': 'boolean',
            'lavalamp': 'boolean'
          }), instance = $($element).tab(angular.extend(options, {
            ripple: { duration: 1800 },
            onSelect: function (tab, settings) {
              var self = this;
              /** Change bound variable */
              if (!$rootScope.$$phase) {
                $scope.$apply(function (scope) {
                  selectedAccessor.assign($scope, self.attr(settings.rule));
                });
                'function' === typeof $scope.onSelect && $scope.onSelect().apply(instance, arguments);
              }
            }
          })), selectedAccessor = $parse($attrs.selected);
        $scope.$watch(selectedAccessor, function (value) {
          instance.active(value);
        });
        this['$tab'] = instance;
      }
      return {
        scope: {
          ripple: '@ripple',
          lavalamp: '@lavalamp',
          selected: '=selected',
          onSelect: '&'
        },
        restric: 'EA',
        transclude: true,
        replace: true,
        template: '<div class="ui tab" style="min-height: 300px;">' + '<div class="nav"></div>' + '<div class="content" ng-transclude></div>' + '<div class="menu ui dropdown icon left"><i class="icon more"></i><div class="content"/></div>' + '</div>',
        controller: controller
      };
    }
  ]).directive('sTab', [
    '$parse',
    function ($compile) {
      function link($scope, $element, $attrs, controller) {
        var $tab = controller['$tab'], item = {
            name: $scope.header,
            index: $scope.index,
            immediate: true
          };
        /** Load content via ajax request */
        if ($scope.templateUrl) {
          $element.empty();
          item.page = $scope.templateUrl;
        } else {
          item.render = function () {
            return $element[0]['childNodes'];
          };
        }
        $scope.$watch('disabled', function (value) {
          var index = $scope.index, isActive = $tab.isActive(index);
          if (!!value) {
            isActive && $tab.disabled(index);
          } else {
            isActive || $tab.enabled(index);
          }
          !!value ? $tab.disabled(index) : $tab.enabled(index);
        });
        $scope.$on('$destroy', function () {
          $tab.remove($scope.index);
        });
        $tab.add(item);
      }
      return {
        scope: {
          index: '@',
          header: '@',
          templateUrl: '@templateUrl',
          disabled: '=ngDisabled'
        },
        transclude: true,
        template: '<div style=\'display: none;\' ng-transclude></div>',
        replace: true,
        restric: 'EA',
        require: '^sTabSet',
        link: link
      };
    }
  ]);
}(util_ng_args);
ui_toast_toast = function () {
  var modal;
  function show(message, position, delay, class4toast) {
    if (void 0 === class4toast && typeof delay === 'string') {
      class4toast = delay;
      delay = false;
    }
    modal && modal.close();
    modal = $.modal({
      showTitle: false,
      modal: false,
      animation: 'scale',
      css: { 'min-width': '' },
      class4modal: 'ui toast ' + [
        position,
        class4toast || ''
      ].join(' '),
      content: function (ready, loading, close) {
        var template = '<p class=\'message\'>' + message + '</p>' + '<i class=\'icon close transition rotate\'></i>';
        this.html(template).parent().css('height', '').delegate('i.icon.close', 'click', close);
        setTimeout(close, delay || 3000);
      }
    });
    modal.$node.last().remove();
  }
  $.toast = {
    top: function (message, delay, class4toast) {
      return {
        left: function () {
          show(message, 'topleft', delay, class4toast);
        },
        right: function () {
          show(message, 'topright', delay, class4toast);
        }
      };
    },
    bottom: function (message, delay, class4toast) {
      return {
        left: function () {
          show(message, 'bottomleft', delay, class4toast);
        },
        right: function () {
          show(message, 'bottomright', delay, class4toast);
        }
      };
    }
  };
}();
ui_toast_toast_ng = function (undefined) {
  angular.module('$ui.toast', []).factory('$toast', function () {
    return $.toast;
  });
}(ui_toast_toast);
(function ($) {
  'use strict';
  var namespace = '$ui.tree', Tree = function (target, settings) {
      var selected, self = this, cache = [], inHandle = false, delay = settings.duration + 100;
      target.undelegate('li[data-level]', 'click').delegate('li[data-level]', 'click', function (e) {
        var self = $(this), hash = settings.hash;
        e.stopPropagation();
        e.preventDefault();
        if (!inHandle && !self.is('[disabled]')) {
          var level = +self.attr('data-level'), duration = settings.duration, operation = self.hasClass('open') ? function () {
              close(self, duration);
            } : function () {
              open(self, duration);
            };
          inHandle = 1;
          if (settings.closeSameLevel) {
            var recent = cache[level];
            cache[level] = self;
            recent && recent.get(0) !== this && close(recent);
          }
          if (!self.hasClass('node') || $(e.target).is('span')) {
            selected && selected.removeClass('selected');
            selected = self.addClass('selected');
            settings.onSelect({
              item: hash[self.attr('data-key')],
              level: level
            });
          } else {
            operation();
          }
          setTimeout(function () {
            /** Unlock operation */
            target.resize();
            inHandle = 0;
          }, delay);
        }
      });
      target.find(settings.selector4filter).on('keyup', function (e) {
        self.filter(this.value);
      });
      self.$node = target;
      self.settings = settings;
      self.render(settings.data);
    };
  Tree.prototype = {
    render: function (data) {
      var deferred, self = this, settings = this.settings;
      if (typeof data === 'function') {
        deferred = data();
      }
      $.when(deferred).done(function (result) {
        var node = $('<ul>');
        if (result instanceof Array) {
          data = result;
        }
        data = data && (data instanceof Array ? data : this);
        if (data) {
          settings.hash = {};
          /** Use '[].concat()' get data copy, used by text filter */
          settings.data = [].concat(data);
          renderTree(node, data, settings, true);
          self.$node.find(settings.selector4content).html(node.html());
        }
      });
      return this;
    },
    add: function (item) {
      var $node = this.$node, settings = this.settings, parentId = item[settings.parentKey], node = $node.find('[data-key=\'' + parentId + '\']');
      /** Add data memory */
      settings.data.push(item);
      /** After the angularjs $apply() */
      setTimeout(function () {
        /** Generate the dom */
        renderTree(node, item, settings, false);
        /** Add child to sington node */
        node.hasClass('node') || node.addClass('node close');
        /** Sington node */
        node.find('[data-key=\'' + item[settings.valueKey] + '\']').removeClass('node');
        /** Expand the parent */
        open(node, settings.duration);
      });
      return this;
    },
    remove: function (nodeid) {
      var settings = this.settings, index = settings.data.indexOf(settings.hash[nodeid]), node = this.$node.find('[data-key=\'' + nodeid + '\']'), parentNode = node.parents('.node:first');
      settings.data.splice(index, 1);
      delete this.settings.hash[nodeid];
      node.remove();
      if (!parentNode.find('[data-key]').length) {
        parentNode.removeClass('node open close');
      }
      return this;
    },
    toggle: function (nodeid) {
      var duration = this.settings.duration, node = this.$node.find('.node[data-key=\'' + nodeid + '\']');
      (node.hasClass('open') ? close : open)(node, duration);
      return this;
    },
    collapse: function (nodeid) {
      close(this.$node.find('.node[data-key=\'' + nodeid + '\']'), this.settings.duration);
      return this;
    },
    expand: function (nodeid) {
      open(this.$node.find('.node[data-key=\'' + nodeid + '\']'), this.settings.duration);
      return this;
    },
    disabled: function (nodeid) {
      var $node = this.$node, nodeid = nodeid instanceof Array ? nodeid : [nodeid];
      for (var i = 0, length = nodeid.length; i < length; ++i) {
        $node.find('.node[data-key=\'' + nodeid[i] + '\']').attr('disabled', 'disabled').find('li[data-key]').attr('disabled', 'disabled');
      }
      return this;
    },
    enabled: function (nodeid) {
      var $node = this.$node, nodeid = nodeid instanceof Array ? nodeid : [nodeid];
      for (var key = nodeid.pop(); key;) {
        $node.find('.node[data-key=\'' + key + '\']').removeAttr('disabled').find('li[data-key]').removeAttr('disabled');
      }
      return this;
    },
    filter: function (text) {
      var self = this, $node = self.$node, settings = self.settings;
      self.filter.timer && clearTimeout(self.filter.timer);
      self.filter.timer = setTimeout(function () {
        var matched,
          /** Prevent multiple reflow */
          node = $node.css('display', 'none'), lis = node.find('li[data-filter]').not('li[data-key][disabled]').css('display', '');
        /** Close all parent node */
        lis.filter('li.open').each(function () {
          close($(this));
        });
        if (text) {
          matched = lis.filter('[data-filter*=\'' + text.toLowerCase() + '\']');
          lis.not(matched).css('display', 'none');
          matched.each(function () {
            var self = $(this);
            if (!self.find('li[data-level][style!=\'display: none;\']').length) {
              /** Show the subitem */
              self.find('li[data-level]').css('display', '');
            }
            /** Expand the matched node */
            self.parents('li[data-filter]').each(function () {
              open($(this).show());
            });
          });
        }
        node.css('display', '');
      }, 500);
      return this;
    }
  };
  function close(target, duration) {
    var post = function () {
      $(this).css('display', '').parent().removeClass('open').addClass('close').css('display', '');
    };
    /** Close all the children */
    if (target.hasClass('open')) {
      if (duration) {
        target.find('ul[style=\'display: block;\']').each(function () {
          var self = $(this);
          if (!self.parent().is('[disabled]')) {
            self.slideToggle(duration, function () {
              post.call(this);
            });
          }
        });
      } else {
        /** Disable animate */
        target.find('ul[style=\'display: block;\']').each(function () {
          post.call(this);
        });
      }
    }
  }
  function open(target, duration) {
    if (target.hasClass('close')) {
      target.find('ul:first').slideToggle(duration || 0, function () {
        target.removeClass('close').addClass('open');
      });
    }
  }
  function renderTree(node, data, settings, recursion) {
    var html = '', hash = settings.hash, key = node.attr('data-key') || settings.rootIds, level = +node.attr('data-level') || 0, filter = settings.filter[level] || function () {
        return true;
      };
    data = data instanceof Array ? data : [data];
    key = key instanceof Array ? key : [key];
    for (var i = 0, length = data.length; i < length; ++i) {
      var item = data[i];
      hash[item[settings.valueKey]] = item;
      /** Match undefined */
      if (key[0] == (item[settings.parentKey] || '') || key.indexOf(item[settings.parentKey]) !== -1) {
        /** Remove this entry and fallback the step */
        --length;
        data.splice(i--, 1);
        if (filter(item)) {
          html += '<li class=\'node ' + (settings.collapsed ? 'close' : 'open') + '\' value=\'' + item[settings.valueKey] + '\' data-filter=\'' + item[settings.textKey]['toLowerCase']() + '\' data-level=' + (level + 1) + ' data-key=\'' + item[settings.valueKey] + '\'>' + settings.formatter(item, level + 1, settings) + '</li>';
        }
      }
    }
    if (html) {
      html = $('<ul>' + html + '</ul>');
      recursion && html.children('li[data-level]').each(function (item) {
        renderTree($(this), data, settings, hash, true);
      });
      node.append('<ul>' + html.html() + '</ul>');
    } else {
      node.removeClass('node open close');
    }
  }
  $.fn.tree = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Tree(this, $.extend({}, $.fn.tree.defaults, options || {}));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.tree.defaults = {
    rootIds: '',
    parentKey: 'parentId',
    textKey: 'text',
    valueKey: 'value',
    onSelect: $.noop,
    /** Start with collapsed menu( only level 1 items visible ) */
    collapsed: true,
    /** Close element on same level when open new node */
    closeSameLevel: false,
    /** Animation duration should be tweaked according to easing */
    duration: 150,
    selector4content: '.content',
    selector4filter: 'input[name=filter]',
    /** Local array or return a promise */
    data: undefined,
    filter: {},
    formatter: function (item, level, settings) {
      return '<p style=\'padding-left: ' + (level - 1) * 2 + 'em;\'><i class=\'icon\'></i><span>' + item[settings.textKey] + '</span></p>';
    }
  };
}(window.jQuery));
ui_tree_tree = undefined;
ui_tree_tree_ng = function (args) {
  /**
   * example:
   *
      <s-tree class="file" style="height: 430px; width: 320px;"
          data="files"
          ng-model="fileValue"
          filter-value="filterValue"
          close-same-level="true"
          controller="fileTree"
          root-ids="[ './' ]"
          parent-key="parent"
          text-key="name"
          value-key="id">
          <i class="icon {{ name.substr( name.lastIndexOf( '.' ) + 1 ) }}"></i><span>{{ name }}</span>
      </s-tree>
   * */
  angular.module('$ui.tree', []).directive('sTree', [
    '$rootScope',
    '$compile',
    function ($rootScope, $compile) {
      function link($scope, $element, $attrs, undefined, link) {
        var options = args($scope, $attrs, {
            'collapsed': 'boolean',
            'closeSameLevel': 'boolean',
            'showFilterBar': 'boolean'
          }), tree, filterBar, transclude, markup, html;
        transclude = link($scope);
        if (transclude.length) {
          markup = transclude.parent().html().trim();
          transclude.remove();
          if (markup) {
            options.formatter = function (item, level, settings) {
              var value = item[settings.valueKey], text = item[settings.textKey];
              html = $compile(markup)(angular.extend($scope.$parent.$new(), item));
              $rootScope.$$phase || $scope.$parent.$apply();
              html = angular.element('<p>').css('padding-left', (level - 1) * 2 + 'em').html(html);
              html = angular.element('<w>').html(html).html();
              return html;
            };
          }
        }
        options.onSelect = function (node) {
          if (!$rootScope.$$phase) {
            $scope.ngModel = node.item;
            ($scope.onSelect() || $.noop).apply(tree, arguments);
            $scope.$apply();
          }
        };
        filterBar = $element.find($.fn.tree.defaults.selector4filter);
        if (options.showFilterBar) {
          filterBar.attr('placeholder', options.placeholder);
        } else {
          filterBar.parent().remove();
        }
        tree = $($element).tree(options);
        /** Export instance to controller */
        $scope.controller = tree;
        $scope.$watch('data', function (value) {
          if (!$rootScope.$$phase) {
            tree.render(value);
            $scope.ngModel = void 0;
            $scope.$apply();
          }
        });
        $scope.$watch('rootIds', function (value) {
          if ($rootScope.$$phase) {
            return;
          }
          tree.render(tree.settings.data);
          $scope.ngModel = void 0;
          $scope.$apply();
        });
        $scope.$watch('filterValue', function (text) {
          tree.filter(text);
        });
      }
      return {
        scope: {
          rootIds: '=',
          parentKey: '@',
          textKey: '@',
          valueKey: '@',
          collapsed: '@',
          closeSameLevel: '@',
          placeholder: '@',
          showFilterBar: '@',
          data: '=',
          onSelect: '&',
          controller: '=',
          filterValue: '=',
          ngModel: '='
        },
        restric: 'E',
        transclude: true,
        replace: true,
        template: '<div class="ui tree">' + '<div class="icon">' + '<input type="text" class="ui text" name="filter" placeholder="Type to search..." value="">' + '</div>' + '<div class="content"></div>' + '</div>',
        link: link
      };
    }
  ]);
}(util_ng_args);
(function ($, undefined) {
  var namespace = '$ui.validation', Validation = function (container, settings) {
      var self = this;
      this.$node = container;
      this.settings = settings;
      container.delegate(':reset', 'click', function () {
        self.clean();
      });
    };
  function mouseenter(e) {
    var self = $(this), message = e.data.message, offset = self.offset(), tooltip;
    if (self.is('.tooltiped')) {
      return;
    }
    tooltip = $('<div class=\'ui validation message\'><p>' + message + '</p></div>').css({
      'position': 'absolute',
      'top': offset.top - 30,
      'left': offset.left
    }).appendTo(document.body);
    self.addClass('tooltiped').data('tooltip', tooltip);
    self.off('mouseleave', mouseleave).on('mouseleave', {
      target: self,
      tooltip: tooltip
    }, mouseleave);
    setTimeout(function () {
      tooltip.addClass('show');
    });
  }
  function mouseleave(e) {
    var tooltip = e.data.tooltip;
    tooltip.removeClass('show');
    setTimeout(function () {
      tooltip.remove();
    }, 300);
    e.data.target.removeClass('tooltiped');
  }
  function clean(target, settings) {
    target  /** Remove all events and classes */.removeClass(settings.class4error).off('mouseenter', mouseenter).off('mouseleave', mouseleave).removeClass('tooltiped').removeData('tooltip');
  }
  function change(e) {
    var instance = e.data.args.instance, settings = instance.settings, target = e.data.args.target, parameter = e.data.args.parameter, validator = e.data.args.validator;
    $.when(validator.call(settings.validators, target.val(), parameter, target, instance)).done(function () {
      var tooltip = target.data('tooltip');
      clean(target, settings);
      tooltip && tooltip.remove();
    });
  }
  Validation.prototype = {
    validate: function () {
      var self = this, settings = this.settings, deferreds = [], eles = this.$node.find(settings.selector), shims = settings.shims;
      function getMessage(target) {
        var messages = target.attr('messages'), matched = (messages || '').match(/(\w+\s*:\s*'[^']+')+/g) || [];
        messages = {};
        while (matched.length) {
          var expr = matched.pop().split(':');
          messages[expr[0].trim()] = expr[1].replace(/^\s*'|'\s*/g, '');
        }
        return messages;
      }
      function handle(target, validator, messages) {
        var deferred, result, parameter, message;
        if ('string' === typeof validator) {
          message = messages[validator];
          validator = settings.validators[validator];
        } else {
          var
            /** Use the first validator, ignore others */
            key = Object.keys(validator)[0], parameter = validator[key], validator = settings.validators[key], message = messages[key];
          if (!validator && parameter instanceof Function) {
            validator = parameter;
            parameter = void 0;
          }
        }
        message = message || settings.message;
        result = validator.call(settings.validators, target.val(), parameter, target, self);
        if (result === false) {
          deferred = $.Deferred();
          deferred.reject();
        } else {
          deferred = result;
        }
        target = settings.parseElement(target, settings);
        $.when(deferred).fail(function () {
          target.addClass(settings.class4error).off('mouseenter', mouseenter).on('mouseenter', { message: message }, mouseenter);
        }).done(function () {
          target.removeClass(settings.class4error).off('mouseenter', mouseenter).off('mouseleave', mouseleave);
        });
        deferreds.push(deferred);
        target.off('change', change).on('change', {
          args: {
            target: target,
            validator: validator,
            parameter: parameter,
            instance: self
          }
        }, change);
        return result;
      }
      if (shims instanceof Array && shims.length) {
        for (var i = shims.length; --i >= 0; handle(this.container.find(shim.selector), shims[i]['validator']));
      }
      for (var i = eles.length; --i >= 0;) {
        var ele = eles.eq(i), messages = getMessage(ele), validators = ele.attr('validators');
        try {
          with (settings.custom) {
            validators = eval(validators);
          }
        } catch (ex) {
          validators = [];
        }
        for (var m = 0, length = validators.length; m < length; ++m) {
          if (!handle(ele, validators[m], messages) && settings.breakOnError) {
            break;
          }
        }
      }
      return $.when.apply($, deferreds);
    },
    clean: function () {
      var settings = this.settings;
      this.$node.find(settings.selector).each(function () {
        clean(settings.parseElement($(this)), settings);
      });
      return this;
    }
  };
  $.fn.validation = function (options) {
    var instance = this.data(namespace);
    if (!instance) {
      instance = new Validation(this, $.extend(true, {}, $.fn.validation.defaults, options));
      this.data(namespace, instance);
    }
    return instance;
  };
  $.fn.validation.defaults = {
    class4error: 'error',
    selector: ':input[validators]:visible:not(button)',
    custom: {},
    message: 'Invalid input',
    breakOnError: true,
    parseElement: function (target) {
      var parent = target.parent();
      if (target.is('select, :checkbox, :radio') && parent.is('.ui.select, .ui.switch, .ui.radio')) {
        if (target.is(':radio') && parent.parent().is('.ui.radioes')) {
          return parent.parent();
        }
        return parent;
      } else if (target.is(':checkbox') && (parent = target.parents('.ui.checkboxes:first'), parent.length)) {
        return parent;
      }
      return target;
    },
    validators: $.extend({}, {
      /** Field is required */
      required: function (value, nothing, target, instance) {
        if (target.is(':checkbox')) {
          return target.is(':checked');
        } else if (target.is(':radio')) {
          var name = target.attr('name');
          return !!instance.$node.find(':radio[name=\'' + name + '\']:checked').length;
        }
        return /[^\s]+/.test(value);
      },
      /** Check if the value matches the comparison */
      equals: function (value, comparison) {
        return value === comparison;
      },
      /** Check if the value contains the seed */
      contains: function (value, seed) {
        return value && seed && value.indexOf(seed) > -1;
      },
      /** String start with a given startWith parameter */
      startWith: function (value, startWith) {
        return value && startWith && value.indexOf(startWith) === 0;
      },
      /** String end with a given endWith parameter */
      endWith: function (value, endWith) {
        return value && endWith && value.lastIndexOf(endWith) === value.length - endWith.length;
      },
      /** Is number under comparison parameter */
      min: function (value, comparison) {
        return value && comparison && +value.replace(/,/g, '') < comparison.toString().replace(/,/g, '');
      },
      /** Is number above comparison parameter */
      max: function (value, comparison) {
        return !this.min(value, comparison);
      },
      /** String length is less length */
      minLength: function (value, length, target, instance) {
        if (target.is(':checkbox')) {
          var name = target.attr('name');
          return instance.$node.find(':checkbox[name=\'' + name + '\']:checked').length > length;
        }
        return value && !isNaN(+length) && value.length > length;
      },
      /** String length is greater than length */
      maxLength: function () {
        return !this.minLength.apply(this, arguments);
      },
      /** Is a given date past? */
      past: function (value) {
        var now = new Date();
        return new Date(value) > +now;
      },
      /** Is a given date future? */
      future: function () {
        return !this.past.apply(this, arguments);
      },
      /** Check if the value is a date that's after the specified date(defaults to now) */
      after: function (value, comparison) {
        return +new Date(value) > new Date(comparison);
      },
      /** Value that's before the specified date */
      before: function () {
        !this.after.apply(this, arguments);
      }
    }, function () {
      var regexps = {
          int: /^(?:[-+]?(?:0|[1-9][0-9]*))$/,
          float: /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
          alpha: /^[A-Z]+$/i,
          numeric: /^[-+]?[0-9]+$/,
          hexadecimal: /^[0-9a-fA-F]+$/,
          alphaNumeric: /^[A-Za-z0-9]+$/,
          uppercase: /[A-Z]+/,
          lowercase: /[a-z]+/,
          email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
          phone: /^(\+?0?86\-?)?1[345789]\d{9}$/,
          url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
          zipCode: /^[1-9]d{5}$/,
          timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
          dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
          hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
          ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
        }, validators = {}, regexpCheck = function (key, regexp) {
          validators[key] = function (value) {
            return regexp.test(value);
          };
        };
      /** Create regexp checks methods from 'regexp' object */
      for (var key in regexps) {
        if (regexps.hasOwnProperty(key)) {
          regexpCheck(key, regexps[key]);
        }
      }
      return validators;
    }())
  };
}(window.jQuery));
ui_validation_validation = undefined;
ui_validation_validation_ng = function () {
  /**
   * example:
   *
      <s-validation class="ui form">
          <p class="row">
          <label>Name:</label>
          <input class="ui text" ng-model="info.name"
                                 validators="[ 'required', { unique: uniqueName }, { minLength: 6 }, { maxLength: 12 } ]"
                                 messages="[ { required: 'This field is required' }, { unique: 'This name has exists' } ]"
                                 placeholder="Please enter your name" />
          </p>
  
          <p class="row">
          <label>Age:</label>
          <label class="ui select">
              <select ng-model="info.age"
                      validators="[ 'required' ]" >
                      <option value="">Choose your age</option>
                      <option ng-repeat="i in [ 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 ]" value="{{ i }}">{{ i }}</option>
              </select>
          </label>
          </p>
  
          <p class="row">
          <label>Gender:</label>
          <span class="ui radioes">
              <input name="sex" class="ui radio" ng-model="info.sex" value="1" validators="[ 'required' ]" type="radio" /> Female
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;
              <input name="sex" class="ui radio" ng-model="info.sex" value="0" type="radio" /> Male
          </span>
          </p>
  
          <p class="row">
          <label>Email:</label>
          <input class="ui text" ng-model="info.email" validators="[ 'email' ]" placeholder="Yours email?" />
          </p>
  
          <p class="row">
          <label>Phone:</label>
          <input class="ui text" ng-model="info.phone" validators="[ 'phone' ]" placeholder="Phone number?" />
          </p>
  
          <p class="row">
          <label>Colors:</label>
          <span class="ui checkboxes">
               <label class="ui checkbox">
                   <input name="colors" type="checkbox" value="black" validators="[ { minLength: 1 } ]" />
                   <label>Black</label>
               </label>
  
               <label class="ui checkbox">
                   <input name="colors" type="checkbox" value="white" />
                   <label>White</label>
               </label>
  
               <label class="ui checkbox">
                   <input name="colors" type="checkbox" value="red" />
                   <label>Red</label>
               </label>
          </span>
          </p>
  
          <p class="row">
          <label>Seed feedback:</label>
          <label class="ui switch">
              <input type="checkbox" ng-model="info.feedback" value="Y" validators="[ 'required' ]" />
          </label>
          </p>
  
          <p>
          <input class="ui button transition" type="reset">
          <input class="ui button transition primary" type="submit" ng-click="push( info )" >
          </p>
  
      </s-validation>
   * */
  angular.module('$ui.validation', []).directive('sValidation', function () {
    function link($scope, $element, $attrs, undefined, transclude) {
      var selector4inputs = ':input[validators]:visible:not(:button)', eles, validation, custom = {};
      function parse(names, values) {
        values = values.slice(-names.length);
        for (var i = 0, length = values.length; i < length; ++i) {
          var value = values[i], key = 'object' === typeof value && Object.keys(value)[0], handler = key && value[key];
          if (typeof handler === 'function') {
            custom[names[i].replace(/^:\s*/, '')] = handler;
          }
        }
      }
      $element.html(transclude($scope));
      eles = $element.find(selector4inputs);
      for (var i = eles.length; --i >= 0;) {
        var validators = eles[i].getAttribute('validators');
        try {
          eval(validators);
        } catch (ex) {
          parse(validators.match(/:\s*(\w+)/g), $scope.$parent.$eval(validators));
        }
      }
      validation = $element.validation({
        selector: selector4inputs,
        message: $scope.message,
        custom: custom
      });
      $element.find('input:submit')  /** Validate the form */.on('click', function (e) {
        validation.validate().fail(function () {
          e.stopImmediatePropagation();
        });
        e.preventDefault();
      })  /** Change the click event priority */.each(function () {
        var handlers = $._data(this, 'events')['click'];
        handlers.splice(0, 0, handlers.pop());
      });
    }
    return {
      transclude: true,
      replace: true,
      scope: { message: '@' },
      template: '<form class=\'ui form validation\'></form>',
      link: link
    };
  });
}();
bundle = undefined;
}());