import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
export const Resolutions = new Mongo.Collection("resolutions");
if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('resolutions', function resPublication() {
        return Resolutions.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'res.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a res
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Resolutions.insert({
            title:text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'res.remove'(resId) {
        check(resId, String);
        const res = Resolutions.findOne(resId);
        if (res.private && res.owner !== Meteor.userId()) {
            // If the res is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

    },
    'res.setChecked'(resId, setChecked) {
        check(resId, String);
        check(setChecked, Boolean);
        const res = Resolutions.findOne(resId);
        if (res.private && res.owner !== Meteor.userId()) {
            // If the res is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Resolutions.update(resId, { $set: { checked: setChecked } });
    },
    'res.setPrivate'(resId, setToPrivate) {
        check(resId, String);
        check(setToPrivate, Boolean);

        const res = Resolutions.findOne(resId);

        // Make sure only the res owner can make a res private
        if (res.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Resolutions.update(resId, { $set: { private: setToPrivate } });
    },


});