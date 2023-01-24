const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
// const server = require('../server');

require('dotenv').config();
if (process.env.HOST === 'repl') {
  var server = 'https://fCC-07-02-issue-tracker.respawn709.repl.co';
} else {
  var server = require('../server');
}

chai.use(chaiHttp);

suite('Functional Tests', function() {

  this.timeout(5000);
  const route = '/api/issues/respawn';
  const ids = [];

  test('Create an issue with every field', function(done) {
    const issueTitle = 'My First Issue Title';
    const issueText = 'My First Issue Text - blah, blah, blah';
    const createdBy = 'Rob';
    const assignedTo = 'Rob';
    const statusText = 'Pending';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
        'assigned_to': assignedTo,
        'status_text': statusText
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          // _id
          assert.isString(res.body._id);
          assert.notInclude(ids, res.body._id);
          ids.push(res.body._id);
          // issue_title
          assert.strictEqual(res.body.issue_title, issueTitle);
          // issue_text
          assert.strictEqual(res.body.issue_text, issueText);
          // created_on
          assert.isDefined(res.body.created_on);
          assert.isNotEmpty(res.body.created_on);
          const createdOn = new Date(res.body.created_on);
          assert.instanceOf(createdOn, Date);
          assert.isNotNaN(createdOn);
          assert.isAtMost(createdOn, new Date());
          // updated_on
          assert.isDefined(res.body.updated_on);
          assert.isNotEmpty(res.body.updated_on);
          const updatedOn = new Date(res.body.updated_on);
          assert.instanceOf(updatedOn, Date);
          assert.isNotNaN(updatedOn);
          assert.strictEqual(updatedOn.toISOString(), createdOn.toISOString());
          // created_by
          assert.strictEqual(res.body.created_by, createdBy);
          // assigned_to
          assert.strictEqual(res.body.assigned_to, assignedTo);
          // open
          assert.isTrue(res.body.open);
          // status_text
          assert.strictEqual(res.body.status_text, statusText);
        }
        done();
      });
  });
  test('Create an issue with only required fields', function(done) {
    const issueTitle = 'My Second Issue Title';
    const issueText = 'My Second Issue Text - blah, blah, blah';
    const createdBy = 'Rob';
    const assignedTo = '';
    const statusText = '';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          // _id
          assert.isString(res.body._id);
          assert.notInclude(ids, res.body._id);
          ids.push(res.body._id);
          // issue_title
          assert.strictEqual(res.body.issue_title, issueTitle);
          // issue_text
          assert.strictEqual(res.body.issue_text, issueText);
          // created_on
          assert.isDefined(res.body.created_on);
          assert.isNotEmpty(res.body.created_on);
          const createdOn = new Date(res.body.created_on);
          assert.instanceOf(createdOn, Date);
          assert.isNotNaN(createdOn);
          assert.isAtMost(createdOn, new Date());
          // updated_on
          assert.isDefined(res.body.updated_on);
          assert.isNotEmpty(res.body.updated_on);
          const updatedOn = new Date(res.body.updated_on);
          assert.instanceOf(updatedOn, Date);
          assert.isNotNaN(updatedOn);
          assert.strictEqual(updatedOn.toISOString(), createdOn.toISOString());
          // created_by
          assert.strictEqual(res.body.created_by, createdBy);
          // assigned_to
          assert.strictEqual(res.body.assigned_to, assignedTo);
          // open
          assert.isTrue(res.body.open);
          // status_text
          assert.strictEqual(res.body.status_text, statusText);
        }
        done();
      });
  });
  test('Create another issue with only required fields', function(done) {
    const issueTitle = 'My First Issue Title';
    const issueText = 'My First Issue Text - blah, blah, blah';
    const createdBy = 'George';
    const assignedTo = '';
    const statusText = '';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          // _id
          assert.isString(res.body._id);
          assert.notInclude(ids, res.body._id);
          ids.push(res.body._id);
          // issue_title
          assert.strictEqual(res.body.issue_title, issueTitle);
          // issue_text
          assert.strictEqual(res.body.issue_text, issueText);
          // created_on
          assert.isDefined(res.body.created_on);
          assert.isNotEmpty(res.body.created_on);
          const createdOn = new Date(res.body.created_on);
          assert.instanceOf(createdOn, Date);
          assert.isNotNaN(createdOn);
          assert.isAtMost(createdOn, new Date());
          // updated_on
          assert.isDefined(res.body.updated_on);
          assert.isNotEmpty(res.body.updated_on);
          const updatedOn = new Date(res.body.updated_on);
          assert.instanceOf(updatedOn, Date);
          assert.isNotNaN(updatedOn);
          assert.strictEqual(updatedOn.toISOString(), createdOn.toISOString());
          // created_by
          assert.strictEqual(res.body.created_by, createdBy);
          // assigned_to
          assert.strictEqual(res.body.assigned_to, assignedTo);
          // open
          assert.isTrue(res.body.open);
          // status_text
          assert.strictEqual(res.body.status_text, statusText);
        }
        done();
      });
  });
  test('Create an issue with missing required field issue_title', function(done) {
    // const issueTitle = 'My Third Issue Title';
    const issueTitle = '';
    const issueText = 'My Third Issue Text - blah, blah, blah';
    const createdBy = 'Rob';
    const assignedTo = '';
    const statusText = '';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          // assert.strictEqual(res.status, 400, 'Response status not 400 (Bad Request)');
          assert.deepEqual(res.body, { "error": "required field(s) missing" });
        }
        done();
      });
  });
  test('Create an issue with missing required field issue_text', function(done) {
    const issueTitle = 'My Fouth Issue Title';
    // const issueText = 'My Fourth Issue Text - blah, blah, blah';
    const issueText = '';
    const createdBy = 'Rob';
    const assignedTo = '';
    const statusText = '';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          // assert.strictEqual(res.status, 400, 'Response status not 400 (Bad Request)');
          assert.deepEqual(res.body, { "error": "required field(s) missing" });
        }
        done();
      });
  });
  test('Create an issue with missing required field created_by', function(done) {
    const issueTitle = 'My Fifth Issue Title';
    const issueText = 'My Fifth Issue Text - blah, blah, blah';
    // const createdBy = 'Rob';
    const createdBy = '';
    const assignedTo = '';
    const statusText = '';
    chai
      .request(server)
      .post(route)
      .type('form')
      .send({
        'issue_title': issueTitle,
        'issue_text': issueText,
        'created_by': createdBy,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          // assert.strictEqual(res.status, 400, 'Response status not 400 (Bad Request)');
          assert.deepEqual(res.body, { "error": "required field(s) missing" });
        }
        done();
      });
  });
  test('Get all issues', function(done) {
    chai
      .request(server)
      .get(route)
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.isArray(res.body);
          for (let id = 0; id < ids.length; id++) {
            let issueIndex = res.body.findIndex((element) => {
              return element._id == ids[id];
            });
            assert.notEqual(issueIndex, -1);
          }
        }
        done();
      });
  });
  test('Get issues using one filter', function(done) {
    let issueTitle = 'My First Issue Title';
    chai
      .request(server)
      .get(route + '?issue_title=' + issueTitle)
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          let issues = res.body;
          assert.isArray(issues);
          for (let i = 0; i < issues.length; i++) {
            assert.strictEqual(issues[i].issue_title, issueTitle);
          }
        }
        done();
      });
  });
  test('Get issues using multiple filters', function(done) {
    let issueTitle = 'My First Issue Title';
    let createdBy = 'George';
    chai
      .request(server)
      .get(route + '?issue_title=' + issueTitle + '&created_by=' + createdBy)
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          let issues = res.body;
          assert.isArray(issues);
          for (let i = 0; i < issues.length; i++) {
            assert.strictEqual(issues[i].issue_title, issueTitle);
            assert.strictEqual(issues[i].created_by, createdBy);
          }
        }
        done();
      });
  });
  test('Update one field', function(done) {
    let issueId = 'respawn1';
    let assignedTo = 'George';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        '_id': issueId,
        'assigned_to': assignedTo
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.result, 'successfully updated');
          assert.strictEqual(res.body._id, issueId);
        }
        done();
      });
  });
  test('Update multiple fields', function(done) {
    let issueId = 'respawn1';
    let assignedTo = 'Henry';
    let isOpen = false;
    let statusText = 'George could not figure it out';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        '_id': issueId,
        'assigned_to': assignedTo,
        'open': isOpen,
        'status_text': statusText
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.result, 'successfully updated');
          assert.strictEqual(res.body._id, issueId);
        }
        done();
      });
  });
  test('Update with empty _id', function(done) {
    let issueId = '';
    let assignedTo = 'Max';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        '_id': issueId,
        'assigned_to': assignedTo,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'missing _id');
        }
        done();
      });
  });
  test('Update with missing _id', function(done) {
    let assignedTo = 'Max';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        'assigned_to': assignedTo,
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'missing _id');
        }
        done();
      });
  });
  test('Update with missing update fields', function(done) {
    let issueId = 'respawn1';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        '_id': issueId
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'no update field(s) sent');
        }
        done();
      });
  });
  test('Update with invalid _id', function(done) {
    let issueId = 'INVALID';
    let assignedTo = 'Max';
    chai
      .request(server)
      .put(route)
      .type('form')
      .send({
        '_id': issueId,
        'assigned_to': assignedTo
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'could not update');
        }
        done();
      });
  });
  test('Delete', function(done) {
    let issueId = 'respawn1';
    chai
      .request(server)
      .delete(route)
      .type('form')
      .send({
        '_id': issueId
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.result, 'successfully deleted');
          assert.strictEqual(res.body._id, issueId);
        }
        done();
      });
  });
  test('Delete with invalid _id', function(done) {
    let issueId = 'INVALID';
    chai
      .request(server)
      .delete(route)
      .type('form')
      .send({
        '_id': issueId
      })
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'could not delete');
          assert.strictEqual(res.body._id, issueId);
        }
        done();
      });
  });
  test('Delete with missing _id', function(done) {
    chai
      .request(server)
      .delete(route)
      .type('form')
      .send({})
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          assert.strictEqual(res.status, 200, 'Response status not 200 (OK)');
          assert.strictEqual(res.body.error, 'missing _id');
        }
        done();
      });
  });

});
