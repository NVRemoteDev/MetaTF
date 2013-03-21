
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.user) var steamID = req.user; // If user is logged in, set req.user to their steam id
  res.render('index', { title: 'Meta.tf', user: steamID });
};
