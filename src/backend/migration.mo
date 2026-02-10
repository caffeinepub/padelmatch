import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type OldLevel = { #one; #two; #three; #four; #five };

  type OldProfile = {
    id : Principal;
    name : Text;
    photo : ?Storage.ExternalBlob;
    age : Nat;
    level : OldLevel;
    position : { #drive; #reves };
    zone : Text;
    availability : [Text];
    matchesPlayed : Nat;
    wins : Nat;
    bio : Text;
    created_at : Time.Time;
  };

  type OldActor = {
    profiles : Map.Map<Principal, OldProfile>;
  };

  type NewCategory = {
    #first;
    #second;
    #third;
    #fourth;
    #fifth;
    #sixth;
    #seventh;
  };

  type NewProfile = {
    id : Principal;
    name : Text;
    photo : ?Storage.ExternalBlob;
    age : Nat;
    category : NewCategory;
    position : { #drive; #reves };
    zone : Text;
    availability : [Text];
    matchesPlayed : Nat;
    wins : Nat;
    bio : Text;
    created_at : Time.Time;
  };

  type NewActor = {
    profiles : Map.Map<Principal, NewProfile>;
  };

  func convertLevelToCategory(oldLevel : OldLevel) : NewCategory {
    switch (oldLevel) {
      case (#one) { #first };
      case (#two) { #second };
      case (#three) { #third };
      case (#four) { #fourth };
      case (#five) { #fifth };
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProfiles = old.profiles.map<Principal, OldProfile, NewProfile>(
      func(_id, oldProfile) {
        let category = convertLevelToCategory(oldProfile.level);
        {
          oldProfile with
          category;
        };
      }
    );
    { profiles = newProfiles };
  };
};
