# EP-001 Prompt Revisions — Narrative-Enriched Visual Prompts

**Episode**: EP-001 — The Marathon Continues: Each One Teach One
**Purpose**: Side-by-side comparison of current vs. revised `visual_prompt` fields. Revised prompts anchor the image to what the narration actually describes, not generic settings.
**Process**: Review each row → Approve/Reject → Approved prompts merged into pipeline JSON (T029)
**Status**: ALL APPROVED — Merged into pipeline JSON on 2026-02-14

---

## Review Legend

- **GAP**: What the current prompt misses from the narration
- **Status**: `pending` | `approved` | `rejected` | `revised`

---

## Scene 1 — "Mama lost the house in oh-three."

| Field | Value |
|-------|-------|
| **Narration** | "Mama lost the house in oh-three." |
| **Current prompt** | Black screen fading into sodium vapor orange light bleeding through chain-link fence at night, rust orange glow on dark steel gray, cracked asphalt, empty urban lot, weeds through concrete. |
| **Gap** | No house. No foreclosure. No sense of a home being taken. Generic empty lot doesn't tell the story of losing a home. |
| **Revised prompt** | Boarded-up row house at night, plywood screwed over windows, faded foreclosure notice stapled to front door, overturned porch chair, forgotten child's shoe on cracked walkway, dead potted plant by steps, sodium vapor streetlight casting rust-orange light on facade. |
| **Status** | `approved` |

---

## Scene 2 — "Wasn't no warnin'. Just a letter. Then a lock on the door."

| Field | Value |
|-------|-------|
| **Narration** | "Wasn't no warnin'. Just a letter. Then a lock on the door. She went down south..." |
| **Current prompt** | Extreme close-up of heavy padlock and rusted chain on metal gate, peeling paint, faded eviction notice paper partially visible, sodium vapor streetlight overhead. |
| **Gap** | Current prompt is decent — padlock + eviction notice matches narration. Minor enhancement: add the letter/envelope element. |
| **Revised prompt** | Extreme close-up of heavy padlock and new chain on residential door handle, official eviction letter wedged in door jamb, envelope with county seal visible, peeling paint on door frame, sodium vapor streetlight casting harsh orange from above, shallow depth of field. |
| **Status** | `approved` |

---

## Scene 5 — "Library WiFi. Community center when they'd let me in."

| Field | Value |
|-------|-------|
| **Narration** | "Library WiFi. Community center when they'd let me in. Started readin' things I wasn't suppose to understan'. Tax codes. Lien laws. How credit actually work." |
| **Current prompt** | Pitch dark room, laptop open on worn wooden desk, screen casting bone-white glow onto desk surface and wall, papers and pen on desk in screen light. |
| **Gap** | Missing the library/community center context. Missing the specific documents being studied (tax codes, lien laws). Current is just a generic laptop-in-dark-room. |
| **Revised prompt** | Worn wooden desk in dark corner of public library after hours, laptop screen casting bone-white glow, IRS tax form and printed legal document visible on desk, hand-written notes on lined paper, library card beside laptop, stack of law books barely visible in shadow behind screen. |
| **Status** | `approved` |

---

## Scene 7 — "Ran workshops outta barbershops. Explained how to fight an eviction."

| Field | Value |
|-------|-------|
| **Narration** | "Tried to put folk on. Ran workshops outta barbershops. Explained how to fight an eviction. How to read a contract 'fore you sign your life away." |
| **Current prompt** | Red Nose Pitbull sitting upright (P1), 3/4 angle, looking off-frame, coveralls visible, urban decay background. |
| **Gap** | This is a character scene — the bg plate should reflect the workshop-in-barbershop setting, not generic "urban decay." The narration is about community education in barbershops. |
| **Revised prompt** | Barbershop converted to makeshift classroom, folding metal chairs in semicircle facing a whiteboard, handwritten notes on whiteboard reading "KNOW YOUR RIGHTS", photocopied handouts stacked on barber station counter, lease agreement pinned to mirror with tape, warm incandescent barbershop lighting. |
| **Status** | `approved` |

---

## Scene 13 — "You grow up where I grew up, you don't choose a side."

| Field | Value |
|-------|-------|
| **Narration** | "Wasn't no colors on me. But I knew everybody who wore 'em. You grow up where I grew up, you don't choose a side — you just live in the crossfire." |
| **Current prompt** | Urban street at night, chain-link fence, abandoned buildings, sodium vapor light pools on wet pavement. No humans. |
| **Gap** | Generic urban night. Missing the tension of living between factions — the "crossfire" feeling. Need visual evidence of territory, division. |
| **Revised prompt** | Urban intersection at night, two different graffiti tags on opposing walls of an alleyway entrance, sodium vapor light pooling on wet pavement between them, chain-link fence with torn fabric caught in wire, narrow walkway between tagged walls suggesting a path walked carefully, cracked pavement with old spray paint marks. |
| **Status** | `approved` |

