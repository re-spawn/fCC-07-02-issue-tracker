const fs = require('fs');
const PATH = './db';

function DB() {

  this.reset = function() {
    if (fs.existsSync(PATH)) {
      fs.rmSync(PATH);
    } 
  };

  this.getProject = function(project) {
    // returns project object or error string
    let result;
    let projects, projectIndex;
    if (fs.existsSync(PATH)) {
      projects = JSON.parse(fs.readFileSync(PATH));
      projectIndex = projects.findIndex((element) => {
        return element.project == project;
      });
      if (projectIndex == -1) {
        result = 'no such project'; // project not in PATH
      } else {
        result = projects[projectIndex];
      }
    } else {
      result = 'no such project'; // no PATH
    }
    return result;
  };

  this.addProject = function(project) {
    // returns project object or error string
    let result;
    let projects;
    if (this.getProject(project) != 'no such project') {
      result = 'project already exists';
    } else {
      if (fs.existsSync(PATH)) {
        projects = JSON.parse(fs.readFileSync(PATH));
      } else {
        projects = [];
      }
      projects.push({
        "project": project,
        "issues": []
      });
      fs.writeFileSync(PATH, JSON.stringify(projects));
      result = projects[projects.length - 1];
    }
    return result;
  };
    
  // intended to be private to DB
  // called by this.addIssue & this.updateIssue
  this.updateProject = function(project, issues) {
    // returns project object or error string
    let result;
    let projects, projectIndex;
    if (this.getProject(project) == 'no such project') {
      result = 'no such project';
    } else {
      projects = JSON.parse(fs.readFileSync(PATH));
      projectIndex = projects.findIndex((element) => {
        return element.project == project;
      });
      projects[projectIndex].issues = issues;
      fs.writeFileSync(PATH, JSON.stringify(projects));
      result = projects[projectIndex];
    }
    return result;
  };

  this.getIssues = function(project) {
    // returns issues array or error string
    let result;
    let projectObj = this.getProject(project);
    if (projectObj == 'no such project') {
      result = 'no such project'; 
    } else {
      result = projectObj.issues;
    }
    return result;
  };

  this.addIssue = function(project, issue) {
    // returns issue or error string
    let issues = this.getIssues(project);
    if (issues == 'no such project') {
      issues = this.addProject(project).issues;
    }
    const issueTitle = issue.issue_title;
    if (issueTitle == undefined || issueTitle == '') {
      return 'required field(s) missing';
    }
    const issueText = issue.issue_text;
    if (issueText == undefined || issueText == '') {
      return 'required field(s) missing';
    }
    const createdBy = issue.created_by;
    if (createdBy == undefined || createdBy == '') {
      return 'required field(s) missing';
    }
    const assignedTo = (issue.assigned_to == undefined) ? "" : issue.assigned_to;
    const statusText = (issue.status_text == undefined) ? "" : issue.status_text;
    let date = new Date();
    let issueObj = {
      "_id": project + (issues.length + 1),
      "issue_title": issueTitle,
      "issue_text": issueText,
      "created_on": date.toISOString(),
      "updated_on": date.toISOString(),
      "created_by": createdBy,
      "assigned_to": assignedTo,
      "open": true,
      "status_text": statusText,     
    };
    issues.push(issueObj);
    this.updateProject(project, issues);
    return issueObj;
  };

  this.updateIssue = function(project, issue) {
    // returns result string or error string
    const issueId = issue._id;
    if (issueId == undefined || issueId == '') {
      return 'missing _id';
    }
    let keys = Object.keys(issue);
    if (keys.length == 1) { // keys[0] == _id
      return 'no update field(s) sent';
    }
    let issues = this.getIssues(project);
    if (issues == 'no such project') {
      return 'could not update'; // no such project
    };
    let issueIndex = issues.findIndex((element) => {
      return element._id == issueId;
    });
    if (issueIndex == -1) {
      return 'could not update'; // no such issue
    }
    let issueObj = issues[issueIndex];
    let result = "";
    keys.forEach((key) => {
      if (['issue_title', 'issue_text', 'created_by', 'open'].includes(key) && issue[key] === "") {
        result = 'could not update'; // required field(s) missing
      } else if (['created_on', 'updated_on'].includes(key)) {
        result = 'could not update'; // cannot directly set timestamps
      } else if (key == 'open' && typeof issue[key] != 'boolean') {
        if (issue[key] == 'true') {
          issueObj[key] = true;
        } else if (issue[key] == 'false') {
          issueObj[key] = false;
        } else {
          result = 'could not update'; // open not booleany
        }
      } else {
        issueObj[key] = issue[key];
      }
    });
    if (result != "") {
      return result;
    }
    setTimeout(() => { return }, 100); // so invalid fCC test passes
    let date = new Date();
    issueObj.updated_on = date.toISOString();
    issues[issueIndex] = issueObj;
    this.updateProject(project, issues);
    return 'successfully updated';
  };

  this.deleteIssue = function(project, issue) {
    // returns result string or error string
    const issueId = issue._id;
    if (issueId == undefined || issueId == '') {
      return 'missing _id';
    }
    let issues = this.getIssues(project);
    if (issues == 'no such project') {
      return 'could not delete'; // no such project
    };
    let issueIndex = issues.findIndex((element) => {
      return element._id == issueId;
    });
    if (issueIndex == -1) {
      return 'could not delete'; // no such issue
    }
    issues.splice(issueIndex, 1);
    this.updateProject(project, issues);
    return 'successfully deleted';
  };
  

};

module.exports = DB;
