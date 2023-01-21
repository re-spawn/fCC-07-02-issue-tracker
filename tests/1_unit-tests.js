const chai = require('chai');
let assert = chai.assert;
const DB = require('../db.js');
let db = new DB();

suite('Unit Tests', function() {

  suite('addProject', function() {
    test('Reset database and add project', function() {
      db.reset();
      let project = db.addProject('respawn');
      assert.isObject(project);
      assert.strictEqual(project.project, 'respawn');
      assert.isArray(project.issues);
      assert.strictEqual(project.issues.length, 0);
    });
    test('Add project to existing database', function() {
      let project = db.addProject('Number Two');
      assert.isObject(project);
      assert.strictEqual(project.project, 'Number Two');
      assert.isArray(project.issues);
      assert.strictEqual(project.issues.length, 0);
    });
    test('Add project that already exists', function() {
      let project = db.addProject('Number Two');
      assert.strictEqual(project, 'project already exists');
    });
  });

  suite('getProject', function() {
    test('Reset database and get project that does not exist', function() {
      db.reset();
      let project = db.getProject('respawn');
      assert.strictEqual(project, 'no such project');
    });
    test('Get project', function() {
      db.addProject('respawn');
      let project = db.getProject('respawn');
      assert.isObject(project);
      assert.strictEqual(project.project, 'respawn');
      assert.isArray(project.issues);
      assert.strictEqual(project.issues.length, 0);
    });
    test('Get project that does not exist', function() {
      let project = db.getProject('Number Two');
      assert.strictEqual(project, 'no such project');
    });
  });

  suite('getIssues', function() {
    test('Get issues', function() {
      db.reset();
      db.addProject('respawn');
      let issues = db.getIssues('respawn');
      assert.isArray(issues);
      assert.strictEqual(issues.length, 0);
    });
    test('Get issues for project that does not exist', function() {
      let issues = db.getIssues('Number Two');
      assert.strictEqual(issues, 'no such project');
    });
  });

  suite('addIssue & updateIssue', function() {
    test('Reset database and add issue with every field', function() {
      db.reset();
      let project = 'respawn';
      let issueTitle = 'respawn1 Title';
      let issueText = 'respawn1 Text';
      let createdBy = 'Rob';
      let assignedTo = 'Rob';
      let statusText = 'Pending';
      let issue = {
        "issue_title": issueTitle,
        "issue_text": issueText,
        "created_by": createdBy,
        "assigned_to": assignedTo,
        "status_text": statusText
      };
      issue = db.addIssue(project, issue);
      // _id
      assert.strictEqual(issue._id, project + '1');
      // issue_title
      assert.strictEqual(issue.issue_title, issueTitle);
      // issue_text
      assert.strictEqual(issue.issue_text, issueText);
      // created_on
      assert.isDefined(issue.created_on);
      assert.isNotEmpty(issue.created_on);
      const createdOn = new Date(issue.created_on);
      assert.instanceOf(createdOn, Date);
      assert.isNotNaN(createdOn);
      assert.isAtMost(createdOn, new Date());
      // updated_on
      assert.isDefined(issue.updated_on);
      assert.isNotEmpty(issue.updated_on);
      const updatedOn = new Date(issue.updated_on);
      assert.instanceOf(updatedOn, Date);
      assert.isNotNaN(updatedOn);
      assert.strictEqual(updatedOn.toUTCString(), createdOn.toUTCString());
      // created_by
      assert.strictEqual(issue.created_by, createdBy);
      // assigned_to
      assert.strictEqual(issue.assigned_to, assignedTo);
      // open
      assert.isTrue(issue.open);
      // status_text
      assert.strictEqual(issue.status_text, statusText);
    });
    test('Update issue without providing _id (nonsensical)', function() {
      let project = 'respawn';
      let issueId = 'respawn1';
      let issueTitle = 'respawn1 Title UPDATED';
      let issue = {
        "issue_title": issueTitle
      };
      let error = db.updateIssue(project, issue);
      assert.strictEqual(error, 'missing _id');
    });
    test('Update issue without providing any update fields', function() {
      let project = 'respawn';
      let issueId = 'respawn1';
      let issueTitle = 'respawn1 Title UPDATED';
      let issue = {
        "_id": issueId
      };
      let error = db.updateIssue(project, issue);
      assert.strictEqual(error, 'no update field(s) sent');
    });
    test('Update issue_title', function() {
      let project = 'respawn';
      let issueId = 'respawn1';
      let issueTitle = 'respawn1 Title UPDATED';
      let issue = {
        "_id": issueId,
        "issue_title": issueTitle
      };
      let result = db.updateIssue(project, issue);
      assert.strictEqual(result, 'successfully updated');
      let issues = db.getIssues(project);
      let issueIndex = issues.findIndex((element) => {
        return element._id == issueId;
      });
      assert.strictEqual(issues[issueIndex].issue_title, issueTitle);
    });

  });


});

/*
        "_id": 'string',
        "issue_title": 'string',
        "issue_text": 'string',
        "created_on": 'date',
        "updated_on": 'date',
        "created_by": 'string',
        "assigned_to": 'string',
        'open": boolean,
        "status_text": 'string'
*/
