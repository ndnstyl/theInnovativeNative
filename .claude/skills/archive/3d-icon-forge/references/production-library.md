# Production Icon Library — CHECK HERE FIRST

## Location
`/Users/makwa/theinnovativenative/remotion-videos/iconSet/`

## Rule
**Before baking any new icon, check this library first.** If a suitable match exists, use it. Do not generate duplicates.

## Techsy set (Style B — isometric chrome machine + blue translucent glass)
Path: `remotion-videos/iconSet/techsy/`
Format: 2000×2000 RGBA PNG with clean alpha, production-grade. ~2.8–3.1 MB each.

### 30 subjects available
| File | Meaning / when to use | Tag keywords |
|------|----------------------|--------------|
| `arrow.png` | Direction, CTA, "next step" | direction, navigate, forward, cta |
| `battery.png` | Power, energy, capacity | power, energy, capacity, charge |
| `bitcoin.png` | Crypto / payment / money | crypto, currency, money, payment |
| `blender.png` | Mixing, processing, transforming data | mix, process, combine, transform |
| `browser.png` | Web, site, online | web, internet, site, window |
| `card.png` | Payment, checkout, billing | payment, credit, checkout, billing |
| `cloud.png` | Cloud storage, SaaS, backup | storage, saas, server, backup |
| `computer.png` | Desktop, workstation | desktop, workstation, device, pc |
| `cooler.png` | Cooling, system, thermal | cool, fan, thermal, system |
| `donut.png` | Donut/pie chart, breakdown | chart, pie, analytics, breakdown |
| `ether.png` | Ethereum, DeFi | crypto, ethereum, defi |
| `files.png` | Documents, asset library | documents, assets, storage, library |
| `filter.png` | **Funnel / filter / lead qualification** | funnel, filter, refine, sort, qualify |
| `folder.png` | Organize, directory | organize, directory, storage, files |
| `graph.png` | Growth chart, analytics trend | chart, growth, analytics, metrics, trend |
| `heart.png` | Community, favorite, care | love, community, favorite, care |
| `icons.png` | Icon set / gallery (meta) | set, library, collection, gallery |
| `image.png` | Photo, media, visual content | photo, media, picture, visual |
| `message.png` | Chat, DM, communication | chat, communication, text, dm |
| `phone.png` | Mobile, call, device | mobile, call, device, contact |
| `pie.png` | Pie chart, segments | chart, analytics, breakdown, segments |
| `pin.png` | Location, map marker | location, map, marker, place |
| `pipe.png` | **Pipeline / workflow / n8n automation** | pipeline, workflow, flow, n8n, automation |
| `play.png` | Video, start, media launch | video, start, media, launch |
| `safe.png` | Security vault, database, protected storage | security, vault, database, storage, protect |
| `shield.png` | Security, protection, trust | security, protection, defense, trust |
| `star.png` | Favorite, rating, premium | favorite, rating, premium, featured |
| `trophy.png` | Success, achievement, win | success, achievement, win, outcome |
| `upload.png` | Submit, send, share | submit, send, share, export |
| `user.png` | Profile, account, person | profile, account, person, customer |

## Lookup pattern

```python
import json
idx = json.load(open('.claude/skills/3d-icon-forge/library/index.json'))

# By tag:
funnel_icons = [a for a in idx['assets'] if 'funnel' in a.get('tags', [])]
# → returns [filter.png entry]

# By subject:
shield = next(a for a in idx['assets'] if a['subject'] == 'shield')

# Only production-sourced (not baked):
prod = [a for a in idx['assets'] if a.get('source') == 'techsy-production']
```

## Usage in Remotion

```tsx
import { staticFile } from 'remotion';

// These files live OUTSIDE the Remotion project's public/ — symlink once:
// ln -s /Users/makwa/theinnovativenative/remotion-videos/iconSet ./public/iconSet

<Img src={staticFile('iconSet/techsy/filter.png')} />
```

## Coverage gaps (things to bake)
Of the Style B seed list, the production library already covers: shield, trophy, graph (chart-tower), safe (database), pipe (workflow-engine).

**Still need to bake for Style B:**
- `funnel` — production has `filter.png`, check if it's a close-enough substitute before baking
- `rocket-launching-upward`
- `brain-with-neural-network`
- `globe-with-orbiting-rings`
- `complex-gear-assembly`

**Styles A, C, D:** no production library yet — all seed-list items need to be baked.
