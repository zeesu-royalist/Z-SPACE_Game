# Z-SPACE --- Game Design & Technical Documentation

**Document purpose:** Product vision, gameplay rules, technical
architecture, folder structure, and phased implementation plan for the
first playable version of Z-SPACE.

**Project type:** 3D casual space-exploration game\
**Target platforms:** Desktop/laptop browsers and mobile browsers\
**Development approach:** Build a small playable prototype first, then
expand it in independent modules\
**Primary audience:** Beginner game developer building with React and
AI-assisted coding

------------------------------------------------------------------------

## 1. Project overview

### 1.1 Game concept

**Z-SPACE** is a simple 3D space-exploration game. The player controls
an astronaut who travels from Earth to the Moon in a spaceship.

The central gameplay challenge is **fuel planning and navigation**:

1.  The player chooses how much fuel to load before launch.
2.  The player must carry enough fuel to travel from Earth to the Moon.
3.  The player must reserve enough fuel for the return journey to Earth.
4.  After landing, the astronaut can leave the spaceship and explore the
    Moon on foot.
5.  A lunar rover/space vehicle is available for faster exploration. It
    uses less energy/fuel per kilometre than the spaceship.
6.  The player must find their way back to the landing site. A
    navigation arrow points towards the ship or the next objective.
7.  Taking a longer route, getting lost, or exploring too far can
    consume the player's return reserve and make the return journey
    harder.

The first version should feel like a small, enjoyable 3D adventure---not
a realistic space-flight simulator.

### 1.2 Core design principles

-   **Easy to understand:** The player should understand fuel, distance,
    and return requirements without doing difficult calculations.
-   **Exploration first:** Let the player walk around, discover
    locations, and enjoy the Moon environment.
-   **Meaningful decisions:** Fuel choices should matter, but the game
    should not punish beginners unfairly.
-   **Small and modular:** Earth, Moon, astronaut, spaceship, rover,
    navigation, and fuel systems should be separate modules.
-   **Expandable:** New planets, missions, vehicles, upgrades, and
    gameplay systems should be addable without rewriting the core.
-   **Responsive:** Support keyboard/mouse on desktop and touch controls
    on mobile.
-   **UI can evolve:** Use a clean, basic UI for the prototype. Do not
    lock the project into a final visual design yet.

------------------------------------------------------------------------

## 2. First release scope

### 2.1 Included in the first playable version

-   One playable astronaut character.
-   One spaceship.
-   Earth as the starting location.
-   One Moon environment.
-   A simple pre-launch fuel selection screen.
-   A fuel calculator using easy, predefined game values.
-   A launch and space-travel sequence.
-   A Moon landing sequence.
-   Astronaut movement on the Moon.
-   A lunar rover that the astronaut can enter, drive, and exit.
-   A return-to-ship navigation arrow.
-   A return mission from the Moon to Earth.
-   Fuel warnings, success/failure states, and a simple mission summary.
-   Basic responsive controls for desktop and mobile.

### 2.2 Not included in the first release

Keep these out of the first version unless the basic game is already
stable:

-   Mars or other planets.
-   Multiplayer or online accounts.
-   Realistic orbital mechanics, gravity simulation, or real NASA flight
    calculations.
-   Complex vehicle damage systems.
-   Crafting, inventory, trading, or resource mining.
-   Large procedural open worlds.
-   Complex quests, NPCs, or combat.
-   Realistic oxygen/pressure simulation.
-   Advanced graphics settings or a large settings menu.

These can be considered later as separate features.

------------------------------------------------------------------------

## 3. Main gameplay loop

The intended gameplay loop is:

1.  **Prepare on Earth:** The player starts near the spaceship.
2.  **Choose destination:** In the first version, the destination is the
    Moon.
3.  **Plan fuel:** The game displays the estimated outbound fuel, return
    reserve, and recommended safety buffer.
4.  **Load fuel:** The player selects a fuel quantity within the
    spaceship's tank capacity.
5.  **Launch:** The spaceship takes off and follows a controlled travel
    sequence.
6.  **Travel to the Moon:** Show a short space-flight scene or
    transition. The game consumes the planned outbound fuel.
7.  **Land:** The player lands at a designated lunar landing zone.
8.  **Explore:** The astronaut exits the spaceship and explores the
    Moon.
9.  **Use the rover:** The player can enter the rover to travel farther
    using less energy per kilometre than walking or spaceship travel.
