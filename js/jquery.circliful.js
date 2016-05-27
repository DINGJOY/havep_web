"use strict";

(function ($) {

    $.fn.circliful = function (options, callback) {

        var settings = $.extend({
            // These are the defaults.
            //startDegree: 0,
            foregroundColor: "#3498DB",
            backgroundColor: "orange",
            backColor: "orange",
            pointColor: "none",
            fillColor: 'none',
            foregroundBorderWidth: 0,
            backgroundBorderWidth: 15,
            pointSize: 50,
            fontColor: '#39B54A',
            percent: 10,
            animation: 1,
            animationStep: 20,
            icon: 'none',
            // iconSize: '20',
            // iconColor: 'red',
            // iconPosition: 'bottom',
            target: 0,
            start: 0,
            showPercent: 1,
            percentageTextSize: 22,
            textAdditionalCss: '',
            targetPercent: 0,
            targetTextSize: 17,
            targetColor: '#2980B9',
            text: null,
            textStyle: null,
            textColor: '#2980B9',
            multiPercentage: 0,
            percentages: null
        }, options);

        return this.each(function () {
            var circleContainer = $(this);
            var percent = settings.percent;
            var iconY = 83;
            var iconX = 100;
            var textY = 0;
            var textX = 230;
            var additionalCss;
            var elements;
            var icon;
            var backgroundBorderWidth = settings.backgroundBorderWidth;

            if(settings.iconPosition == 'bottom') {
                iconY = 124;
                textY = 95;
            } else if(settings.iconPosition == 'left') {
                iconX = 80;
                iconY = 110;
                textX = 117;
            } else if(settings.iconPosition == 'middle') {
                if(settings.multiPercentage == 1) {console.log(typeof settings.percentages == "object")
                    if(typeof settings.percentages == "object") {
                        backgroundBorderWidth = 30;
                    } else {
                        iconY = 110;
                        elements = '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="133" y1="50" x2="140" y2="40" stroke-width="2"  /></g>';
                        elements += '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="140" y1="40" x2="200" y2="40" stroke-width="2"  /></g>';
                        textX = 228;
                        textY = 47;
                    }
                } else {
                    iconY = 110;
                    elements = '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="133" y1="50" x2="140" y2="40" stroke-width="2"  /></g>';
                    elements += '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="140" y1="40" x2="200" y2="40" stroke-width="2"  /></g>';
                    textX = 175;
                    textY = 35;
                }
            } else if(settings.iconPosition == 'right') {
                iconX = 120;
                iconY = 110;
                textX = 80;
            }

            if(settings.targetPercent > 0) {
                textY = 95;
                elements = '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="75" y1="101" x2="125" y2="101" stroke-width="1"  /></g>';
                elements += '<text text-anchor="middle" x="' + textX + '" y="120" style="font-size: ' + settings.targetTextSize + 'px;" fill="' + settings.targetColor + '">' + settings.targetPercent + '%</text>';
                elements += '<circle cx="145" cy="128" r="57" fill="none" stroke="' + settings.backColor + '" stroke-width="10" stroke-dasharray="360" transform="rotate(-90,100,100)" />';
                elements += '<circle cx="145" cy="128" r="" fill="none" stroke="' + settings.targetColor + '" stroke-width="3" stroke-dasharray="' + (360 / 100 * settings.targetPercent) + ', 20000" transform="rotate(-90,100,100)" />';

            }

            if(settings.text != null && settings.multiPercentage == 0) {
                elements += '<text text-anchor="middle" x="100" y="125" style="' + settings.textStyle + '" fill="' + settings.textColor + '">' + settings.text + '</text>';
            } else if(settings.text != null && settings.multiPercentage == 1) {
                elements += '<text text-anchor="middle" x="228" y="65" style="' + settings.textStyle + '" fill="' + settings.textColor + '">' + settings.text + '</text>';
            }

            if (settings.icon != 'none') {
                icon = '<text text-anchor="middle" x="' + iconX + '" y="' + iconY + '" class="icon" style="font-size: ' + settings.iconSize + 'px" fill="' + settings.iconColor + '">&#x' + settings.icon + '</text>';
            }

            circleContainer
                .addClass('svg-container')
                .append(
                    $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 194 186" class="circliful">' +
                        elements +
                        '<circle cx="145" cy="128" r="57" class="border" fill="' + settings.fillColor + '" stroke="' + settings.backgroundColor + '" stroke-width="' + backgroundBorderWidth + '" stroke-dasharray="360" transform="rotate(-90,100,100)" />' +
                        '<circle class="circle" cx="145" cy="128" r="57" class="border" fill="none" stroke="' + settings.foregroundColor + '" stroke-width="' + settings.foregroundBorderWidth + '" stroke-dasharray="0,20000" transform="rotate(-90,100,100)" />' +
                        '<circle cx="145" cy="128" r="' + settings.pointSize + '" fill="' + settings.pointColor + '" />' +
                        icon +
                        '<text class="timer" text-anchor="middle" x="' + textX + '" y="' + textY + '" style="font-size: ' + settings.percentageTextSize + 'px; ' + additionalCss + ';' + settings.textAdditionalCss + '" fill="' + settings.fontColor + '">0%</text>')
                );

            var circle = circleContainer.find('.circle');
            var myTimer = circleContainer.find('.timer');
            var interval = 30;
            var angle = 0;
            var angleIncrement = settings.animationStep;
            var last = 0;
            var summary = 0;
            var oneStep = 0;

            if (settings.start > 0 && settings.target > 0) {
                percent = settings.start / (settings.target / 100);
                oneStep = settings.target / 100;
            }

            if (settings.animation == 1) {
                var timer = window.setInterval(function () {
                    if ((angle) >= (360 / 100 * percent)) {
                        window.clearInterval(timer);
                        last = 1;
                    } else {
                        angle += angleIncrement;
                        summary += oneStep;
                    }

                    if (angle / 3.6 >= percent && last == 1) {
                        angle = 3.6 * percent;
                    }

                    if (summary > settings.target && last == 1) {
                        summary = settings.target;
                    }

                    circle
                        .attr("stroke-dasharray", angle + ", 20000");

                    if (settings.showPercent == 1) {
                        myTimer
                            .text(parseInt(angle / 360 * 100) + '%');
                    } else {
                        myTimer
                            .text(summary);
                    }

                }.bind(circle), interval);
            } else {
                circle
                    .attr("stroke-dasharray", (360 / 100 * percent) + ", 20000");

                if (settings.showPercent == 1) {
                    myTimer
                        .text(percent + '%');
                } else {
                    myTimer
                        .text(settings.target);
                }
            }
        });
    }
    /* fix vertical when not overflow
     call fullscreenFix() if .fullscreen content changes */
    function fullscreenFix(){
        var h = $('body').height();
        // set .fullscreen height
        $(".content-b").each(function(i){
            if($(this).innerHeight() > h){ $(this).closest(".fullscreen").addClass("overflow");
            }
        });
    }
    $(window).resize(fullscreenFix);
    fullscreenFix();

    /* resize background images */
    function backgroundResize(){
        var windowH = $(window).height();
        $(".background").each(function(i){
            var path = $(this);
            // variables
            var contW = path.width();
            var contH = path.height();
            var imgW = path.attr("data-img-width");
            var imgH = path.attr("data-img-height");
            var ratio = imgW / imgH;
            // overflowing difference
            var diff = parseFloat(path.attr("data-diff"));
            diff = diff ? diff : 0;
            // remaining height to have fullscreen image only on parallax
            var remainingH = 0;
            if(path.hasClass("parallax")){
                var maxH = contH > windowH ? contH : windowH;
                remainingH = windowH - contH;
            }
            // set img values depending on cont
            imgH = contH + remainingH + diff;
            imgW = imgH * ratio;
            // fix when too large
            if(contW > imgW){
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.data("resized-imgW", imgW);
            path.data("resized-imgH", imgH);
            path.css("background-size", imgW + "px " + imgH + "px");
        });
    }
    $(window).resize(backgroundResize);
    $(window).focus(backgroundResize);
    backgroundResize();

}(jQuery));
