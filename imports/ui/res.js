import  {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./templates/resolution.html";

Template.resolution.events({
    "click .toggle-checked"(){
        Meteor.call('res.setChecked', this._id, !this.checked);
    },
    "click .delete"(){
        Meteor.call('res.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('res.setPrivate', this._id, !this.private);
    }


});
Template.resolution.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
});
