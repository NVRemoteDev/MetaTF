$(document).ready(function() {
  // Handler for .ready() called.

  // Add BPitem tooltips
  $(".bpitem").mousemove(function (e) {
    $(".iteminfo", this).addClass('show').css('left', e.pageX - 70).css('top', e.pageY - 110);
  });

  $(".bpitem").mouseout(function () {
    $(".iteminfo", this).removeClass('show');
  });

  // Hide backpack under create a trade
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
});