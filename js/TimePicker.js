/**
 * Created by gustavog on 07/04/17.
 */
(function ($) {
    $.fn.TimePicker = function(options){
        return $(this).each(function(i,el){
            var defaults = {
                title:"TimePicker",
                showSeg:false,
                defautTime:new Date(),
                time24:true,
                onChange:null,
                isreadOnly:true,
                close:null,
                accept:null,
                buttons: {
                    "OK": _accept,
                    "Cerrar":_cancel
                }
            }
            defaults = $.extend( {}, defaults, options);
            var timeObject = null;
            init();
            function init(){
                createElement($(el));
                $('body').append(timeObject);
                $(el).click(function(){
                    if(!$(timeObject).is(":visible")) {
                        var offset = $(timeObject).offset();
                        // Move the error div to it's new position
                        offset.left += $(el).offset().left;
                        offset.top += $(el).offset().top + $(el).height() + 5;
                        $(timeObject).offset(offset);
                        setTime();
                        $(timeObject).show();
                    }else{
                        _close();
                    }
                });
                if(defaults.isreadOnly){
                    $(el).prop("readOnly",true);
                }
                $(".arrow-up,.arrow-down",timeObject).each(function(i,e){
                    if($(e).hasClass("hours")){
                        $(e).click(function(){
                            changeTime(".hourInput",defaults.time24?23:12,$(e).hasClass("arrow-up"));
                        });
                    }
                    if($(e).hasClass("minute")){
                        $(e).click(function(){
                            changeTime(".minuteInput",59,$(e).hasClass("arrow-up"));
                        });
                    }
                    if($(e).hasClass("seg")){
                        $(e).click(function(){
                            changeTime(".segInput",59,$(e).hasClass("arrow-up"));
                        });
                    }
                    if($(e).hasClass("a")){
                        $(e).click(function(){
                            changeA(".aInput");
                        });
                    }
                });

                // crear codigo para el init
            }

            function _close() {
                if(defaults.close) defaults.close();
                var offset = $(timeObject).offset();

                offset.left = 0;
                offset.top = 0;
                $(timeObject).offset(offset);
                $(timeObject).hide();
            }
            function createElement(e){
                timeObject = $('<div class="timePicker" tabindex="9999">');
                var topbtn = $('<div class="topbtn">')
                    .append('<div class="arrow-up hours"></div>')
                    .append('&nbsp;&nbsp;&nbsp;')
                    .append('<div class="arrow-up minute"></div>');
                if(defaults.showSeg) {
                    topbtn.append('&nbsp;&nbsp;&nbsp;')
                        .append('<div class="arrow-up seg"></div>');
                }
                if(!defaults.time24) {
                    topbtn.append('&nbsp;&nbsp;&nbsp;')
                        .append('<div class="arrow-up a"></div>');
                }
                var title = $('<div class="title">').append(defaults.title);
                var inputs = $('<div class="inputs">')
                    .append('<input type="text" class="hourInput" readonly size="1" maxlength="2" value="12">')
                    .append(' : ')
                    .append('<input type="text" class="minuteInput" readonly size="1" maxlength="2" value="00">');
                if(defaults.showSeg) {
                    inputs.append(' : ')
                        .append('<input type="text" class="segInput" readonly size="1" maxlength="2" value="00">');
                }
                if(!defaults.time24) {
                    inputs.append(' : ')
                        .append('<input type="text" class="aInput" readonly size="1" maxlength="2" value="PM">');
                }
                var buttonbtn = $('<div class="buttonbtn">')
                    .append('<div class="arrow-down hours"></div>')
                    .append('&nbsp;&nbsp;&nbsp;')
                    .append('<div class="arrow-down minute"></div>');
                if(defaults.showSeg) {
                    buttonbtn.append('&nbsp;&nbsp;&nbsp;')
                        .append('<div class="arrow-down seg"></div>');
                }
                if(!defaults.time24) {
                    buttonbtn.append('&nbsp;&nbsp;&nbsp;')
                        .append('<div class="arrow-down a"></div>');
                }
                var btns = $('<div class="btns">');
                for(var b in defaults.buttons){
                    var btn = $('<div class="btn">')
                        .append(b);
                    if(defaults.buttons[b] ==="_accept")btn.click(_accept);
                    else if(defaults.buttons[b] ==="_cancel")btn.click(_cancel);
                    else btn.click(defaults.buttons[b]);
                    btns.append(btn);
                }
                timeObject.append(title)
                    .append(topbtn)
                    .append(inputs)
                    .append(buttonbtn)
                    .append(btns);
                $(document).click(function(e){
                    if (!timeObject.is(e.target) && timeObject.has(e.target).length === 0 && !$(el).is(e.target) && $(el).has(e.target).length === 0){
                        _close();
                    }
                });
                setTime();
                /* metodo no funcional para calendar tubo que ser ajustado
                 timeObject.focusout(function (e) {
                 console.log(document.activeElement);
                 if ($(document.activeElement).closest(timeObject).length == 0){
                 _close();
                 }
                 });
                 */
            }

            function setTime(){
                var e = $(el);
                var h = defaults.defautTime.getHours();
                var m = defaults.defautTime.getMinutes();
                var s = defaults.defautTime.getSeconds();
                var a = "--";
                if(e.val() !== undefined && e.val() !== null && e.val() !== ""){
                    if(/^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/.test(e.val())){
                        var t = e.val().split(":");
                        if(parseInt(t[0]) > 23)h =0;
                        else h=parseInt(t[0]);
                        if(parseInt(t[1]) > 59)m = 0;
                        else m=parseInt(t[1]);
                        if(parseInt(t[2]) > 59)s = 0;
                        else s=parseInt(t[2]);

                        if(!defaults.time24){
                            a = "AM";
                            if(parseInt(t[0]) > 12){
                                h =parseInt(t[0]) - 12;
                                a = "PM";
                                if(h>12)h=12;
                            }else if(parseInt(t[0]) === 0) h = 12;
                        }
                    }else if(/^[0-9]{2}[:][0-9]{2}[:][0-9]{2} [AP][M]$/.test(e.val()) && !defaults.time24){
                        var v = e.val().replace(" AM");
                        v = v.replace(" PM");
                        a = /[AP][M]/.exec(e.val())[0];
                        var t = e.val().split(":");
                        if(parseInt(t[0]) > 12){
                            h =parseInt(t[0]) - 12;
                            a = "PM";
                            if(h>12)h=12;
                        }else if(parseInt(t[0]) === 0) h = 12;
                        else h=parseInt(t[0]);
                        if(parseInt(t[1]) > 59)m = 0;
                        else m=parseInt(t[1]);
                        if(parseInt(t[2]) > 59)s = 0;
                        else s=parseInt(t[2]);

                    }
                }

                if(h<10)h="0"+h;
                if(m<10)m="0"+m;
                if(s<10)s="0"+s;
                $('.hourInput',timeObject).val(h);
                $('.minuteInput',timeObject).val(m);
                $('.segInput',timeObject).val(s);
                $('.aInput',timeObject).val(a);
            }
            function changeTime(e,l,t){
                var h = $(e,timeObject).val();
                h = parseInt(h);
                if(t){
                    if(h === l)h = "00";
                    else{
                        if((h+1)<10)h = "0"+(h+1);
                        else h++;
                    }
                }else{
                    if(h === 0)h = l;
                    else{
                        if((h-1)<10)h = "0"+(h-1);
                        else h--;
                    }
                }
                $(e,timeObject).val(h);
                _change($(".hourInput",timeObject).val(),$(".minuteInput",timeObject).val(),$(".segInput",timeObject).val(),$(".aInput",timeObject).val());
            }

            function changeA(e){
                if($(e,timeObject).val() === "AM") $(e,timeObject).val("PM");
                else $(e,timeObject).val("AM");
                _change($(".hourInput",timeObject).val(),$(".minuteInput",timeObject).val(),$(".segInput",timeObject).val(),$(".aInput",timeObject).val());
            }

            function _change(h,m,s,a){
                if(defaults.onChange){
                    defaults.onChange(el,h,m,s,a);
                }
            }

            function _accept(){
                var h = $(".hourInput",timeObject).val();
                var m = $(".minuteInput",timeObject).val();
                var s = $(".segInput",timeObject).val();
                var a = $(".aInput",timeObject).val();
                if(!s) s= "00";
                if(!a) a= "--";
                var r = true;
                if(!defaults.time24){
                    if(a === "PM" && parseInt(h) !== 12){
                        h = parseInt(h)+12;
                        if(h == 24) h = 0;
                    }
                }
                var time = new Date();
                time.setHours(parseInt(h));
                time.setMinutes(parseInt(m));
                time.setSeconds(parseInt(s));
                if(defaults.accept){
                    r = defaults.accept(el,time);
                }else {
                    if(defaults.time24) {
                        $(el).val($.TimeDateFormat(time,"H:m:S"));
                    }else{
                        $(el).val($.TimeDateFormat(time,"h:m:S A"));
                    }
                }
                if(r!==false)_close();
            }
            function _cancel() {
                _close();
            }

        });
    }
    $.extend({
        TimePad:function(num){
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        },
        TimeDateFormat:function(date,format){
            if(!format)format = "Y-M-D";
            format = format.split("Y").join($.TimePad(date.getFullYear()));
            format = format.split("M").join($.TimePad(date.getMonth()+1));
            format = format.split("D").join($.TimePad(date.getDate()));

            format = format.split("H").join($.TimePad(date.getHours()));
            format = format.split("m").join($.TimePad(date.getMinutes()));
            format = format.split("S").join($.TimePad(date.getSeconds()));
            var h = date.getHours();
            var a = "am";
            if(date.getHours() > 12 && date.getHours() !== 0){
                h = date.getHours()-12;
                a = "pm";
            }else if(date.getHours() === 0){
                h = 12;
            }
            format = format.split("h").join($.TimePad(h));
            format = format.split("a").join(a);
            format = format.split("A").join(a.toUpperCase());

            return format;
        },
        TimeDateAdd:function(date, interval, units){
            if(isNaN(parseInt(units))) return undefined;
            var ret = new Date(date);
            switch(interval.toLowerCase()) {
                case 'year'   :  ret.setFullYear(ret.getFullYear() + parseInt(units));  break;
                case 'month'  :  ret.setMonth(ret.getMonth() + parseInt(units));  break;
                case 'week'   :  ret.setDate(ret.getDate() + 7*parseInt(units));  break;
                case 'day'    :  ret.setDate(ret.getDate() + parseInt(units));  break;
                case 'hour'   :  ret.setTime(ret.getTime() + parseInt(units)*3600000);  break;
                case 'minute' :  ret.setTime(ret.getTime() + parseInt(units)*60000);  break;
                case 'second' :  ret.setTime(ret.getTime() + parseInt(units)*1000);  break;
                default       :  return undefined;  break;
            }
            return ret;
        }
    });
})(jQuery);