10. **Return to the landing site:** A navigation arrow points towards
    the spaceship. The player can follow it or explore without it.
11. **Prepare for departure:** The game checks that enough return fuel
    remains.
12. **Return to Earth:** The spaceship travels back to Earth.
13. **Mission result:** Show whether the player completed the mission,
    how much fuel was used, distance explored, and any bonus
    achievements.

The player should always be able to see the next useful action, but
should still be free to explore.

------------------------------------------------------------------------

## 4. World and game areas

Organise the world as separate scenes/areas rather than putting
everything into one huge component.

### 4.1 Earth area

**Purpose:** Starting area and mission preparation.

Contains:

-   Earth environment or a simplified launch location.
-   Spaceship parked at the launch area.
-   Astronaut spawn point.
-   Launch interaction point.
-   Fuel planning panel.
-   Mission start interaction.

For the first prototype, Earth can be a small 3D launch pad rather than
a complete open world.

### 4.2 Space travel area

**Purpose:** Represent travel between Earth and the Moon.

Contains:

-   Star background.
-   Earth and Moon visible at appropriate points.
-   Spaceship travel animation.
-   Travel progress indicator.
-   Fuel consumption display.
-   Optional simple events such as a small navigation correction.

This does not need real 3D orbital physics. A controlled animation or
movement along a predefined route is enough.

### 4.3 Moon area

**Purpose:** Main exploration area in the first version.

Contains:

-   Lunar terrain.
-   Landing zone.
-   Spaceship landing position.
-   Astronaut spawn position near the spaceship.
-   Lunar rover and rover parking position.
-   A few visible landmarks, such as a crater, rock formation, or
    research station.
-   A return-to-ship navigation target.

Start with a small explorable area. Expand the terrain only after
movement, camera, rover, and navigation work correctly.

### 4.4 Future areas

Later, add Mars and other destinations as independent world modules. A
new planet should provide its own environment, spawn points, landmarks,
mission configuration, and optional local vehicles.

Do not create a separate copy of the entire game logic for every planet.

------------------------------------------------------------------------

## 5. Fuel system and simple game maths

### 5.1 Important rule

Z-SPACE uses **game-balanced fuel units**, not real-world rocket fuel
physics. Do not implement rocket equations, orbital mechanics, or
complex physics for the first version.

The player should make a clear decision using simple numbers.

### 5.2 Fuel terminology

-   **Tank capacity:** Maximum fuel the spaceship can carry.
-   **Outbound fuel:** Fuel needed to travel from Earth to the Moon.
-   **Return reserve:** Fuel that must remain available for the
    Moon-to-Earth journey.
-   **Safety buffer:** Extra fuel kept for small detours or mistakes.
-   **Available exploration fuel:** Any fuel/energy budget that can be
    spent without using the required return reserve.

### 5.3 Example balancing values

These are initial prototype values only. Keep them in a central
configuration file so they can be tuned without editing gameplay code.

  Setting                                         Example value
  ------------------------------ ------------------------------
  Spaceship tank capacity                        200 fuel units
  Earth → Moon                                    70 fuel units
  Moon → Earth                                    55 fuel units
  Recommended safety buffer                       15 fuel units
  Rover energy per kilometre                             1 unit
  Walking energy per kilometre     0 units in the first version

With these example values:

-   Outbound journey: 70 units.
-   Required return reserve: 55 units.
-   Recommended safety buffer: 15 units.
-   Recommended starting fuel: 140 units.
-   Tank capacity: 200 units.

The game can show a recommendation of 140 units, while allowing the
player to choose another amount. If the player loads less than the
required round-trip amount, show a clear warning before launch.

**Important:** The exact values are for gameplay balancing. They are not
real-world measurements.

### 5.4 Simple fuel formulas

Use simple addition and subtraction:

``` js
const requiredFuel =
  outboundFuel + returnFuel + safetyBuffer;

const canCompleteRoundTrip =
  selectedFuel >= requiredFuel;
```

After the outbound journey:

``` js
const fuelAfterOutbound =
  selectedFuel - outboundFuel;
```

Before returning:

``` js
const canReturn =
  fuelAfterOutbound >= returnFuel;
```

For the rover:

``` js
const roverEnergyUsed =
  distanceTravelledKm * roverEnergyPerKm;
```

In the first version, rover energy can be a separate battery/energy
meter rather than being subtracted from spaceship fuel. This makes the
systems easier to understand and avoids accidentally using the return
reserve.

