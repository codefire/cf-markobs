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
    moCtrl.markob = {};

    $scope.previewCode = {
        html: '<h1>the previewCode</h1>'
    }

    $scope.$watch("moCtrl.markob", (function (updated, previous) {
        moCtrl.html = $sce.trustAsHtml(moCtrl.generateHtmlCode());
    }), true);

    this.changeVar = function () {
        moCtrl.markob.value = moCtrl.getRandomArbitrary(1, 100)
    }

    this.getRandomArbitrary = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    this.generateHtmlCode = function () {


        var doc = document.createElement("div");

        if (typeof(moCtrl.markob) != 'undefined') {
            if (typeof(moCtrl.markob.items) != 'undefined') {
                for (var key in moCtrl.markob.items) {
                    if (moCtrl.markob.items.hasOwnProperty(key)) {
                        var item = moCtrl.markob.items[key];
                        var tag = this.processItem(item);
                        doc.appendChild(tag);
                    }
                }
            }
        }

        console.log('doc : ', doc);

        var currentNode,
            ni = document.createNodeIterator(doc, NodeFilter.SHOW_ELEMENT);

        var count = 0
        var html = '';
        while(currentNode = ni.nextNode()) {
            console.log(currentNode.nodeName);

            if(count > 0)
                html += this.tagToHtml( currentNode ) + '\n';

            count++;
        }

        return html;
    }

    this.processItem = function (item) {
        var tag = null;

        switch (item.type) {
            case 'heading':
                var tagName = 'h3';
                if (typeof(item.rank) != 'undefined' && item.rank >= 1 && item.rank <= 6)
                    tagName = 'h' + item.rank;

                tag = document.createElement(tagName);
                var newContent = document.createTextNode(item.content);
                tag.appendChild(newContent);
                break;
            case 'text':

                tag = document.createElement('p');
                var newContent = document.createTextNode(item.content);
                tag.appendChild(newContent);

                break;
            case 'list':

                if(item.flavour == 'ordered'){
                    tag = document.createElement('ol');
                }else{
                    tag = document.createElement('ul');
                }

                if(typeof(item.items) != 'undefined'){
                    for(var key in item.items){
                        if (item.items.hasOwnProperty(key)) {
                            tag.appendChild( this.processItem(item.items[key]) );
                        }
                    }
                }

                break;
            case 'list-item':

                tag = document.createElement('li');
                var newContent = document.createTextNode(item.content);
                tag.appendChild(newContent);

                break;
            case 'image':
                tag = document.createElement('image');
                break;
        }

        if(typeof(tag) != 'undefined' && tag != null){
            if (typeof(item.attributes) != 'undefined' && Object.keys(item.attributes).length > 0) {
                for (var key in item.attributes) {
                    if (item.attributes.hasOwnProperty(key)) {
                        tag.setAttribute(key, item.attributes[key]);
                    }
                }
            }
        }

        // console.log('tag [',typeof(tag),'] : ' , tag);

        return tag;
    }

    this.tagToHtml = function(tag, depth){

        var html = '';

        if(typeof(tag) == 'undefined' || tag == null)
            return html;

        var tmpParent = document.createElement("div");

        if(typeof(depth) == 'undefined' || depth == null)
            depth = 0;


        if(typeof(depth) != 'undefined' && depth > 0){
            for(var i = 0; i < depth; i++){
                html += '\t';
            }
        }

        if (typeof(tag) != 'undefined' && tag != null){
            tmpParent.appendChild(tag);
        }

        html += tmpParent.innerHTML;
        return html;

    }

    this.setContent = function (type) {

        switch (type) {
            case 'lorem':

                moCtrl.markob = {
                    meta: {},
                    items: [
                        {
                            type: 'heading',
                            rank: 1,
                            content: 'Lorem Ipsum',
                            attributes: {
                                class: 'heading'
                            }
                        },
                        {
                            type: 'text',
                            content: 'Quisque quis mollis tellus. Proin aliquam tellus vel nisl vestibulum pharetra. Ut aliquam turpis et tempor convallis. Donec ut enim in ligula efficitur faucibus in at massa. Suspendisse potenti. Aenean mattis arcu sit amet erat tempus'
                        },
                        {
                            type: 'list',
                            flavour: 'unordered',
                            items:[
                                {
                                    type: 'list-item',
                                    content: 'Sed eget suscipit sem'
                                },
                                {
                                    type: 'list-item',
                                    content: 'Etiam eleifend sodales porttitor'
                                },
                                {
                                    type: 'list-item',
                                    content: 'Pellentesque dictum porttitor nisl'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            content: 'Suspendisse et vestibulum ex. Integer lacinia erat sed magna commodo, eget fringilla ipsum tempus. Suspendisse potenti. Fusce aliquet ultrices interdum.'
                        },
                        {
                            type: 'image',
                            attributes:{
                                src: 'http://placehold.it/500x250',
                                alt: 'placeholder image',
                                class: 'th'
                            }
                        },
                        {
                            type: 'text',
                            content: 'Morbi rhoncus justo sed dolor luctus, eu ornare nunc sollicitudin. Praesent porttitor rhoncus massa, nec finibus nibh volutpat quis.'
                        },
                        {
                            type: 'heading',
                            rank: 2,
                            content: 'Morbi vulputate, ipsum et malesuada suscipit',
                            attributes: {
                                class: 'heading'
                            }
                        },
                        {
                            type: 'text',
                            content: 'Mauris rhoncus molestie ipsum, vitae blandit ante consequat egestas. Praesent nec nibh a velit pretium faucibus. Aenean aliquam vestibulum nibh, eget dapibus nunc maximus at. Donec auctor consequat ligula, eget imperdiet erat venenatis non. Maecenas rhoncus mi ex, et pretium erat malesuada ac. Aliquam sapien sapien, rhoncus id auctor sit amet, mollis vel justo. Integer posuere scelerisque arcu, ut mattis elit rutrum ut. In quis diam sapien.'
                        },
                    ]
                }

                break;
            default:

                moCtrl.markob = {}

                break;
        }

    }

    this.setContent('lorem');
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

                    if(attrs.class == 'html'){
                        value = html_beautify(value, {
                            'indent_inner_html': true,
                            'indent_size': 4,
                            'indent_char': ' ',
                            'wrap_line_length': 0,
                            'brace_style': 'expand',
                            'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u'],
                            'preserve_newlines': false,
                            'max_preserve_newlines': 2,
                            'indent_handlebars': false,
                            'extra_liners': ['/html']
                        });
                    }else if(attrs.class == 'json'){
                        value = js_beautify(value, {
                            'indent_size': 4,
                            'indent_char': ' ',
                            'preserve_newlines': true,
                            'max_preserve_newlines': 2
                        });
                    }

                    var result = hljs.highlightAuto(value);
                    var code = result.value;

                    console.log('attrs : ' , attrs);



                    elem.html(code);
                });
            }
        }
    };
}
