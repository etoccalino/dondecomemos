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

  Template.votes.today = function () {
    return helpers.today().toDateString();
  };

  Template.votes.total = function () {
    return Votes.find({}).count();
  };

  Template.menu.events({
    'click input#flush': function () {
      Votes.find({ when: helpers.today() }).forEach(function (vote) {
        // This silly implementation is a workaround non-dying votes in the
        // deployment server.
        Votes.remove({ _id: vote._id });
      });
    }
  });

  Template.place.events({
    'click': function () {
      Votes.insert({ place: this._id, when: helpers.today() });
    }
  });

  Meteor.startup(function () {
    // Create the pie canvas.
    pie = new Pie({ canvasSelector: '#results-pie' });

    // Auto-redraw the canvas when votes change.
    Deps.autorun( function() {
      if (pie) {
        var places = _.map(Places.find({}).fetch(), function (place) {
          return {
            name: place.name,
            votes: Votes.find({ when: helpers.today(), place: place._id }).count()
          }
        });
        pie.draw(places);
      }
    });
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
    if (Votes.find().count() !== 0) {
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
