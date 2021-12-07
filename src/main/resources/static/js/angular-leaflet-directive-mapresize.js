/**!
 * The MIT License
 *
 * Copyright (c) 2013 the angular-leaflet-directive Team, http://tombatossals.github.io/angular-leaflet-directive
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @see angular-leaflet-directive https://github.com/tombatossals/angular-leaflet-directive
 * angular-leaflet-directive-mapresize
 * https://github.com/TKeePeR/angular-leaflet-directive-mapresize
 *
 * @authors https://github.com/TKeePeR/angular-leaflet-directive-mapresize/graphs/contributors
 */

/*! angular-leaflet-directive-mapresize 03-03-2015 */

(function() {

    "use strict";

angular.module("leaflet-directive").directive('dragmap', function ($compile, $document,$timeout) {
    return {
        restrict: "A"
        ,replace: false
        ,require: 'leaflet'

        ,link: function(scope, element, attrs, controller) {
            var lastY = 0,
                content = angular.element('<div style="width:100%; height:5px; background-color: #888;cursor: row-resize; "></div>');
            console.log("dragmap.Init", controller, controller.getMap);
            content.insertAfter(element);
            content.on('mousedown', function(event) {
                event.preventDefault();
                lastY = event.screenY;
                $document.on('mouseup', content.mouseUp);
                $document.on('mousemove', content.mouseMove);
            });

            content.mouseUp = function(event) {
                event.preventDefault();
                controller.getMap().then(function(map) {
                    map.invalidateSize();
                });
                $document.off('mouseup', content.mouseUp);
                $document.off('mousemove', content.mouseMove);
            };
            content.mouseMove = function(event) {
                element.height(element.height()+(event.screenY - lastY));
                lastY = event.screenY;
                controller.getMap().then(function(map) {
                    map.invalidateSize();
                });
            };
            content.resize=function()
            {
                setTimeout(function(){
                         content.resize();
                    controller.getMap().then(function(map) {
                        map.invalidateSize();
                    });
                },1000);
            };
             content.resize();
            /*$timeout(function(){
                console.log(11111111111111111111);
            },1000);*/
            $compile(content)(scope);
        }
    }
});

})();