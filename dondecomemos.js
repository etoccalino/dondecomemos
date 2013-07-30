Places = new Meteor.Collection("places");
Places.FIXTURE = [{
  name: "siga la vaca"
}, {
  name: "el norteNio"
}, {
  name: "vea"
}, {
  name: "sangucheria de la esquina"
}, {
  name: "el gallego"
}];

Votes = new Meteor.Collection("votes");

///////////////////////////////////////////////////////////////////////////////

if (Meteor.isClient) {

  Template.menu.places = function () {
    return Places.find({});
  };

  Template.place.votes = function () {
    return Votes.find({ place: this._id, when: helpers.today() }).count();
  };

  Template.votes.total = function () {
    return Votes.find({}).count();
  };

  Template.menu.events({
    'click input#flush': function () {
      Votes.find({}).forEach(function (vote) { Votes.remove({ _id: vote._id }) });
    }
  });

  Template.place.events({
    'click': function () {
      Votes.insert({ place: this._id, when: helpers.today() });
    }
  });
}

///////////////////////////////////////////////////////////////////////////////

if (Meteor.isServer) {
  Meteor.startup(function () {

    // Populate the places in the database.
    if (Places.find().count() === 0) {
      var len = Places.FIXTURE.length;
      for (var i = 0; i < len; i++)
        Places.insert(Places.FIXTURE[i]);
    }
    // Wipe out previous votes.
    if (Places.find().count() !== 0) {
      Votes.remove({});
    }
  });
}

///////////////////////////////////////////////////////////////////////////////

var helpers = {
  today: function () {
    var now = new Date()
      , y = now.getFullYear()
      , m = now.getMonth()
      , d = now.getDate();
    return new Date(y, m, d);
  }
}
