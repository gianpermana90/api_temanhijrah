const userRoutes = require('./user_routes');
const categoryRoutes = require('./category_routes');
const recitationRoutes = require('./recitation_routes');
const ustadzRoutes = require('./ustadz_routes');
// const adminRoutes = require('./admin_routes');

module.exports = function(app,db){
	userRoutes(app,db);
	categoryRoutes(app,db);
	recitationRoutes(app,db);
	ustadzRoutes(app,db);
}
