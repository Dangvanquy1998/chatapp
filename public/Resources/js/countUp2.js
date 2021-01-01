/*!
* jquery.countup.js 1.0.3
*
* Copyright 2016, AdriĂ¡n Guerra Marrero http://agmstudio.io @AGMStudio_io
* Released under the MIT License
*
* Date: Oct 27, 2016
*/
(function(n){"use strict";n.fn.countUp=function(t){var i=n.extend({time:2e3,delay:10},t);return this.each(function(){var t=n(this),r=i,u=function(){var u,i,h;t.data("counterupTo")||t.data("counterupTo",t.text());var c=parseInt(t.data("counter-time"))>0?parseInt(t.data("counter-time")):r.time,f=parseInt(t.data("counter-delay"))>0?parseInt(t.data("counter-delay")):r.delay,e=c/f,n=t.data("counterupTo"),o=[n],l=/[0-9]+,[0-9]+/.test(n);n=n.replace(/,/g,"");var v=/^[0-9]+$/.test(n),s=/^[0-9]+\.[0-9]+$/.test(n),a=s?(n.split(".")[1]||[]).length:0;for(u=e;u>=1;u--){if(i=parseInt(Math.round(n/e*u)),s&&(i=parseFloat(n/e*u).toFixed(a)),l)while(/(\d+)(\d{3})/.test(i.toString()))i=i.toString().replace(/(\d+)(\d{3})/,"$1,$2");o.unshift(i)}t.data("counterup-nums",o);t.text("0");h=function(){t.text(t.data("counterup-nums").shift());t.data("counterup-nums").length?setTimeout(t.data("counterup-func"),f):(delete t.data("counterup-nums"),t.data("counterup-nums",null),t.data("counterup-func",null))};t.data("counterup-func",h);setTimeout(t.data("counterup-func"),f)};t.waypoint(u,{offset:"100%",triggerOnce:!0})})}})(jQuery);