---

## Scene 14 — "Some folk sold. Some folk used. I just watched."

| Field | Value |
|-------|-------|
| **Narration** | "The money was fast. The consequences was faster. I seen dudes go from Jordans to jumpsuits in the same summer." |
| **Current prompt** | Close-up of concrete stoop at night, empty bottles, cigarette butts, crumpled twenty-dollar bill. No humans. |
| **Gap** | Decent but misses the Jordans-to-jumpsuits metaphor — the speed of consequence. Could anchor to the evidence of quick money and quick loss. |
| **Revised prompt** | Concrete stoop at night, single expensive sneaker abandoned on top step, empty cash-counting band beside it, cigarette still smoldering in ashtray, court summons paper crumpled and discarded, sodium vapor light casting long shadows down the steps. |
| **Status** | `approved` |

---

## Scene 15 — "Check-cashin' on Fridays. Rent-to-own for a TV I couldn't afford."

| Field | Value |
|-------|-------|
| **Narration** | "Check-cashin' on Fridays. Rent-to-own for a TV I couldn't afford. No bank account 'cause nobody told me I needed one. Every dollar I earned went right back into somebody else's pocket." |
| **Current prompt** | Check-cashing storefront at night, neon 'CHECKS CASHED' sign, iron bars on windows, payday loan advertisements. No humans. |
| **Gap** | Current is solid. Minor enhancement: add rent-to-own signage and the "leak" metaphor — money flowing out. |
| **Revised prompt** | Check-cashing storefront at night, neon 'CHECKS CASHED' sign buzzing, iron security bars on windows, 'RENT-TO-OWN — NO CREDIT CHECK' poster in window, payday loan rate sheet taped to glass door, ATM fee notice ($3.50), receipts blowing across sidewalk in wind. |
| **Status** | `approved` |

---

## Scene 16 — "The system got plenty of folk who look like me."

| Field | Value |
|-------|-------|
| **Narration** | "The system got plenty of folk who look like me. Decided early it wasn't gonna get me." |
| **Current prompt** | Surveillance camera on a pole, chain-link fence below, urban overpass in background. Cold blue-white light. No humans. |
| **Gap** | Good match — surveillance = the system watching. Keep mostly as-is, strengthen the "system" metaphor. |
| **Revised prompt** | Multiple surveillance cameras on a single pole at urban intersection, chain-link fence with barbed wire below, concrete overpass in background, harsh cold blue-white floodlight from above, 'AREA UNDER 24HR VIDEO SURVEILLANCE' sign on fence, everything sterile and institutional. |
| **Status** | `approved` |

---

## Scene 18 — "That stolen laptop became a library. A law school. A business plan."

| Field | Value |
|-------|-------|
| **Narration** | "That stolen laptop became a library. A law school. A business plan. YGs think the goal is respect. Respect don't pay rent." |
| **Current prompt** | Close-up of laptop screen glowing in dark room, code or spreadsheet visible. Warm bone-white glow on worn desk. No humans. |
| **Gap** | Missing the transformation arc — laptop as education tool. Should show multiple tabs/windows suggesting breadth of self-education. |
| **Revised prompt** | Close-up of cracked laptop screen glowing in dark room, multiple browser tabs visible showing business plan template, legal document, and spreadsheet with dollar figures, sticky notes on screen bezel with handwritten reminders, worn desk surface with coffee ring stains, warm bone-white glow illuminating scattered notes. |
| **Status** | `approved` |

---

## Scene 19 — "Got to a point where it wasn't about me no more."

| Field | Value |
|-------|-------|
| **Narration** | "Family eatin' next month. Kids not repeatin' the same mistakes. Breakin' the cycle ain't a motivational poster — it's a Tuesday." |
| **Current prompt** | Empty kitchen table at dawn, two plates set out, child's drawing on refrigerator, coffee mug, warm morning light. No humans. |
| **Gap** | Current is strong — captures the domestic quiet of breaking cycles. Minor enhancement to anchor the "everyday grind" aspect. |
| **Revised prompt** | Kitchen table at dawn, two plates set with simple breakfast, child's crayon drawing of a house taped to refrigerator, packed school lunch bag on counter, coffee mug beside open notebook with budget written in pen, morning light through thin curtains, calendar on wall with bills-due dates circled. |
| **Status** | `approved` |

---

