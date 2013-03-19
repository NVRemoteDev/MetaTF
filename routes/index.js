
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.user) // If user is logged in, set req.user to their steam id (req.user if logged in is the steam openID)
  {
    var steamIdentifier = req.user.identifier;
    steamIdentifier = steamIdentifier.split('/');
    req.user = steamIdentifier[steamIdentifier.length-1];
  }
  res.render('index', { title: 'Meta.tf', user: req.user });
};
