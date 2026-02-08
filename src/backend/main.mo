import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  public type Level = { #one; #two; #three; #four; #five };
  public type Position = { #drive; #reves };
  public type Zone = Text;

  module Level {
    public func compare(l1 : Level, l2 : Level) : Order.Order {
      let toInt = func(l : Level) : Int {
        switch (l) { case (#one) { 1 }; case (#two) { 2 }; case (#three) { 3 }; case (#four) { 4 }; case (#five) { 5 } };
      };
      Int.compare(toInt(l1), toInt(l2));
    };
  };

  public type Profile = {
    id : Principal;
    name : Text;
    photo : ?Storage.ExternalBlob;
    age : Nat;
    level : Level;
    position : Position;
    zone : Zone;
    availability : [Text];
    matchesPlayed : Nat;
    wins : Nat;
    bio : Text;
    createdAt : Time.Time;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      Principal.compare(p1.id, p2.id);
    };

    public func compareByCreatedAt(p1 : Profile, p2 : Profile) : Order.Order {
      Int.compare(p1.createdAt, p2.createdAt);
    };
  };

  public type Like = {
    from : Principal;
    to : Principal;
  };

  module Like {
    public func compare(l1 : Like, l2 : Like) : Order.Order {
      switch (Principal.compare(l1.from, l2.from)) {
        case (#equal) { Principal.compare(l1.to, l2.to) };
        case (order) { order };
      };
    };
  };

  public type Match = {
    user1 : Principal;
    user2 : Principal;
    createdAt : Time.Time;
  };

  module Match {
    public func compare(m1 : Match, m2 : Match) : Order.Order {
      switch (Principal.compare(m1.user1, m2.user1)) {
        case (#equal) { Principal.compare(m1.user2, m2.user2) };
        case (order) { order };
      };
    };
  };

  public type ChatMessage = {
    sender : Principal;
    recipient : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  module ChatMessage {
    public func compare(c1 : ChatMessage, c2 : ChatMessage) : Order.Order {
      switch (Principal.compare(c1.sender, c2.sender)) {
        case (#equal) {
          switch (Principal.compare(c1.recipient, c2.recipient)) {
            case (#equal) { Text.compare(c1.content, c2.content) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  public type Filters = {
    levelMin : Level;
    levelMax : Level;
    zone : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let profiles = Map.empty<Principal, Profile>();
  let likes = Set.empty<Like>();
  let matches = Set.empty<Match>();
  let messages = Set.empty<ChatMessage>();

  public shared ({ caller }) func createProfile(
    name : Text,
    age : Nat,
    level : Level,
    position : Position,
    zone : Zone,
    availability : [Text],
    bio : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create profiles");
    };

    if (profiles.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };

    let profile : Profile = {
      id = caller;
      name;
      photo = null;
      age;
      level;
      position;
      zone;
      availability;
      matchesPlayed = 0;
      wins = 0;
      bio;
      createdAt = Time.now();
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(
    name : Text,
    age : Nat,
    level : Level,
    position : Position,
    zone : Zone,
    availability : [Text],
    bio : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update profiles");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?existing) {
        let updated : Profile = {
          existing with
          name;
          age;
          level;
          position;
          zone;
          availability;
          bio;
        };
        profiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func uploadPhoto(photo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload photos");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?existing) {
        let updated : Profile = { existing with photo = ?photo };
        profiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func likeUser(target : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can like other users");
    };

    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot like yourself");
    };

    switch (profiles.get(target)) {
      case (null) { Runtime.trap("Target profile does not exist") };
      case (_) {
        likes.add({ from = caller; to = target });

        switch (likes.contains({ from = target; to = caller })) {
          case (true) {
            matches.add({
              user1 = caller;
              user2 = target;
              createdAt = Time.now();
            });
            true;
          };
          case (false) { false };
        };
      };
    };
  };

  func areUsersMatched(user1 : Principal, user2 : Principal) : Bool {
    matches.toArray().any(
      func(m) {
        (m.user1 == user1 and m.user2 == user2) or (m.user1 == user2 and m.user2 == user1);
      }
    );
  };

  public query ({ caller }) func getMatches() : async [Match] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view matches");
    };

    let userMatches = matches.toArray().filter(
      func(m) {
        m.user1 == caller or m.user2 == caller;
      }
    );
    userMatches;
  };

  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };

    let hasMatch = matches.toArray().any(
      func(m) {
        (m.user1 == caller and m.user2 == recipient) or (m.user1 == recipient and m.user2 == caller);
      }
    );
    if (not hasMatch) { Runtime.trap("No match found - can only message matched users") };

    messages.add({
      sender = caller;
      recipient;
      content;
      timestamp = Time.now();
    });
  };

  public query ({ caller }) func getChat(recipient : Principal) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view chats");
    };

    let hasMatch = matches.toArray().any(
      func(m) {
        (m.user1 == caller and m.user2 == recipient) or (m.user1 == recipient and m.user2 == caller);
      }
    );
    if (not hasMatch) { Runtime.trap("No match found - can only view chats with matched users") };

    messages.toArray().filter(
      func(msg) {
        (msg.sender == caller and msg.recipient == recipient) or (msg.sender == recipient and msg.recipient == caller);
      }
    );
  };

  public query ({ caller }) func discoverCandidates(filters : Filters) : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can discover candidates");
    };

    profiles.values().toArray().filter(
      func(profile) {
        not Principal.equal(profile.id, caller)
        and (Level.compare(profile.level, filters.levelMin) != #less and Level.compare(profile.level, filters.levelMax) != #greater)
        and Text.equal(profile.zone, filters.zone)
      }
    );
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    let isSelf = caller == user;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let hasMatch = areUsersMatched(caller, user);

    if (not isSelf and not isAdmin and not hasMatch) {
      Runtime.trap("Unauthorized: Can only view your own profile, admin view, or with existing match");
    };

    profiles.get(user);
  };

  public query ({ caller }) func getOwnProfile() : async Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };
  };
};
