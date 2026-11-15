# Speed and phone-layout review
- [x] Fix clipped content on narrow phones across Home, Contests, Community, and Sheets.
- [x] Reuse contest and profile data during navigation instead of unnecessary repeat loading.
- [x] Verify main pages on phones and desktop, including signed-in navigation.

# Project website previews
- [x] Retrieve social images safely for saved website links.
- [x] Show previews on project cards and verify novixui.com signed in.

# Loading improvements
- [x] Keep account display across page/sidebar changes and distinguish pending sign-in from guests.
- [x] Prioritize and optimize visible images; recover stalled Codeforces pictures.
- [x] Verify signed-in navigation, images, and regression tests.

# Functionality audit and independent-hosting handoff
- [x] Run regression tests and signed-in checks across main pages and core actions.
- [x] Fix reproducible issues and verify the affected flows.
- [x] Deliver a Lovable-removal prompt with migration safeguards and clearly identify unverified services.

# Code cleanup (in order)
- [x] 1. Remove leftovers and limit the Design System page to admins.
- [ ] 2. Use one shared rating colour across pages.
- [ ] 3. Move all Codeforces lookups into one shared place.
- [ ] 4. Replace silently ignored errors with clear messages.
- [ ] 5. Split the largest pages into smaller sections.
- [ ] 6. Use theme colours instead of fixed colours; restore type checks.
- [ ] 7. Add tests for sign-in, Codeforces analysis, contests and sheets.
- [ ] 8. Connect or label the sample-data pages (Inbox, Notifications, Community, Mistakes).
