// TODO: convert to vanillajs

/*

(function($) {

  $('.page-item-link[aria-haspopup="true"], .menu-item-link[aria-haspopup="true"]').each(function(){

    $(this).find('button').on('click',function(e){

      var $topLink = $(this).parent();
      if( $topLink.attr('aria-expanded') === "true" ){
        $topLink.attr('aria-expanded',false);
      }else{
        $topLink.attr('aria-expanded',true);
      }
      e.preventDefault();
    });

  });

})(jQuery);

*/