# Security Specification for Namma-HomeStay

## 1. Data Invariants
- A host profile can only be created by the authenticated user whose UID matches the document ID.
- A home-stay listing must have a valid `hostId` that matches the creator's UID.
- Only the creator (host) can update or delete their own home-stay listing.
- Price per night must be a positive number.
- Images must be valid URLs (strings).

## 2. The "Dirty Dozen" Payloads (Denial Expected)

1. **Identity Spoofing**: Attempt to create a host profile for a different UID.
2. **Shadow Field injection**: Adding `isAdmin: true` to a Host document.
3. **Ghost Listing**: Creating a listing with a `hostId` not matching the current user.
4. **Price Poisoning**: Setting `pricePerNight` to -100.
5. **Orphaned Write**: Creating a listing without an existing host profile (relational sync).
6. **State Hijacking**: Attempting to change the `hostId` of an existing listing.
7. **PII Leak**: Non-host user attempting to read the full `hosts` collection with private fields.
8. **Resource Exhaustion**: Sending a 1MB string for the listing `title`.
9. **Unauthenticated Write**: Creating a listing without being signed in.
10. **Malicious ID**: Using a special character string as a document ID to break path logic.
11. **Timestamp Spoofing**: Providing a client-side `createdAt` date from the future.
12. **Array Overload**: Sending 1000 items in the `foodMenu` to cause deserialization tax.

## 3. Test Runner (Draft)
The `firestore.rules` will be validated against these scenarios using helper functions.
