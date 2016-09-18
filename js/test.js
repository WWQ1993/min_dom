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


// describe("DOM_operation", function () {
//     it("", function () {
//         expect().toBe();
//     });
//     it("index", function () {
//         expect($('.a').index('.aa')).toBe(w.$('.a').index('.aa'));
//         expect($('.a').index($('.aa'))).toBe(w.$('.a').index($('.aa')));
//         expect($('.a').index($('.aa')[0])).toBe(w.$('.a').index($('.aa')[0]));
//     });
//     it("clone", function () {
//         var node2 = w.$('.aaa');
//         var length = $('.a').length;
//         w.$('.a').before(node2);
//
//         expect($('.a').length).toBe(length);
//     });
//     it('scrollTop、scrollLeft', function () {
//         var top1 = $('body').scrollTop();
//         var top2 = w.$('body').scrollTop();
//         var left1 = $('body').scrollLeft();
//         var left2 = w.$('body').scrollLeft();
//         expect(top1).toBe(top2);
//         expect(left1).toBe(left2);
//     });
// });

// w.$('.on').on({
//     'click.on': function (e) {
//         console.log(e)
//     },
//     'mouseover.a':function (e) {
//         console.log('on')
//     }

// }, '', 'dsf');
function cc(e) {
    console.log(e)
};
$('div').on('click.on', '.on', {a: 132}, cc);
// w.$('.on').on('click.on', {a: 132}, function (e) {
//     console.log('234234')
// });
// w.$('.on').trigger('click')

console.log(w.$(function () {
}))

// w.$('.on').off('click.bb',cc);
// w.$('.on').off('mouseover.a');
// w.$('.on').before(w.$('<input type="text"/>'));
// console.log(w.$('<input type="text"/>'))
document.body.appendChild(w.$('<div style="color:red;"><b>234</b><div>d</div></div>')[0]);
w.$(window).one('clicck', function () {
    w.$.ajax({
        dataType: 'json',
        type: 'GET',
        data: {
            industry: 'electronic',
            cityId: '435',
            size: '3'
        },
        url: 'http://op.chinahr.com/2016spring/api/getIndustryListByPage',
        success: function (e) {
            console.log(e)
        },
        timeout: 10,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Cache-Control': 'cache'
        },
        error: function (xhr, type, err) {
            console.log(arguments)
        }
        ,
        beforeSend: function () {
            // console.log(arguments)
        }
    });

    //http://cache.video.iqiyi.com/jp/avlist/202861101/1/
    //http://qzone-music.qq.com/fcg-bin/fcg_music_fav_getinfo.fcg?dirinfo=0&dirid=1&uin=QQ%E5%8F%B7&p=0.519638272547262&g_tk=128423485
    // w.$.ajax({
    //     dataType: 'jsonp',
    //     url: 'http://cache.video.iqiyi.com/jp/avlist/202861101/1/',
    //     type: 'GET',
    //     jsonpCallback: 'callbackaaa',
    //     timeout: 1000,
    //     success: function (e) {
    //         console.log(arguments)
    //     },
    //     complete: function (e) {
    //         console.log(arguments)
    //     },
    //
    //     error: function (xhr, type, err) {
    //         console.log(arguments)
    //
    //     },
    //     beforeSend: function () {
    //         console.log(arguments)
    //     }
    // });

});

//
// $.ajax({
//     dataType:'json',
//     type:'GET',
//     url:'http://op.chinahr.com/2016spring/api/getIndustryListByPage?industry=electronic&cityId=435&page=1&size=3',
//     success:function (e) {
//         console.log(e)
//     },
//
// })

var obj = {name: 'tom', 'class': {className: 'class1', attr2: 'att'}, classMates: [{name: 'lily'}]};
console.log((obj))
console.log(w.$.param(obj))
console.log(decodeURIComponent($.param(obj)));

// $('.target').append($('.on'));

console.log($('div').index($('.on')[1]));


var obj = {
    a: {a: 1, b: [[22, 33], 2]},
    b: {
        c: '为地方',
        d: 3,
    },
    d: [1, {aa: 11}]
};


describe("para", function () {
    it("pa", function () {
        expect(decodeURIComponent($.param(obj))).toBe(w.$.param(obj));
    });
    it("height", function () {

        expect(w.$('.on').height()).toBe($('.on').height());
        expect(w.$(document).height()).toBe($(document).height());
        expect(w.$(window).height()).toBe($(window).height());

    });
    it("width", function () {

        expect(w.$('.on').width()).toBe($('.on').width());
        expect(w.$(document).width()).toBe($(document).width());
        expect(w.$(window).width()).toBe($(window).width());

        w.$('.on').width(200);
        expect(w.$('.on').width()).toBe(200);
    });
});

// w.$.ajax({
//     data: obj
// });

// w.$(document.body).append(w.$('.a'))
$(document.body).append($('.a'));

console.log($('.aaa').offset())
console.log(w.$('.aaa').offset());


w.$('.on').one('click', function (e) {
    console.log('on')
})

w.$('.on').eq(0).toggle();
w.$('.on').toggle();

