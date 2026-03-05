import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Registration Type
  public type Registration = {
    // Section 1: Personal Information
    fullName : Text;
    dateOfBirth : Text;
    age : Nat;
    address : Text;
    contactNumber : Text;
    emergencyContactName : Text;
    emergencyContactPhone : Text;
    // Section 2: Physical/Background
    height : Float;
    weight : Float;
    bust : Float;
    waist : Float;
    hips : Float;
    educationLevel : Text;
    occupationOrSchool : Text;
    hobbiesInterests : Text;
    talentSkills : Text;
    previousPageantExperience : Text;
    // Section 3: Media
    headshotBlob : ?Storage.ExternalBlob;
    fullBodyPhotoBlob : ?Storage.ExternalBlob;
    bioPlatformStatement : Text;
    // Timestamp or unique identifier for admin retrieval
    timestamp : Int;
  };

  module Registration {
    public func compareByTimestamp(a : Registration, b : Registration) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type RegistrationId = Nat;

  // Storage for registrations
  let registrations = Map.empty<RegistrationId, Registration>();
  var nextRegistrationId : RegistrationId = 0;

  // Public function - no authorization needed (anyone can submit)
  public shared ({ caller }) func submitRegistration(registration : Registration) : async RegistrationId {
    let currentId = nextRegistrationId;
    let newRegistration : Registration = {
      registration with timestamp = currentId; // Use id as timestamp
    };
    registrations.add(currentId, newRegistration);
    nextRegistrationId += 1;
    currentId;
  };

  // Admin-only function
  public query ({ caller }) func getAllRegistrations() : async [Registration] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registrations");
    };
    registrations.values().toArray();
  };

  // Admin-only function
  public query ({ caller }) func getRegistration(registrationId : RegistrationId) : async Registration {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registrations");
    };
    switch (registrations.get(registrationId)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) { registration };
    };
  };

  // Admin-only function
  public query ({ caller }) func getAllRegistrationsSortedByTimestamp() : async [Registration] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registrations");
    };
    registrations.values().toArray().sort(Registration.compareByTimestamp);
  };
};