## Scene 20 — "Started runnin' workshops again. This time smarter."

| Field | Value |
|-------|-------|
| **Narration** | "Started runnin' workshops again. This time smarter. Smaller rooms. Folks who actually wanted to learn. Showed 'em how to read a lease. How to file a dispute." |
| **Current prompt** | Barbershop interior, vintage chair, mirrors, warm light, clippers on counter. Community feel. No humans. |
| **Gap** | No workshop evidence. No teaching materials. Just a generic barbershop. The narration describes workshops — educational materials, smaller intimate setting, practical financial documents. |
| **Revised prompt** | Barbershop converted to small workshop space, three folding chairs in tight semicircle, whiteboard propped against mirror reading 'HOW TO FILE A DISPUTE', photocopied lease agreements spread across barber counter, highlighter and pen on top of documents, warm incandescent light from vintage barbershop fixtures, clippers pushed aside to make room for handouts. |
| **Status** | `approved` |

---

## Scene 21 — "Everybody left at some point... But the dog never did."

| Field | Value |
|-------|-------|
| **Narration** | "Everybody left at some point. The homies. The family. The women... But the dog never did." |
| **Current prompt** | Red Nose Pitbull sitting on concrete stoop (P1), calm, present, single porch light. |
| **Gap** | Character scene — bg plate should convey abandonment/emptiness that contrasts with the dog's loyalty. Current bg is too generic. |
| **Revised prompt** | Empty concrete stoop at night, single bare porch light buzzing, two chairs but only one shows wear marks, ashtray with old cigarettes, faded welcome mat, dead plants in cracked pots, one window lit warmly from inside suggesting someone stayed, quiet street behind. |
| **Status** | `approved` |

---

## Scene 23 — "Ownership is everything. Own your mind, mind your own."

| Field | Value |
|-------|-------|
| **Narration** | "I started understandin' somethin'. Ownership is everything. Own your mind, mind your own. Don't wait for somebody to hand you a lane — lay your own brick." |
| **Current prompt** | Urban street corner at golden hour, small plaza with barbershop and clothing store, hand-painted signage, warm light on glass storefronts. No humans. |
| **Gap** | Decent match — shows Black-owned businesses. Enhance with more ownership signals: "OWNER" on door, community pride markers. |
| **Revised prompt** | Small urban commercial plaza at golden hour, barbershop with hand-lettered 'ESTABLISHED 2006' on glass, clothing store with 'BLACK OWNED' sticker in window, hand-painted murals on brick between storefronts, warm golden light on clean sidewalk, small sandwich board sign outside with hours written in marker. |
| **Status** | `approved` |

---

## Scene 25 — "Spoke some things into the universe and they appeared."

| Field | Value |
|-------|-------|
| **Narration** | "Spoke some things into the universe and they appeared... Vision without labor is just a daydream. But labor without vision? That's a prison." |
| **Current prompt** | Urban rooftop at sunrise, city skyline emerging from fog, warm golden light cutting through haze. No character. Contemplative vastness. |
| **Gap** | Current is strong for the spiritual/visionary tone. No changes needed — the vastness matches the universe metaphor. |
| **Revised prompt** | *(No revision needed — current prompt matches narration well)* |
| **Status** | `approved` |

---

## Scene 26 — "We playin' the long game. Not the quick flip."

| Field | Value |
|-------|-------|
| **Narration** | "We playin' the long game... The kind of wealth they can't foreclose on, can't repo, can't delete with an algorithm." |
| **Current prompt** | Railroad tracks stretching into golden distance, converging at vanishing point. Warm light. Historical weight but hopeful. |
| **Gap** | Strong metaphor — long road, vanishing point = long game. No changes needed. |
| **Revised prompt** | *(No revision needed — current prompt matches narration well)* |
| **Status** | `approved` |

---

## Scene 28 — "The highest thing you can do is inspire."

| Field | Value |
|-------|-------|
| **Narration** | "The highest thing you can do is inspire... Light somethin' inside somebody that don't go out when you leave the room. Luck is just bein' prepared when the door opens." |
| **Current prompt** | Community garden in urban lot, raised beds with vegetables, hand-painted sign, late afternoon golden light. No humans. |
| **Gap** | Garden = community growth, which connects to inspiration. Strengthen with more "growth from nothing" visual metaphors. |
| **Revised prompt** | Community garden in formerly empty urban lot, raised beds with vegetables growing through chain-link fence border, hand-painted sign reading 'COMMUNITY PLOT — TAKE WHAT YOU NEED', single sunflower taller than the fence, late afternoon golden light casting long shadows, freshly turned soil in new beds being prepared. |
| **Status** | `approved` |

