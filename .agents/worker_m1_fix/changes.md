# Changes Record

## File Modified
- `05_Systems/Database/db_engine.js`

## Modification Details
- Updated location matching logic within `matchBuyerCriteria` function (lines 175-181).
- Changed string trimming and case conversion for `criteria.preferred_location` (`buyerLoc`) and `lst.location` (`lstLoc`).
- Added check `buyerLoc.length > 0` before checking string inclusion (`lstLoc.includes(buyerLoc) || buyerLoc.includes(lstLoc)`).

## Rationale
- Previously, when `criteria.preferred_location` was empty (`""`), `buyerLoc` evaluated to `""`.
- In JavaScript, `lstLoc.includes("")` returns `true` for all non-null strings.
- This caused an erroneous +30 location score to be added to every listing when no preferred location was specified.
- The check `buyerLoc.length > 0` ensures location score is only awarded when a non-empty preferred location string is provided.

## Verification
- Executed `node 05_Systems/Database/test_db_engine.js` -> Passed 5/5.
- Executed `node .agents/challenger_m1_1/stress_test.js` -> Passed 28/28.
- Executed `powershell -ExecutionPolicy Bypass -File 05_Systems/Scripts/validate-zns.ps1` -> 0 non-compliant files.
