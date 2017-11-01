import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CouchService } from '../shared/couchdb.service';

@Component({
  templateUrl: './community.component.html'
})
export class CommunityComponent implements OnInit {
  message = '';
  communities = [];
  filter = '';
  selectedValue = '';
  constructor(
    private couchService: CouchService
    ) { }

  getcommunitylist() {
    this.couchService.post('communityregistrationrequests/_find', {
      'selector': {
        '$and': [
          {
            '_id': { '$gt': null }
          },
          {
            'nationName': { $regex: '.*' + this.filter + '.*' }
          },
          {
            'registrationRequest': { $regex: '.*' + this.selectedValue + '.*' }
          }
        ]
      }
    })
    .then((data) => {
      this.communities = data.docs;
    }, (error) => this.message = 'There was a problem getting community');
  }

  filterCommunity() {
    this.getcommunitylist();
  }

  deleteCommunity(communityId, communityRev) {
    const val = confirm('Are you sure you want to delete it?');
    if (val) {
      this.couchService.delete('communityregistrationrequests/' + communityId + '?rev=' + communityRev)
        .then((data) => {
          this.getcommunitylist();
        }, (error) => this.message = 'There was a problem deleting this community');
    }
  }

  ngOnInit() {
    this.getcommunitylist();
  }

}