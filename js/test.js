/**
 * Created by wuwanqiang on 2016/9/5.
 */

//    var log = console.log;
//    $('.a').remove('div');

//    $('.a').css(
//         'fontSize','88px'
//     );
//    console.log($('.a').is($('div')))
//    $('.a').remove();
//  console.log($('.bb').find('*').find('.a'))  ;
//        $('.bb').after($('.a'));
//    $('.a').attr('class', 'dfdf');
//
//    console.log($($('.a')[0]).text());
//    console.log($('.a')[0]);
//
//    console.log($('.a').eq(1).css('color', 'red'))
//
//    console.log($('.bb').find('.a').show())
//    $('.bb').find('.a').fadeIn(2000);

//    console.log($('.a').parents('.bb'))
//    $('.a').addClass('c1')
//    $('.a').toggleClass('c1')
//    console.log($('.a').text('2222'))
//    console.log($('.a').html())
//    console.log($('.a').html('33'))
//    $.fn.extend({
//        hello:function(){console.log('hello');}
//    });
//
//    console.log($.fn.hello())dd

//    $(function () {
//
//    });
//    console.log($('.a').index('.aa'))


describe("DOM_operation", function () {
    it("", function () {
        expect().toBe();
    });
    it("index", function () {
        expect($('.a').index('.aa')).toBe(w.$('.a').index('.aa'));
        expect($('.a').index($('.aa'))).toBe(w.$('.a').index($('.aa')));
        expect($('.a').index($('.aa')[0])).toBe(w.$('.a').index($('.aa')[0]));
    });
    it("clone", function () {
        var node2 = w.$('.aaa');
        var length = $('.a').length;
         w.$('.a').after(node2);

         expect($('.a').length).toBe(length * 2);
    });
});

// w.$('.bb').after(w.$('.aaa'));