### 5.5 Protect the return reserve

The game should clearly distinguish between:

-   Fuel that is safe to spend.
-   Fuel reserved for the return trip.

The UI can display:

-   Current fuel.
-   Return fuel required.
-   Safe-to-use fuel.
-   A warning when current fuel approaches the return requirement.

Do not silently allow the player to spend the return reserve. If the
player chooses to do so, make the risk clear and let the mission enter a
low-fuel or stranded state.

### 5.6 Avoid fuel-calculation duplication

Create one fuel service/module that owns the calculations. UI components
should call that module rather than implementing their own formulas.

For example:

``` js
calculateRequiredFuel(mission)
calculateFuelAfterTravel(currentFuel, travelCost)
canStartMission(selectedFuel, mission)
canReturnToEarth(currentFuel, mission)
calculateRoverEnergy(distance, roverConfig)
```

Keep these functions pure where possible: same input should always
produce the same output.

------------------------------------------------------------------------

## 6. Navigation and getting lost

### 6.1 Navigation arrow

During Moon exploration, display a simple arrow/compass indicator near
the top of the screen.

The arrow should point towards the spaceship or the current objective.

For the first version:

-   The target is the spaceship's landing position.
-   The arrow updates as the player moves.
-   A distance label can show how far away the ship is.
-   When the player reaches the ship, show an interaction prompt.
-   If the player is already close to the ship, hide or soften the
    arrow.

### 6.2 Simple navigation implementation

Do not build a complicated GPS or pathfinding system initially.

Use the player's position and the target's position:

1.  Read the player's world position.
2.  Read the target's world position.
3.  Calculate the direction from player to target.
4.  Rotate the arrow to face that direction.
5.  Calculate the distance and display it.

Three-dimensional direction calculations can be handled with Three.js
vectors. Keep this logic in a dedicated navigation utility or hook, not
inside the main game component.

For a first prototype, the arrow can point directly towards the ship
even if a crater or rock is between the player and the ship.
Obstacle-aware pathfinding can be a future feature.

### 6.3 Optional navigation difficulty

Add these gradually:

-   **Easy:** Arrow is always visible.
-   **Normal:** Arrow is visible, but distance updates only
    periodically.
-   **Challenge:** Arrow can be disabled; the player must use landmarks.

Do not implement all modes in the first milestone. A permanently visible
arrow is enough.

------------------------------------------------------------------------

## 7. Astronaut and movement

### 7.1 Astronaut responsibilities

The astronaut module should own:

-   Character model.
-   Character animations.
-   Walking/running movement.
-   Rotation and facing direction.
-   Ground detection or basic collision.
-   Spawn position.
-   Interaction state (on foot, entering rover, exiting rover).

### 7.2 Controls

**Desktop/laptop:**

-   `W` / `Arrow Up`: Move forward.
-   `S` / `Arrow Down`: Move backward.
-   `A` / `Arrow Left`: Move left.
-   `D` / `Arrow Right`: Move right.
-   Mouse: Rotate camera, if enabled.
-   `E`: Interact / enter or exit rover / use nearby object.
-   `Shift`: Run, if running is enabled.

**Mobile:**

-   On-screen movement joystick.
-   Drag area for camera rotation.
-   Contextual action button for interaction.
-   Optional run button.

Keep control mapping in one place so it can be changed later.

### 7.3 Beginner-friendly movement

Start with simple movement on a mostly flat lunar surface. Do not
attempt realistic low-gravity character physics initially.

A lightweight moon-gravity feel can be added later through slower
movement, longer jumps, and animation timing. It should not make basic
controls frustrating.

------------------------------------------------------------------------

## 8. Lunar rover

### 8.1 Purpose

The rover lets the astronaut explore farther across the Moon more
quickly than walking.

### 8.2 First-version features

-   Rover is parked near the spaceship.
-   Player approaches it and presses the interaction button.
-   Astronaut enters the rover.
-   Rover movement controls become active.
-   A rover energy/battery meter is displayed.
-   Player can exit the rover.
-   Rover stays where the player left it.

### 8.3 Rover energy

Use a separate, simple energy system:

``` js
const energyUsed = distanceTravelledKm * energyPerKm;
```

The rover should consume less energy per kilometre than the spaceship's
travel cost. Walking can have no fuel cost in the first version, or a
small stamina cost in a later update.

The rover's battery must not consume the spaceship's return fuel.

