import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
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
    created_at : Time.Time;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      Principal.compare(p1.id, p2.id);
    };

    public func compareByCreatedAt(p1 : Profile, p2 : Profile) : Order.Order {
      Int.compare(p1.created_at, p2.created_at);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let profiles = Map.empty<Principal, Profile>();

  // Core user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Core profile management
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
      Runtime.trap("Unauthorized: Only users can create profiles");
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
      created_at = Time.now();
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
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let updated : Profile = {
          profile with
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
      Runtime.trap("Unauthorized: Only users can upload photos");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let updated : Profile = { profile with photo = ?photo };
        profiles.add(caller, updated);
      };
    };
  };

  public type Filters = {
    #level;
    #zone;
  };

  public query ({ caller }) func discoverCandidates(_filters : Filters) : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can discover candidates");
    };

    profiles.toArray().map(func((_, v)) { v });
  };
};