---

## Scene 31 — "South Carolina, 1740 — made it illegal to teach a slave to write."

| Field | Value |
|-------|-------|
| **Narration** | "There's a proverb... South Carolina, 1740 — made it illegal to teach a slave to write. Virginia. Alabama. Same laws. Same fear. They knew if we could read, we could think." |
| **Current prompt** | Dark interior, warm candlelight on rough wooden surface, old book, historical feel. Reverent warmth, not literal slavery imagery. |
| **Gap** | Good approach — reverent, not exploitative. Enhance with more specific historical education artifacts. |
| **Revised prompt** | Dark interior lit by single candle on rough-hewn wooden table, leather-bound book open to handwritten pages, quill pen and dried ink beside it, letters scratched into the wooden table surface, warm amber candlelight creating intimate glow, reverent and quiet, historical weight without exploitation. |
| **Status** | `approved` |

---

## Scene 32 — "Each one teach one. That's how knowledge survived."

| Field | Value |
|-------|-------|
| **Narration** | "They passed knowledge in secret. Whispered lessons in the fields. Scratched letters in the dirt. Each person who learned turned around and taught another." |
| **Current prompt** | Close-up of open book pages in warm light, dust motes floating, time and weight. |
| **Gap** | Missing the "scratched letters in the dirt" and the secret/clandestine element. Should feel like forbidden knowledge being preserved. |
| **Revised prompt** | Extreme close-up of aged open book, yellowed pages with faded handwritten text, another hand's annotations in margins, dust motes caught in warm amber light beam, wax seal partially visible on page edge, surface beneath book is rough dirt floor with finger-drawn letters visible, reverent candlelight atmosphere. |
| **Status** | `approved` |

---

## Scene 34 — "That's what this channel is. A barbershop workshop that never closes."

| Field | Value |
|-------|-------|
| **Narration** | "That's what this channel is. A barbershop workshop that never closes. Each one teach one — but louder. Not a course. Not a brand deal. Not a rented Lamborghini in the thumbnail." |
| **Current prompt** | Red Nose Pitbull standing at urban intersection at dawn (P2 low angle), first morning light catching copper coat, empty street behind. |
| **Gap** | Character scene — bg plate should reflect the "barbershop workshop" and "dawn of something new" energy. Not just a generic intersection. |
| **Revised prompt** | Urban intersection at dawn, barbershop on corner with lights still on inside from a late-night session, whiteboard visible through window, 'OPEN' sign still lit, first morning light breaking over rooftops, fresh wheat-paste poster on utility pole, empty street with sense of possibility, warm dawn colors breaking through dark steel sky. |
| **Status** | `approved` |

---

## Scene 35 — "This ain't fear. Ain't hype. Ain't motivation that wear off by Wednesday."

| Field | Value |
|-------|-------|
| **Narration** | "This is what I know. Delivered how I know it. In the voice I grew up with. For the people nobody else is talkin' to." |
| **Current prompt** | Urban street at night, boarded-up storefronts with faded signs, streetlight casting orange pool on wet pavement. No humans. |
| **Gap** | Generic urban decay. Should feel more like "the place nobody talks to" — underserved, overlooked, but real. |
| **Revised prompt** | Urban street at night, row of storefronts — one boarded up, one with faded 'GOING OUT OF BUSINESS' sign, one with hand-painted 'WE'RE STILL HERE' on plywood, single working streetlight casting orange pool on wet pavement, bus stop with no bench just a pole and sign, real and unglamorous. |
| **Status** | `approved` |

---

## Scene 37 — "So let's talk about what you can own. Startin' from nothin'."

| Field | Value |
|-------|-------|
| **Narration** | "So let's talk about what you can own. Startin' from nothin'. No trust fund. No connections. No degree required." |
| **Current prompt** | Red Nose Pitbull sitting upright on concrete stoop (P1), 3/4 angle, looking off-frame right. Alert, composed, about to teach. |
| **Gap** | Character scene — bg plate needs to shift energy from story to teaching. Should feel like a classroom/lecture setup, a pivot moment. |
| **Revised prompt** | Concrete stoop transformed into teaching perch, worn steps with notebook and pen left on top step, hand-chalked '5 THINGS' on sidewalk pavement below, warm streetlight overhead casting circle of light like a spotlight, dawn light starting to appear on horizon behind buildings, energy shifting from night to morning. |
| **Status** | `approved` |

---

## Scene 38 — "A barber in my neighborhood been cuttin' hair forty years."