### 8.4 Future rover upgrades

Possible future additions:

-   Better battery.
-   Higher speed.
-   Larger storage.
-   Headlights.
-   Map/waypoint display.

------------------------------------------------------------------------

## 9. Spaceship and travel

### 9.1 Spaceship responsibilities

The spaceship module should own:

-   Spaceship model.
-   Parked state.
-   Launch state.
-   Travel animation.
-   Landing animation.
-   Fuel display data.
-   Interaction point for entering/launching.
-   Current location/mission state.

### 9.2 Travel simulation

For the first version, use a predefined travel duration and animation.
For example:

-   Launch animation.
-   Short travel transition.
-   Arrival animation.
-   Landing sequence.

Fuel is deducted using the mission configuration, not by simulating real
rocket-engine physics frame by frame.

### 9.3 Prevent invalid travel

Before launch or return:

-   Check the current game state.
-   Check that the player is at the spaceship.
-   Check the required fuel.
-   Prevent repeated launch clicks while a launch is already in
    progress.
-   Show a clear message if fuel is insufficient.

------------------------------------------------------------------------

## 10. Game states

Use a clear state model to prevent unrelated components from changing
the mission in conflicting ways.

Suggested high-level states:

``` text
EARTH_PREPARATION
READY_TO_LAUNCH
LAUNCHING
TRAVELLING_TO_MOON
MOON_LANDING
MOON_EXPLORATION
IN_ROVER
RETURNING_TO_SHIP
READY_TO_RETURN
RETURNING_TO_EARTH
MISSION_COMPLETED
MISSION_FAILED
```

Not every visual detail needs its own global state. Keep local animation
state inside the relevant component.

Create a small game-state module with named constants and controlled
transition functions. Avoid scattering string comparisons and state
updates across many components.

------------------------------------------------------------------------

## 11. Suggested technology stack

Use the following stack for the first version:

  -----------------------------------------------------------------------
  Technology                          Responsibility
  ----------------------------------- -----------------------------------
  React                               App structure and UI

  Vite                                Development server and build

  TypeScript                          Safer code and easier refactoring

  Three.js                            3D rendering engine

  React Three Fiber                   Use Three.js scenes through React
                                      components

  Drei                                Common helpers for React Three
                                      Fiber

  Tailwind CSS                        Simple responsive UI styling

  Zustand (optional)                  Shared game state, if React state
                                      becomes difficult to manage

  GLTF/GLB models                     3D models and animations
  -----------------------------------------------------------------------

### Recommended setup

-   Use **React + TypeScript + Vite**.
-   Use **@react-three/fiber** for the 3D canvas.
-   Use **@react-three/drei** for useful helpers such as controls,
    loaders, and environment utilities.
-   Use Tailwind CSS for HTML-based overlays and panels.
-   Start with React state and props for simple state. Add Zustand only
    when shared state becomes difficult to manage.
-   Use GLB/GLTF models. Start with simple placeholder models if final
    assets are not ready.

Do not add a backend, database, authentication, or multiplayer system
for the first prototype. The first version can run entirely in the
browser.

------------------------------------------------------------------------

## 12. Recommended folder structure

Keep the folder structure simple but organised by responsibility. Do not
create dozens of empty folders at the beginning; add files when a
feature is implemented.

