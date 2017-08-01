import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import {Resolutions} from "../api/res.js";

import "./res";
import './templates/body.html';


Template.body.helpers({
    resolutions() {
        const instance = Template.instance();
        if(instance.state.get("hideCompleted")){
            return Resolutions.find({checked:{$ne:true}}, {sort:{createdAt:-1}})
        }
        //console.log(Resolutions.find({}));
        return Resolutions.find({}, {sort:{createdAt:-1}});
    },
    incompleteCount() {
        return Resolutions.find({ checked: { $ne: true } }).count();
    }
});
Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('resolutions');

});
Template.body.events({

    "submit .new-resolution": function (e) {
        e.preventDefault();
        let target= e.target;
        let title = target.title.value;
        console.log(title);
        let createdAt = new Date();
        //console.log(Resolutions.find());
        Meteor.call('res.insert', title);

        target.title.value = "";
        //return false;
    },
    "change .hide-completed input"(e,instance){
        instance.state.set("hideCompleted", e.target.checked);
    }

})
