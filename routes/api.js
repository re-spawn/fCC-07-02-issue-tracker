'use strict';

const DB = require('../db.js');
let db = new DB();

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let issues = db.getIssues(project);
      if (typeof issues == 'string') { // no such project
        // res.status(400);
        res.json([]);
      } else {
        Object.keys(req.query).forEach((key) => {
          issues = issues.filter((issue) => {
            return issue[key] == req.query[key];
          });
        });
        res.json(issues);
      }
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let result = db.addIssue(project, req.body);
      if (typeof result == 'string') {
        // res.status(400);
        res.json({ "error": result });
      } else {
        res.json(result);
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let result = db.updateIssue(project, req.body);
      switch(result) {
        case 'successfully updated':
          res.json({
            "result": result,
            "_id": req.body._id
          });
          break;
        case 'missing id':
          res.json({
            "error": result
          });
          break;
        default:
          res.json({
            "error": result,
            "_id": req.body._id
          });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });

};