``` text
z-space/
├── public/
│   ├── models/
│   │   ├── astronaut/
│   │   ├── spaceship/
│   │   ├── rover/
│   │   └── planets/
│   ├── textures/
│   ├── audio/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── GameCanvas.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FuelPanel.tsx
│   │   │   ├── MissionPanel.tsx
│   │   │   ├── NavigationArrow.tsx
│   │   │   ├── FuelMeter.tsx
│   │   │   └── MobileControls.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingScreen.tsx
│   │       └── InteractionPrompt.tsx
│   │
│   ├── game/
│   │   ├── config/
│   │   │   ├── gameConfig.ts
│   │   │   ├── missions.ts
│   │   │   └── vehicles.ts
│   │   │
│   │   ├── systems/
│   │   │   ├── fuelSystem.ts
│   │   │   ├── navigationSystem.ts
│   │   │   └── missionSystem.ts
│   │   │
│   │   ├── state/
│   │   │   └── gameState.ts
│   │   │
│   │   └── types/
│   │       └── game.types.ts
│   │
│   ├── entities/
│   │   ├── astronaut/
│   │   │   ├── Astronaut.tsx
│   │   │   ├── astronautController.ts
│   │   │   └── astronaut.types.ts
│   │   │
│   │   ├── spaceship/
│   │   │   ├── Spaceship.tsx
│   │   │   ├── spaceshipController.ts
│   │   │   └── spaceship.types.ts
│   │   │
│   │   └── rover/
│   │       ├── Rover.tsx
│   │       ├── roverController.ts
│   │       └── rover.types.ts
│   │
│   ├── worlds/
│   │   ├── earth/
│   │   │   ├── EarthScene.tsx
│   │   │   └── earth.config.ts
│   │   │
│   │   ├── moon/
│   │   │   ├── MoonScene.tsx
│   │   │   ├── MoonTerrain.tsx
│   │   │   └── moon.config.ts
│   │   │
│   │   └── space/
│   │       ├── SpaceScene.tsx
│   │       └── space.config.ts
│   │
│   ├── controls/
│   │   ├── desktopControls.ts
│   │   ├── mobileControls.ts
│   │   └── useGameControls.ts
│   │
│   ├── hooks/
│   │   ├── useFuel.ts
│   │   └── useNavigation.ts
│   │
│   ├── utils/
│   │   ├── distance.ts
│   │   └── math.ts
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   └── main.tsx
│
├── docs/
│   └── GAME_DESIGN.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Folder responsibilities

-   `app/`: App entry point and overall 3D canvas.
-   `components/ui/`: 2D interface shown over the 3D game.
-   `components/common/`: Reusable UI elements.
-   `game/config/`: Editable game balance values and mission data.
-   `game/systems/`: Rules for fuel, navigation, and missions.
-   `game/state/`: Shared game state and state transitions.
-   `game/types/`: Shared TypeScript types.
-   `entities/`: Reusable game objects such as astronaut, spaceship, and
    rover.
-   `worlds/`: Independent environments such as Earth, Moon, and space.
-   `controls/`: Keyboard, mouse, and touch input.
-   `hooks/`: React hooks that connect UI/components to game systems.
-   `utils/`: Small reusable helper functions.
-   `public/`: Static models, textures, audio, and icons.
-   `docs/`: Project documentation.

**Architecture rule:** A world should compose entities; it should not
contain copies of their core logic. For example, `MoonScene` can place
`Astronaut`, `Spaceship`, and `Rover`, but their reusable movement and
behaviour should remain in their own modules.

------------------------------------------------------------------------

## 13. UI direction for the prototype

The final UI design is not decided yet. Keep the first UI minimal and
functional.

### 13.1 Earth preparation UI

Show:

-   Game title: Z-SPACE.
-   Destination: Moon.
-   Current fuel selection.
-   Tank capacity.
-   Outbound fuel requirement.
-   Return fuel requirement.
-   Safety buffer.
-   Fuel sufficiency status.
-   Launch button.

### 13.2 Space travel UI

Show:

-   Current destination.
-   Travel progress.
-   Current fuel.
-   Short status messages.

### 13.3 Moon exploration UI

Show:

-   Small navigation arrow at the top.
-   Distance to spaceship/target.
-   Fuel or rover battery meter.
-   Interaction prompt.
-   Basic pause button.
-   Mobile controls on touch devices.

### 13.4 Return UI

Show:

-   Return fuel requirement.
-   Current available fuel.
-   Return-to-Earth action.
-   Clear warning if return fuel is insufficient.

### 13.5 Responsive requirements

**Desktop/laptop:**

-   Use keyboard movement.
-   Use mouse for camera control.
-   Keep HUD panels readable without covering the centre of the 3D
    scene.

**Mobile:**

-   Use touch joystick and action buttons.
-   Make buttons large enough to tap.
-   Keep important HUD information visible.
-   Avoid requiring hover.
-   Support portrait and landscape layouts as reasonably as possible.
-   Reduce rendering quality or effects on lower-powered devices if
    needed.

The UI should be HTML/CSS layered over the 3D canvas, not built as 3D
text unless there is a strong reason.

------------------------------------------------------------------------

## 14. Camera and 3D presentation

For the first version:

-   Use a third-person camera following the astronaut.
-   Keep the astronaut visible and near the centre of the view.
-   Allow simple camera rotation.
-   Prevent the camera from going below the terrain.
-   Use a simple follow camera before attempting advanced camera
    behaviour.
-   Use a separate camera configuration for the spaceship travel
    sequence if needed.

Do not spend too much time on cinematic camera effects before movement
and gameplay are functional.

------------------------------------------------------------------------

## 15. Asset strategy

Start with placeholder assets and replace them later.

Suggested asset types:

-   Astronaut: one low-poly or stylised character model.
-   Spaceship: one simple spaceship model.
-   Rover: one simple lunar rover model.
-   Moon: terrain mesh, rocks, craters, and a skybox/background.
-   Earth: simple planet sphere and launch platform.
-   Space: star background and planet visuals.

Use `.glb` or `.gltf` for 3D assets where possible.

Before using downloaded assets, check their licence and whether
commercial use is allowed if the game may later be published
commercially.

Do not block gameplay development while waiting for perfect models.
Coloured shapes and simple placeholder meshes are enough to build the
first prototype.

------------------------------------------------------------------------

## 16. Development phases and milestones

Build in small stages. Finish and test each stage before starting the
next one.

### Phase 0 --- Project setup

**Goal:** A working React + Three.js project.

Tasks:

-   Create a Vite React TypeScript project.
-   Install React Three Fiber and Drei.
-   Install and configure Tailwind CSS.
-   Render a basic 3D scene.
-   Add a camera, light, and a simple ground plane.
-   Confirm the app works in a desktop browser and a mobile-sized
    viewport.

**Done when:** A basic 3D scene renders without errors.

### Phase 1 --- First 3D world

**Goal:** See the astronaut, spaceship, Earth launch area, and Moon
scene.

Tasks:

-   Add placeholder astronaut.
-   Add placeholder spaceship.
-   Create a simple Earth launch area.
-   Create a simple Moon terrain.
-   Add a way to switch between Earth and Moon scenes for development.
-   Keep the scene components separate.

**Done when:** Earth and Moon scenes can render independently.

### Phase 2 --- Astronaut movement and camera

**Goal:** Walk around the Moon.

Tasks:

-   Add third-person camera follow.
-   Add keyboard movement.
-   Add basic character rotation.
-   Add simple ground collision.
-   Add mobile joystick controls.
-   Add a basic interaction prompt.

**Done when:** The player can move around the Moon on desktop and
mobile.

### Phase 3 --- Fuel planning

**Goal:** Player can choose fuel before launch.

Tasks:

-   Add mission configuration.
-   Add fuel selection control.
-   Display tank capacity.
-   Display outbound, return, and safety fuel.
-   Calculate recommended fuel.
-   Show warnings for insufficient fuel.
-   Add basic tests for fuel calculation functions.

**Done when:** Fuel calculations work correctly for the configured
mission.

### Phase 4 --- Launch and Moon landing

**Goal:** Complete the Earth-to-Moon journey.

Tasks:

-   Add launch interaction.
-   Check fuel before launch.
-   Play launch animation.
-   Show travel transition.
-   Deduct outbound fuel once.
-   Load the Moon scene.
-   Place spaceship and astronaut at the landing zone.
-   Prevent duplicate fuel deductions.

**Done when:** The player can launch from Earth and arrive on the Moon
with the correct remaining fuel.

### Phase 5 --- Moon exploration and rover

**Goal:** Explore the Moon on foot and by rover.

Tasks:

-   Add walkable exploration area.
-   Add landmarks.
-   Add rover model and parking position.
-   Add enter/exit interaction.
-   Add rover movement.
-   Add rover battery/energy consumption.
-   Keep the rover at its last parked position.

**Done when:** The player can explore on foot, drive the rover, exit it,
and return to it.

### Phase 6 --- Navigation arrow

**Goal:** Help the player return to the spaceship.

Tasks:

-   Set the spaceship as the navigation target.
-   Calculate direction and distance.
-   Display the arrow in the HUD.
-   Update the arrow as the player moves.
-   Show an arrival prompt near the spaceship.

**Done when:** The arrow consistently points towards the spaceship.

### Phase 7 --- Return journey

**Goal:** Return safely to Earth.

Tasks:

-   Add return-to-ship interaction.
-   Check remaining fuel against return requirement.
-   Show warning if fuel is insufficient.
-   Deduct return fuel once.
-   Play return travel animation.
-   Load Earth scene.
-   Show mission-completed screen.

**Done when:** A complete Earth → Moon → Earth round trip works.

### Phase 8 --- Polish and testing

**Goal:** Make the prototype enjoyable and reliable.

Tasks:

-   Add basic sound effects.
-   Add simple character and vehicle animations.
-   Improve lighting and environment.
-   Add pause/restart controls.
-   Add mission summary.
-   Test desktop and mobile controls.
-   Test insufficient fuel, enough fuel, and edge cases.
-   Check performance on a lower-powered mobile device.

**Done when:** A new player can understand and complete the mission
without developer help.

------------------------------------------------------------------------

## 17. Suggested first playable milestone

Do not try to finish every phase in one AI coding prompt.

The first meaningful playable milestone should be:

1.  Open the game.
2.  See a simple Earth launch area and spaceship.
3.  Choose a fuel amount.
4.  Launch.
5.  Arrive on the Moon.
6.  Walk around as the astronaut.
7.  See a navigation arrow pointing to the spaceship.
8.  Return to the spaceship.
9.  Return to Earth if enough fuel remains.

The rover can be added immediately after this core loop is stable. If
development is going smoothly, add a basic rover earlier, but do not let
it delay the first complete round trip.

------------------------------------------------------------------------

## 18. Testing checklist

### Fuel system

-   [ ] Correct required fuel is shown.
-   [ ] Fuel cannot exceed tank capacity.
-   [ ] Insufficient fuel prevents launch.
-   [ ] Outbound fuel is deducted exactly once.
-   [ ] Return reserve is displayed correctly.
-   [ ] Return is blocked or a clear failure state is shown when fuel is
    insufficient.
-   [ ] Rover energy does not accidentally consume spaceship return
    fuel.

### Movement and navigation

-   [ ] Astronaut moves in the expected direction.
-   [ ] Camera follows smoothly.
-   [ ] Player cannot walk through basic terrain boundaries.
-   [ ] Navigation arrow points towards the ship.
-   [ ] Distance to ship updates.
-   [ ] Arrow behaves correctly when the player reaches the ship.

### Rover

-   [ ] Player can enter and exit.
-   [ ] Rover controls work.
-   [ ] Rover energy decreases with distance.
-   [ ] Rover remains where it was parked.
-   [ ] Player cannot control the astronaut and rover simultaneously.

### Mission flow

-   [ ] Launch cannot be triggered repeatedly.
-   [ ] Scene transitions work.
-   [ ] Player spawns at the correct location.
-   [ ] Fuel is not deducted twice during scene changes.
-   [ ] Return journey ends at Earth.
-   [ ] Restart creates a clean new mission.

### Responsive behaviour

-   [ ] Keyboard controls work on desktop.
-   [ ] Touch controls work on mobile.
-   [ ] HUD is readable on small screens.
-   [ ] Buttons are touch-friendly.
-   [ ] The 3D scene remains usable in portrait and landscape where
    supported.

------------------------------------------------------------------------

## 19. Important architecture and coding rules

These rules should be followed throughout development:

1.  **Keep modules independent.** Astronaut movement belongs in the
    astronaut module; rover movement belongs in the rover module; fuel
    calculations belong in the fuel system.
2.  **Avoid one giant component.** Do not put the entire game in
    `App.tsx` or one giant scene component.
3.  **Separate UI from 3D logic.** HUD panels should not own 3D movement
    or mission calculations.
4.  **Keep game values in config files.** Fuel costs, tank capacity,
    rover speed, and mission settings should not be scattered across
    components.
5.  **Use shared types.** Define mission, vehicle, fuel, and game-state
    types centrally.
6.  **Avoid duplicated formulas.** Use the fuel system functions
    everywhere.
7.  **Avoid unnecessary dependencies.** Add a library only when it
    solves a real need.
8.  **Do not build a backend yet.** Keep the first version browser-only.
9.  **Do not over-engineer.** Prefer a simple working implementation
    over a complex framework.
10. **Test after each phase.** Do not add multiple untested systems at
    once.
11. **Use placeholder assets first.** Replace them with final models
    when the gameplay works.
12. **Keep desktop and mobile input separate.** Both should call the
    same gameplay actions so the game rules remain consistent.
13. **Keep scene transitions controlled.** Loading a scene must not
    reset fuel or duplicate mission actions.
14. **Use TypeScript types for important data.** Avoid using `any` as a
    shortcut for core game systems.
15. **Explain new concepts.** Since this is a learning project, code
    should be understandable and commented where the logic is not
    obvious.

------------------------------------------------------------------------

## 20. Suggested core data model

The following is a starting point, not a requirement to implement every
type immediately.

``` ts
export type DestinationId = "earth" | "moon";

