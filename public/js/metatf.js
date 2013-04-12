$(document).ready(function() {
  // Handler for .ready() called.

  // Add BPitem tooltips
  $(".bpitem").mousemove(function (e) {
    $(".iteminfo", this).addClass('show').css('left', e.pageX - 70).css('top', e.pageY - 110);
  });

  $(".bpitem").mouseout(function () {
    $(".iteminfo", this).removeClass('show');
  });

  // Hide schema under create a trade
  $(".create_trade > div:nth-child(1)").addClass('hide');

  // Hide schema when user clicks left side of trades
  $(".hasitems").click(function () {
    $(".create_trade > div:nth-child(2)").removeClass('hide');
    $(".create_trade > div:nth-child(2)").addClass('show');
    $(".create_trade > div:nth-child(1)").removeClass('show');
    $(".create_trade > div:nth-child(1)").addClass('hide');
  });

  // Hide schema when user clicks left side of trades
  $(".wantsitems").click(function () {
    $(".create_trade > div:nth-child(2)").removeClass('show');
    $(".create_trade > div:nth-child(2)").addClass('hide');
    $(".create_trade > div:nth-child(1)").removeClass('hide');
    $(".create_trade > div:nth-child(1)").addClass('show');
  });

  // Add boxselected to the first hasitems box
  $(".hasitems:eq(0)").addClass('boxselected');

  // Functionality to add UI feedback.  Adds background border for has items
  $(".hasitems").click(function () {
    $("*").removeClass('boxselected');
    $(this).addClass('boxselected');
  });

  // Functionality to add UI feedback on trade page.  Adds background border for has items
  $(".wantsitems").click(function () {
    $("*").removeClass('boxselected');
    $(this).addClass('boxselected');
  });

  // Add item to box of hasitems and wantsitems when clicked
  $(".create_trade").find('.bpitem').click(function () {
    var background = $(this).css('background-image');
    var backgroundsize = $(this).css('background-size');
    $(".boxselected").css('background-image', background);
    $(".boxselected").css('background-size', backgroundsize);
    $(".boxselected + div").addClass('temp');
    if(! $(".boxselected + div").length) {
      if( $(".hasitems", ".boxselected")) {
        $("br + .hasitems").addClass('temp');
      } else if( $(".wantsitems", ".boxselected")) {
        $("br + .wantsitems").addClass('temp');
      }
    }
    $(".boxselected").attr("class", $(this).attr("class")).addClass('hasitems');
    $(".temp").addClass('boxselected').removeClass('temp');
    $(this).addClass('disabled');
  });

});