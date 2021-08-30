const Page                          = require('../model/Page');
exports.index = function(req, res)
{
    Page.findBySlug('home', function(page, err){

        if(err){
            console.log(err);
            return;
        } else {
            
            res.render('public/home', { content:page.content });
        }

    });
};