export type MissionConfig = {
  id: string;
  origin: DestinationId;
  destination: DestinationId;
  outboundFuel: number;
  returnFuel: number;
  safetyBuffer: number;
};

export type FuelState = {
  tankCapacity: number;
  currentFuel: number;
};

export type VehicleConfig = {
  id: "spaceship" | "rover";
  energyPerKm: number;
  maxEnergy?: number;
};

export type PlayerMode =
  | "on-foot"
  | "in-rover"
  | "in-spaceship";

export type GamePhase =
  | "earth-preparation"
  | "launching"
  | "travelling-to-moon"
  | "moon-exploration"
  | "returning-to-earth"
  | "mission-completed"
  | "mission-failed";
```

Keep the model small and extend it only when a real feature needs more
information.

------------------------------------------------------------------------

## 21. Performance guidelines

3D games can become slow on mobile, so:

-   Start with low-poly models.
-   Keep the number of real-time lights low.
-   Avoid expensive post-processing in the prototype.
-   Use compressed and appropriately sized textures.
-   Avoid loading every future planet asset at startup.
-   Use simple collision shapes.
-   Avoid unnecessary React state updates on every animation frame.
-   Use React Three Fiber frame updates for continuous 3D movement where
    appropriate.
-   Test on a real mobile device early, not only desktop responsive
    mode.

------------------------------------------------------------------------

## 22. Future expansion ideas

Once the first Moon round trip is stable, possible expansions include:

### New destinations

-   Mars.
-   Space stations.
-   Asteroid fields.
-   Other moons and planets.

### Exploration

-   Collect rock samples.
-   Discover landmarks.
-   Complete small exploration objectives.
-   Find hidden research locations.

### Survival and challenge

-   Oxygen meter.
-   Limited rover battery.
-   Weather or dust events.
-   Emergency landing challenges.
-   Optional navigation difficulty.

### Progression

-   Unlock new missions.
-   Upgrade spaceship tank capacity.
-   Upgrade rover battery.
-   Unlock new spacesuits.
-   Earn mission medals based on fuel efficiency and exploration.

### Save system

-   Save mission progress locally in the browser.
-   Add player settings.
-   Add mission history.

These features are future ideas only. Do not build them before the core
round-trip mission works.

------------------------------------------------------------------------

## 23. Instructions for the AI coding assistant

Use this document as the source of truth for the Z-SPACE project.

When working on this project:

1.  First inspect the existing repository and identify its current
    framework, dependencies, folder structure, and working features.
2.  Do not replace or restructure working code without a clear reason.
3.  Follow the architecture and folder responsibilities in this
    document.
4.  Implement only the phase or task explicitly requested by the
    developer.
5.  Before editing, explain which files need to be created or changed
    and why.
6.  Keep changes small and focused.
7.  Do not invent complex physics or realistic rocket calculations. Use
    the simple configurable fuel rules in this document.
8.  Do not implement future features unless asked.
9.  Keep the game playable after each milestone.
10. After changes, report what was implemented, which files changed, how
    to run it, and what should be tested next.
11. If a requirement is ambiguous, ask one focused question rather than
    making a large architectural assumption.
12. Prefer readable, beginner-friendly code over clever abstractions.

### First task for the AI coding assistant

Start with **Phase 0 only**:

-   Inspect the repository.
-   Set up or verify React + TypeScript + Vite.
-   Set up React Three Fiber and Drei.
-   Set up Tailwind CSS.
-   Render one simple 3D scene with a ground plane, camera, and light.
-   Do not implement fuel, missions, astronaut movement, rover, or
    planet travel yet.
-   Summarise the files created/changed and explain how to run the
    project.

Wait for the developer to approve the next phase before continuing.

------------------------------------------------------------------------

## 24. Definition of success

The first version of Z-SPACE is successful when a player can:

-   Start on Earth.
-   Understand how much fuel the mission needs.
-   Choose and load fuel.
-   Travel to the Moon.
-   Land safely.
-   Exit the spaceship and explore.
-   Use the rover for longer-distance exploration.
-   Follow the navigation arrow back to the spaceship.
-   Keep enough fuel reserved for the return journey.
-   Return to Earth and complete the mission.

**Final product direction:** Z-SPACE should grow into a modular, casual
3D space-exploration game. Build the smallest complete experience first,
keep each game system independent, and expand one feature at a time.