| Field | Value |
|-------|-------|
| **Narration** | "A barber in my neighborhood been cuttin' hair forty years. Ain't never worried about a robot takin' his chair. Know why? 'Cause people don't sit in his chair for the haircut. They sit there for the conversation." |
| **Current prompt** | Barbershop interior, vintage chair center frame, mirrors reflecting warm light, clippers and tools on counter. No humans. |
| **Gap** | Missing 40 years of history. No evidence of decades of community. Generic barbershop vs. a place with deep roots. |
| **Revised prompt** | Decades-old barbershop interior, worn leather chair polished smooth from forty years of use, wall covered in faded photographs from different eras — polaroids mixed with newer prints, hand-lettered 'SINCE 1984' sign above mirror, community service awards and framed newspaper clippings on wall, straight razor on folded towel, talc powder tin with vintage label, warm golden light from fixtures that haven't changed in decades. |
| **Status** | `approved` |

---

## Scene 39 — "A dude who started sellin' plates outta his mama kitchen."

| Field | Value |
|-------|-------|
| **Narration** | "I know a dude who started sellin' plates outta his mama kitchen. Now he got two food trucks and a catering contract with the city." |
| **Current prompt** | Food truck at night, serving window lit with warm light, hand-painted menu board, steam rising from grill. Urban parking lot. No humans. |
| **Gap** | Current is solid but could better show the growth from mama's kitchen to food trucks. Add "fleet" evidence. |
| **Revised prompt** | Two food trucks parked side by side in urban lot at night, both with matching hand-painted branding, serving windows lit with warm light, steam rising from grills, hand-painted menu board with home-style food items, catering-size aluminum pans stacked near truck, city permit sticker visible on window, warm entrepreneurial energy. |
| **Status** | `approved` |

---

## Scene 41 — "Number four. A rental arrangement."

| Field | Value |
|-------|-------|
| **Narration** | "I'm talkin' about rentin' somethin' you control. A room. A parkin' spot. A storage unit you lease to somebody else." |
| **Current prompt** | Urban apartment building exterior, fire escape ladders, 'FOR RENT' sign in window, early morning light. Brick facade, concrete sidewalk. No humans. |
| **Gap** | Current is reasonable. Enhance with more "small-scale leverage" signals rather than just a big apartment building. |
| **Revised prompt** | Small urban property at early morning, hand-written 'ROOM FOR RENT' sign in ground-floor window, separate 'PARKING — $75/MO' sign on chain-link fence around small lot, storage unit row visible in background with padlocks, brick building with fire escape, modest but controlled — evidence of small-scale ownership generating income. |
| **Status** | `approved` |

---

## Scene 42 — "Community equity. When your name mean somethin' on your block."

| Field | Value |
|-------|-------|
| **Narration** | "When your name mean somethin' on your block — when people trust you, send they kids to you, call you first when somethin' need fixin' — that's equity." |
| **Current prompt** | Community garden in urban lot, raised wooden beds with vegetables, chain-link fence, hand-painted sign, late afternoon golden light. No humans. |
| **Gap** | Garden is fine but doesn't capture the "your name means something" aspect — community trust, being the go-to person. Need more community institution signals. |
| **Revised prompt** | Small urban plaza at late afternoon golden hour, community bulletin board covered in thank-you notes and event flyers, barbershop with 'COMMUNITY MEETING TONIGHT' sign in window, children's basketball hoop mounted on utility pole, hand-painted mural on brick wall depicting neighborhood history, sense of a place where everyone knows your name. |
| **Status** | `approved` |

---

## Scene 46 — "The hood already taught me what survival look like."

| Field | Value |
|-------|-------|
| **Narration** | "The hood already taught me what survival look like... AI just made it urgent for everybody else. Each one teach one. The marathon continues. Pay attention." |
| **Current prompt** | Red Nose Pitbull sitting still at rooftop edge (P4), silhouette against pre-dawn sky, city lights fading as first light appears on horizon. |
| **Gap** | Character scene — bg plate should capture the rooftop-at-dawn closing shot. Current description is strong for the silhouette moment. Minor enhancement. |
| **Revised prompt** | Urban rooftop at pre-dawn, city skyline with lights beginning to fade as first warm light appears on eastern horizon, concrete ledge at roof edge, scattered evidence of someone spending time here — empty coffee cup, notebook, the remnants of a late night of thinking, sky transitioning from dark steel to warm dawn orange, vastness and possibility. |
| **Status** | `approved` |

---

## Summary

| Status | Count |
|--------|-------|
| Scenes needing revision | 22 |
| Already approved (no change needed) | 2 (Scenes 25, 26) |
| Scenes not applicable (remotion/transition/reuse) | 23 |
| **Total scenes in pipeline** | 47 |
