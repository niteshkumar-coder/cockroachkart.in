# Security Specification: CockroachKart Firestore Security

This security specification details the Attribute-Based Access Control (ABAC) protections established to isolate user profiles and protect customer orders from unauthorized modifications.

## 1. Data Invariants
1. A **User Profile** (/users/{userId}) can only be created and edited by the owner matching that specific `userId`.
2. A **User Profile** cannot have its identity spoofed (owner mapping matches authenticated client `uid`).
3. An **Order** (/users/{userId}/orders/{orderId}) belongs entirely to the active customer and can only be accessed/modified by that authenticated customer. No blanket indexing of orders is allowed.
4. **Timestamps** (`createdAt`, `updatedAt`) must strictly be tied to `request.time` (the server value).

## 2. The Dirty Dozen Payloads
Below are 12 malicious payloads that should be structurally locked:
1. **ID Poisoning**: Inject high-byte character string as `userId`.
2. **Identity Spoofing**: Registering user `bob` but assigning `ownerId = alice`.
3. **Ghost Fields injection**: Adding un-validated fields like `isAdmin: true` or `role: 'admin'`.
4. **Blanket Querying**: Requesting `/users` or all orders without constraints.
5. **PII Leakage**: Accessing another user's email or phone number.
6. **State short-circuiting**: Creating an order that is pre-set with status `shipped` or `completed` without payment confirmation.
7. **Temporal Violation**: Creating a resource with a forged client timestamp `createdAt = 2025-01-01`.
8. **Negative Total Value**: Posting an order with `total = -500`.
9. **Unauthenticated write**: Creating profile or orders without an active Firebase Auth user session.
10. **Email verification spoofing**: Claiming verified status without active token verification.
11. **Anonymity write bypass**: Executing key actions under unverified anonymous sessions.
12. **Double-spent / Mutation after completion**: Attempting to mutate an order status after it has been finalized.

## 3. Deployment Rules Draft
The security policies reside in `firestore.rules`.
