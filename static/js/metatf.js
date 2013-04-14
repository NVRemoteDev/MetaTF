$(document).ready(function() {

  // Add BPitem tooltips
  $('.bpitem').mousemove(function (e) {
    $('.iteminfo', this).addClass('show').css('left', e.pageX - 70).css('top', e.pageY - 110);
  });

  $('.bpitem').mouseout(function () {
    $('.iteminfo', this).removeClass('show');
  });

  // Hide schema when user clicks left side of trades
  $('.hasitems').click(function () {
    $('.create_trade > div:nth-child(2)').removeClass('hide');
    $('.create_trade > div:nth-child(2)').addClass('show');
    $('.create_trade > div:nth-child(1)').removeClass('show');
    $('.create_trade > div:nth-child(1)').addClass('hide');
  });

  // Hide backpack when user clicks right side of trades
  $('.wantsitems').click(function () {
    $('.create_trade > div:nth-child(2)').removeClass('show');
    $('.create_trade > div:nth-child(2)').addClass('hide');
    $('.create_trade > div:nth-child(1)').removeClass('hide');
    $('.create_trade > div:nth-child(1)').addClass('show');
  });

  // Add boxselected to the first hasitems box
  $('.hasitems > div:eq(0)').addClass('boxselected');

  // Backpack filter function
  $('.bpfilter').change(function () {
    filterbyquality();
  });

  function filterbyquality() {
    var filter = '';
    $(".bpfilter option:selected").each(function () {
      filter = $(this).text().toLowerCase();
    });
    if(filter === 'none') {
      $('.backpackrow').find('.bpitem').removeClass('hide');
      $('.pagenumber').removeClass('hide');
    } else {
      $('.pagenumber').addClass('hide');
      $('.backpackrow').find('.bpitem').addClass('hide');
      $('.' + filter).removeClass('hide');
    }
  }

  // Creates icontains which is case insensitive contains
  $.expr[":"].icontains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
  });

  // Backpack item search filter function
  $('.search-query').keyup(function () {
    var filter = $(this).val();
    if(filter && filter !== ' ') {
      $('.pagenumber').addClass('hide');
      $('.backpackrow').find('.bpitem').addClass('hide');
      $('.backpackrow').find('.itemname:icontains("' + filter + '")').closest('.bpitem').removeClass('hide');
    } else {
      $('.backpackrow').find('.bpitem').removeClass('hide');
      $('.pagenumber').removeClass('hide');
    }
  });

  // Adds a selected cue to our trade boxes
  $('.itembox').click(function () {
    $('*').removeClass('boxselected');
    $(this).addClass('boxselected');
  });

  // Add item to box of hasitems and wantsitems when clicked
  // bpitem is their backpack item
  $('.create_trade').find('.bpitem').click(function () {
    if(! $(this).children().hasClass('notrade') && ! $(this).hasClass('addeditem')) {
      var background = $(this).css('background-image');
      var backgroundsize = $(this).css('background-size');
      $('.boxselected').css('background-image', background);
      $('.boxselected').css('background-size', backgroundsize);
      $('.boxselected + div').addClass('temp');
      if(! $('.boxselected + div').length) { // Finds past the <br> in view
        if( $('.hasitems').find('.boxselected').length) {
          $('.hasitems > br + .itembox').addClass('temp');
        } else if ($('.wantsitems').find('.boxselected').length) {
          $('.wantsitems > br + .itembox').addClass('temp');
        }
      }
      $('.boxselected').attr('class', $(this).attr('class'));
      $('.temp').addClass('boxselected').removeClass('temp');
      //Gray out backpack items after they're click
      if( $('.hasitems').find('.boxselected').length) {
        $(this).addClass('addeditem');
      }
    }
  });
});