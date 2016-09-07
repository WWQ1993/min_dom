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
        w.$('.a').before(node2);

       expect($('.a').length).toBe(length  );
    });
});

// w.$('.on').on({
//     'click.on': function (e) {
//         console.log(e)
//     },
//     'mouseover.a':function (e) {
//         console.log('on')
//     }

// }, '', 'dsf');
function cc(e) {
    console.log('cc')
};
w.$('.on').on('cclick.on',{a:132},cc);
w.$('.on').on('click.on',{a:132},function (e) {
    console.log('234234')
});
w.$('.on').trigger('cclick')

w.$(function () {
})

// w.$('.on').off('click.bb',cc);
// w.$('.on').off('mouseover.a');
  w.$('.on').before(w.$('<input type="text"/>'));
console.log(w.$('<input type="text"/>'))
document.body.appendChild(w.$('<input type="text"/>')[0])