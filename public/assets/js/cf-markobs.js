
angular.module("cf-markobs", ['cf-templates'])
    // .factory("AuthService", AuthService)
    .controller("MarkObsTestController", MarkObsTestController)
    .directive("prettyCode", CodeHighlighterDirective)
;

MarkObsTestController.$inject = ["$window", "$scope", "$sce"];
function MarkObsTestController($window, $scope, $sce) {
    var moCtrl;
    moCtrl = this;
    moCtrl.debug = "If you can see this, then MarkObsTestController is working :-)";
    moCtrl.html = '';
    moCtrl.markob = {
        value: 1
    };

    $scope.previewCode = {
        html: '<h1>the previewCode</h1>'
    }

    $scope.$watch("moCtrl.markob", (function(updated, previous) {
        moCtrl.html = $sce.trustAsHtml(moCtrl.generateHtmlCode());
    }), true);

    this.changeVar = function(){
        moCtrl.markob.value = moCtrl.getRandomArbitrary(1, 100)
    }

    this.getRandomArbitrary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    this.generateHtmlCode = function(){
        var html = '<div>\n\t<h1>hello world '+moCtrl.markob.value+'</h1>\n</div>';

        return html;
    }

};

CodeHighlighterDirective.$inject = ["$interpolate", "$window"];
function CodeHighlighterDirective($interpolate, $window) {
    return {
        restrict: 'E',
        scope: true,
        compile: function (tElem, tAttrs) {
            var interpolateFn = $interpolate(tElem.html(), true);
            tElem.html(''); // disable automatic intepolation bindings
            return function (scope, elem, attrs) {
                scope.$watch(interpolateFn, function (value) {
                    var result = hljs.highlight('html', value);
                    elem.html( result.value );
                });
            }
        }
    };
}

angular.module('cf-templates', []);

