;(function() {
var ui_anchor_anchor, util_ng_afterRender, demo_modal_index, demo_tab_index, demo_message_index, demo_autoComplete_index, demo_toast_index, demo_getstarted_index, demo_tooltip_index, demo_sidenav_index, demo_dateutil_index, demo_tree_index, demo_rate_index, demo_progress_index, demo_calendar_index, demo_dropdown_index, demo_ripple_index, demo_checkbox_index, demo_switcher_index, demo_button_index, demo_radio_index, demo_loading_index, demo_pagination_index, demo_accordion_index, demo_validation_index, bootstrap;
(function ($) {
  var Anchor = function (target, settings) {
      var current, mappings = {};
      target.find(settings.selector4anchor + '[' + settings.symbol + ']').filter('.md-anchor [' + settings.symbol + ']').each(function () {
        var name = this.getAttribute(settings.symbol), self = $(this), content = target.find(settings.selector4content).filter('[' + settings.symbol + '=\'' + name + '\']');
        if (content.length) {
          if (!current) {
            current = self.addClass('active');
          }
          mappings[name] = {
            offsetTop: content.offset().top - content.height() + settings.offset,
            anchor: self
          };
        }
      });
      target.undelegate(settings.selector4delegate + '[' + settings.symbol + ']', 'click').delegate(settings.selector4delegate + '[' + settings.symbol + ']', 'click', function (e, args) {
        var self = $(this), name = this.getAttribute(settings.symbol), item = mappings[name];
        if (self.is('[data-forceAnchor]')) {
          var offset = +self.attr('data-forceAnchor'), dest = target.find(settings.selector4content).filter('[' + settings.symbol + '=' + name + ']');
          item.offsetTop = dest.offset().top + offset;
          self.removeAttr('data-forceAnchor');
        }
        if (item) {
          current.removeClass('active');
          current = item.anchor.addClass('active');
          args === undefined && $(target).animate({ 'scrollTop': item.offsetTop }, 400);
          e.stopPropagation();
          e.preventDefault();
        }
      });
      $(document).off('scroll', autoAnchor).on('scroll', {
        mappings: mappings,
        offset: settings.offset
      }, autoAnchor);
    }, timer;
  function autoAnchor(e) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var
        /** Shortcuts */
        mappings = e.data.mappings, offset = e.data.offset, containerOffsetTop = document.body.scrollTop, sort = [];
      for (var i in mappings) {
        var item = mappings[i];
        sort.push({
          offset: Math.abs(containerOffsetTop - item.offsetTop),
          item: item
        });
      }
      sort.sort(function (x, y) {
        if (x.offset > y.offset) {
          return 1;
        }
        if (x.offset === y.offset) {
          return 0;
        }
        return -1;
      });
      var destination = sort[0]['item']['anchor'];
      if (!destination.hasClass('active')) {
        e.stopPropagation();
        e.preventDefault();
        destination.trigger('click', { animate: false });
      }
    }, 400);
  }
  $.anchor = function (options) {
    new Anchor($('html, body'), $.extend({}, $.anchor.defaults, options || {}));
  };
  $.anchor.defaults = {
    symbol: 'data-anchor',
    offset: 0,
    selector4anchor: '#anchors li',
    selector4delegate: '#anchors li, a',
    selector4content: '#container header, #canvas h3, .md-ribbon'
  };
}(window.jQuery));
ui_anchor_anchor = undefined;
util_ng_afterRender = function () {
  angular.module('afterRender', []).directive('afterRender', [
    '$timeout',
    function ($timeout) {
      return {
        restric: 'A',
        terminal: true,
        link: function ($scope, $element, $attrs) {
          $timeout(function () {
            $scope.$eval($attrs.afterRender);
          }, 0);
        }
      };
    }
  ]);
}();
demo_modal_index = function () {
  angular.module('demo.modal', [
    '$ui.modal',
    '$ui.message'
  ]).controller('modalController', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
      $scope.name = 'test';
      $scope.open = function (animation) {
        return $modal.open({
          controller: 'modalController',
          animation: animation,
          templateUrl: 'src/demo/modal/page.html',
          title: 'Mango (Fruit)',
          class4modal: 'demo',
          scope: $scope
        });
      };
      $scope.showProgress = function () {
        var modal = $modal.open({
          controller: 'modalController',
          templateUrl: 'src/demo/modal/page1.html',
          title: '弹出框标题 18PX 加粗 #333',
          class4modal: 'demo',
          closeByDocument: true,
          scope: $scope
        });
        modal.progress.start();
        return modal;
      };
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
    }
  ]);
}();
demo_tab_index = function () {
  angular.module('demo.tab', ['$ui.tab']).controller('tabController', [
    '$scope',
    '$sce',
    function ($scope, $sce) {
      var last;
      $scope.selected = '2';
      $scope.tabs = [
        {
          header: 'One',
          index: '1',
          disabled: true,
          content: $sce.trustAsHtml('<img src=\'images/lorempixel-1.jpg\' alt=\'\'><blockquote>\'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.\' <br>\u2014 Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>')
        },
        {
          header: 'Two',
          index: '2',
          content: $sce.trustAsHtml('<img src=\'images/lorempixel-2.jpg\' alt=\'\'><blockquote>\'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.\' <br>\u2014 Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>')
        },
        {
          header: 'Three',
          index: '3',
          content: $sce.trustAsHtml('<img src=\'images/lorempixel.jpg\' alt=\'\'><blockquote>\'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.\' <br>\u2014 Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>')
        },
        {
          header: 'Ajax - 1',
          index: '4',
          page: 'src/demo/tab/tab4.html'
        },
        {
          header: 'Ajax - 2',
          index: '5',
          page: 'src/demo/tab/error.html'
        }
      ];
      last = $scope.tabs.length;
      $scope.addTab = function () {
        var index = ++last + '';
        $scope.tabs.push({
          header: 'Tab - ' + last,
          index: index,
          content: $sce.trustAsHtml('Tab: ' + index)
        });
      };
      $scope.removeTab = function () {
        var tabs = $scope.tabs, index;
        for (var i = tabs.length; --i >= 0;) {
          var tab = tabs[i];
          if (tab.index === $scope.selected) {
            index = i;
            break;
          }
        }
        tabs.splice(index, 1);
      };
      $scope.toggleTabState = function () {
        var tabs = $scope.tabs, index;
        for (var i = tabs.length; --i >= 0;) {
          var tab = tabs[i];
          if (tab.index === $scope.selected) {
            index = i;
            break;
          }
        }
        tabs[index]['disabled'] = !tabs[index]['disabled'];
      };
      $scope.onSelect = function () {
        console.log($scope.selected);
      };
      $scope.init = function () {
        $.anchor({ offset: 190 });
      };
    }
  ]);
}();
demo_message_index = function () {
  angular.module('demo.message', ['$ui.message']).controller('messageController', [
    '$scope',
    '$message',
    function ($scope, $message) {
      $scope.init = function () {
        $.anchor({ offset: -15 });
      };
      angular.extend($scope, {
        showSuccess: function () {
          $message.success('This is a message telling you that everything is a-okay');
        },
        showDanger: function () {
          $message.danger('This is a notification that something is wrong...');
        },
        showInfo: function () {
          $message.info('This is an \'information message\' div.');
        },
        showWarning: function () {
          $message.warning('It warns the users that to expect some changes or limitations.');
        },
        showConfirm: function () {
          $message.confirm({
            title: 'Please confirm',
            message: 'Exported successfully. Do you want to open the export query page?',
            onOk: function () {
              window.open('//www.google.com', '_blank');
            }
          });
        },
        showBubble: function () {
          $.message.bubble('Thank You~', 3000);
        }
      });
    }
  ]);
}();
demo_autoComplete_index = function () {
  angular.module('demo.autoComplete', ['$ui.autoComplete']).controller('autoCompleteController', [
    '$scope',
    function ($scope) {
      /** AutoComplete options */
      angular.extend($scope, {
        isDisabled: false,
        localMatch: '^',
        tabComplete: true,
        highlight: true,
        fuzzy: true
      });
      $scope.data = [
        {
          value: 'AD',
          text: 'Andorra'
        },
        {
          value: 'AZ',
          text: 'Azerbaijan'
        },
        {
          value: 'AW',
          text: 'Aruba'
        },
        {
          value: 'BI',
          text: 'Bulgaria'
        },
        {
          value: 'BS',
          text: 'Bahamas'
        },
        {
          value: 'CH',
          text: 'Switzerland'
        },
        {
          value: 'CK',
          text: 'Cook Island'
        },
        {
          value: 'CL',
          text: 'Chile'
        },
        {
          value: 'CN',
          text: 'China'
        },
        {
          value: 'CM',
          text: 'Cambodia'
        },
        {
          value: 'AE',
          text: 'United Arab Emirates'
        },
        {
          value: 'AF',
          text: 'Afghanistan'
        },
        {
          value: 'AG',
          text: 'Antigua and Barbuda'
        },
        {
          value: 'AO',
          text: 'Angola'
        }
      ];
      $scope.address = [
        {
          value: 'AG',
          text: 'Antigua and Barbuda'
        },
        {
          value: 'AO',
          text: 'Angola'
        }
      ];
      /** Ajax example */
      $scope.ajax = {
        dataProxy: function (key) {
          return $.ajax({ url: 'https://api.github.com/search/repositories?q=' + key + '&sort=stars&order=desc' });
        },
        enterforce: true,
        dataFilter: function (data) {
          return data.items || [];
        }
      };
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
    }
  ]);
}();
demo_toast_index = function () {
  angular.module('demo.toast', ['$ui.toast']).controller('toastController', [
    '$scope',
    '$toast',
    function ($scope, $toast) {
      $scope.init = function () {
        $.anchor({ offset: -10 });
      };
      $scope.theme = 'md-toast-default';
      $scope.changeTheme = function (theme) {
        $scope.theme = 'md-toast-' + theme;
      };
      angular.extend($scope, {
        topLeft: function () {
          $toast.top('On the top left!', $scope.theme).left();
        },
        topRight: function () {
          $toast.top('On the top left!', $scope.theme).right();
        },
        bottomLeft: function () {
          $toast.bottom('On the bottom left!', $scope.theme).left();
        },
        bottomRight: function () {
          $toast.bottom('On the bottom right!', $scope.theme).right();
        }
      });
    }
  ]);
}();
demo_getstarted_index = function () {
  angular.module('demo.getstarted', []).controller('getstartedController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -20 });
      };
    }
  ]);
}();
demo_tooltip_index = function () {
  angular.module('demo.tooltip', []).controller('tooltipController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: 0 });
      };
    }
  ]);
}();
demo_sidenav_index = function () {
  angular.module('demo.sidenav', ['$ui.sidenav']).controller('sidenavController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      $scope.showProfile = function (sidenav) {
        sidenav.left().$node.delegate('.exit', 'click', function () {
          sidenav.close();
        });
      };
    }
  ]);
}();
demo_dateutil_index = function () {
  angular.module('demo.dateutil', []).controller('dateutilController', [
    '$scope',
    function ($scope) {
      var now = new Date(), justAgo = new Date(now - 50 * 1000), minuteAgo = new Date(now - 200 * 1000), hourAgo = new Date(now - 3600 * 1000), yesterday = $.dateutil().val(now).yesterday(), morethan = $.dateutil(now).day(-31);
      $scope.init = function () {
        $.anchor({ offset: -10 });
      };
      angular.extend($scope, {
        now: now,
        now2: $.dateutil(now).format('%Y - %m - %d'),
        now3: $.dateutil(now).format('%B %A, %Y'),
        now4: $.dateutil(now).format('%x %X'),
        justAgo: justAgo,
        justAgo2: $.dateutil(justAgo).nice(),
        minuteAgo: minuteAgo,
        minuteAgo2: $.dateutil(minuteAgo).nice(),
        hourAgo: hourAgo,
        hourAgo2: $.dateutil(hourAgo).nice(),
        yesterday: yesterday.val(),
        yesterday2: yesterday.nice(),
        morethan: morethan.val(),
        morethan2: morethan.nice()
      });
    }
  ]);
}();
demo_tree_index = function () {
  angular.module('demo.tree', ['$ui.tree']).controller('treeController', [
    '$scope',
    function ($scope) {
      var deferred = $.Deferred();
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      $scope.test = function () {
        $.ajax({
          url: 'src/demo/tree/color.json',
          dataType: 'text'
        }).done(function (data) {
          deferred.resolveWith(eval('(' + data + ')'));
        });
        return deferred.promise();
      };
      /** Custom */
      $scope.files = function () {
        return $.ajax({ url: 'src/demo/tree/files.json' });
      };
      $scope.addBranch = function (tree, parentId) {
        var settings = tree.settings, item = {};
        item[settings.parentKey] = parentId;
        item[settings.valueKey] = +new Date();
        item[settings.textKey] = 'New Branch';
        tree.add(item);
      };
      $scope.afterInit = function (tree) {
        $.when(deferred).done(function () {
          tree.expand('multicolor').expand('white').expand('green').disabled('green');
        });
      };
    }
  ]);
}();
demo_rate_index = function () {
  angular.module('demo.rate', ['$ui.rate']).controller('rateController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      $scope.heart = 2.3;
    }
  ]);
}();
demo_progress_index = function () {
  angular.module('demo.progress', ['$ui.progress']).controller('progressContorller', [
    '$scope',
    function ($scope) {
      $scope.stop = function () {
        $scope.progress.done();
      };
    }
  ]);
}();
demo_calendar_index = function () {
  angular.module('demo.calendar', ['$ui.calendar']).controller('calendarController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      var now = new Date();
      angular.extend($scope, {
        date: $.dateutil(now).tomorrow().format(),
        double: true,
        isDisabled: false,
        minDate: $.dateutil(now).month(-1).format('%m/%d, %Y'),
        maxDate: $.dateutil(now).month(1).format('%m/%d, %Y'),
        onSelected: function (value) {
          console.log(value);
        }
      });
    }
  ]);
}();
demo_dropdown_index = function () {
  angular.module('demo.dropdown', ['$ui.dropdown']).controller('dropdownController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      $scope.data = [
        {
          value: 'AD',
          text: 'Andorra'
        },
        {
          value: 'AZ',
          text: 'Azerbaijan'
        },
        {
          value: 'AW',
          text: 'Aruba'
        },
        {
          value: 'BI',
          text: 'Bulgaria'
        },
        {
          value: 'BS',
          text: 'Bahamas'
        },
        {
          value: 'CH',
          text: 'Switzerland'
        },
        {
          value: 'CK',
          text: 'Cook Island'
        },
        {
          value: 'CL',
          text: 'Chile'
        },
        {
          value: 'CN',
          text: 'China'
        },
        {
          value: 'CM',
          text: 'Cambodia'
        },
        {
          value: 'AE',
          text: 'United Arab Emirates'
        },
        {
          value: 'AF',
          text: 'Afghanistan'
        },
        {
          value: 'AG',
          text: 'Antigua and Barbuda'
        },
        {
          value: 'AO',
          text: 'Angola'
        }
      ];
      $('.md-dropdown.md-icon').each(function () {
        $(this).dropdown({ data: $scope.data });
      });
      angular.extend($scope, {
        ajax: function () {
          var deferred = $.Deferred();
          $.ajax({
            url: 'src/demo/dropdown/result.json',
            dataType: 'json'
          }).done(function (data) {
            data = data.items;
            deferred.resolveWith(data);
          }).fail(deferred.reject);
          return deferred;
        },
        required: true,
        multiple: true
      });
    }
  ]);
}();
demo_ripple_index = function () {
  angular.module('demo.ripple', ['$ui.ripple']).controller('rippleController', [
    '$scope',
    function ($scope) {
      var colors = {
        grape: '#ED5565',
        bittersweet: '#FC6E51',
        sunflower: '#FFCE54',
        grass: '#A0D468',
        mint: '#48CFAD',
        auqa: '#4FC1E9',
        blueJeans: '#5D9CEC',
        lavender: '#AC92EC',
        pinkRose: '#EC87C0',
        lightGray: '#F5F7FA',
        mediumGray: '#CCD1D9',
        darkGray: '#656D78',
        success: '#0f9d58',
        error: '#f44336',
        info: '#039be5',
        warn: '#ff5722'
      };
      $scope.changeColor = function (name) {
        var color = colors[$scope.theme = name];
        if ($scope.color === color) {
          $scope.color = $scope.theme = void color;
        } else
          $scope.color = color;
      };
    }
  ]);
}();
demo_checkbox_index = function () {
  angular.module('demo.checkbox', []).controller('checkboxController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor();
      };
    }
  ]);
}();
demo_switcher_index = function () {
  angular.module('demo.switcher', []).controller('switcherController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor();
      };
    }
  ]);
}();
demo_button_index = function () {
  angular.module('demo.button', []).controller('buttonController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -30 });
      };
    }
  ]);
}();
demo_radio_index = function () {
  angular.module('demo.radio', []).controller('radioController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor();
      };
    }
  ]);
}();
demo_loading_index = function () {
  angular.module('demo.loading', ['$ui.loading']).controller('loadingController', [
    '$scope',
    function ($scope) {
    }
  ]);
}();
demo_pagination_index = function () {
  angular.module('demo.pagination', ['$ui.pagination']).controller('paginationController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: -60 });
      };
      $scope.index = 7;
      $('.md-pagination:last').pagination({
        total: 20,
        index: 1
      });
    }
  ]);
}();
demo_accordion_index = function () {
  angular.module('demo.accordion', ['$ui.accordion']).controller('accordionController', [
    '$scope',
    function ($scope) {
      $scope.init = function () {
        $.anchor({ offset: 270 });
      };
      $scope.multiple = true;
      $scope.onExpand = function (index) {
        console.log('Expand: ' + index);
      };
      $scope.onCollapse = function (index) {
        console.log('Collapse: ' + index);
      };
      $scope.isOpen = true;
      $scope.panes = [
        {
          head: 'Pane 1',
          content: 'Pane - 1'
        },
        {
          head: 'Pane 2',
          content: 'Pane - 2'
        }
      ];
      $scope.addPane = function () {
        var index = +new Date();
        $scope.panes.push({
          head: 'Pane ' + index,
          content: 'Pane - ' + index
        });
      };
      $scope.removePane = function () {
        $scope.panes.splice(-1);
      };
    }
  ]);
}();
demo_validation_index = function () {
  angular.module('demo.validation', ['$ui.validation']).controller('validationController', [
    '$scope',
    function ($scope) {
      $scope.push = function (info) {
        console.log(info);
      };
      $scope.uniqueName = function (name) {
        return name !== 'abc';
      };
      $scope.init = function () {
        $.anchor({ offset: 310 });
      };
    }
  ]);
}();
require.config({
  baseUrl: 'src',
  paths: {
    ui: '../src/components',
    util: '../src/util',
    modules: '../src/modules'
  }
});
(function () {
  var app = angular.module('neoui', [
    'ngRoute',
    'afterRender',
    '$ui.sidenav',
    'demo.modal',
    'demo.tab',
    'demo.message',
    'demo.autoComplete',
    'demo.validation',
    'demo.toast',
    'demo.getstarted',
    'demo.tooltip',
    'demo.sidenav',
    'demo.dateutil',
    'demo.tree',
    'demo.checkbox',
    'demo.switcher',
    'demo.radio',
    'demo.rate',
    'demo.dropdown',
    'demo.ripple',
    'demo.button',
    'demo.loading',
    'demo.pagination',
    'demo.accordion',
    'demo.progress',
    'demo.calendar'
  ]).config([
    '$httpProvider',
    function ($httpProvider) {
      var progress;
      setTimeout(function () {
        progress = $('.md-progress:first').progress();
        $httpProvider.defaults.transformResponse.push(function (data, headers) {
          setTimeout(function () {
            progress.done();
          }, 1000);
          return data;
        });
        $httpProvider.defaults.transformRequest.push(function (data, headers) {
          progress.start();
          return data;
        });
      });
    }
  ]).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/home', { templateUrl: 'src/demo/home/index.html' }).when('/color', { templateUrl: 'src/demo/color/index.html' }).when('/getstarted', { templateUrl: 'src/demo/getstarted/index.html' }).when('/tooltip', { templateUrl: 'src/demo/tooltip/index.html' }).when('/modal', { templateUrl: 'src/demo/modal/index.html' }).when('/tab', { templateUrl: 'src/demo/tab/index.html' }).when('/message', { templateUrl: 'src/demo/message/index.html' }).when('/autoComplete', { templateUrl: 'src/demo/autoComplete/index.html' }).when('/validation', { templateUrl: 'src/demo/validation/index.html' }).when('/toast', { templateUrl: 'src/demo/toast/index.html' }).when('/tree', { templateUrl: 'src/demo/tree/index.html' }).when('/loading', { templateUrl: 'src/demo/loading/index.html' }).when('/sidenav', { templateUrl: 'src/demo/sidenav/index.html' }).when('/dateutil', { templateUrl: 'src/demo/dateutil/index.html' }).when('/editor', { templateUrl: 'src/demo/editor/index.html' }).when('/calendar', { templateUrl: 'src/demo/calendar/index.html' }).when('/rate', { templateUrl: 'src/demo/rate/index.html' }).when('/ripple', { templateUrl: 'src/demo/ripple/index.html' }).when('/progress', { templateUrl: 'src/demo/progress/index.html' }).when('/button', { templateUrl: 'src/demo/button/index.html' }).when('/checkbox', { templateUrl: 'src/demo/checkbox/index.html' }).when('/switcher', { templateUrl: 'src/demo/switcher/index.html' }).when('/radio', { templateUrl: 'src/demo/radio/index.html' }).when('/dropdown', { templateUrl: 'src/demo/dropdown/index.html' }).when('/accordion', { templateUrl: 'src/demo/accordion/index.html' }).when('/pagination', { templateUrl: 'src/demo/pagination/index.html' }).otherwise({ redirectTo: '/home' });
    }
  ]).controller('mainController', [
    '$scope',
    '$location',
    function ($scope, $location) {
      $scope.openMenu = function (menu) {
        $scope.title = location.hash.split('/')[1];
        setTimeout(function () {
          menu.left().$node.delegate('[data-url]', 'click', function (e) {
            $location.path('/' + this.getAttribute('data-url'));
            $scope.$apply();
            setTimeout(function () {
              menu.close();
              $('html, body').scrollTop(0);
            }, 500);
          });
        }, 500);
      };
    }
  ]);
  $(function () {
    setTimeout(function () {
      $('.md-loading:first').loading().hide();
    }, 1000);
  });
  angular.bootstrap(document, ['neoui']);
}());
bootstrap = undefined;
}());