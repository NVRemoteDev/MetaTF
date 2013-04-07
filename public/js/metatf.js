$(document).ready(function() {
  // Handler for .ready() called.

  $(".bpitem").mousemove(function (e) {
    $(".iteminfo", this).addClass('show').css('left', e.pageX - 70).css('top', e.pageY - 110);
  });

  $(".bpitem").mouseout(function () {
    $(".iteminfo", this).removeClass('show');
  });
});