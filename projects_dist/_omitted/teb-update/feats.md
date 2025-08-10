


- Debugger
  - spawns a toggle debug button
  - Shows FPS (wow)
  - API to draws debug shapes
    - scheduled to be called from anywhere
    - shapes: point,circle,line,rect,text
    - custom scheduled render (callback)
  - `inspect(obj)`: Displays an object's properties in a new window, subsequent calls will override the html.  (meant as an alternative to polluting the console with 60 logs per second)

- Controls
  - handy methods:
    - `Controls.has(key)`: if a key is currently down
    - `Controls.hasNew(key)`: if key is pressed and wasn't in prev frame
    - `Controls.hasSome([...keys])`: if one of the `keys` are down
    - `Controls.hasAll([...keys])`: if all `keys` are down
    - same with mouse buttons

- Mouse
  - just tracks mouse movements, lol

- Sound
  - manages sounds, recycling instances whenever possible to avoid lots of GC
  - global modifiers: volume, speed 
  - instance modifiers: volume, speed, panning
  - supports repeat strategy: whether to reset an audio when play is called while playing, or create a new one leaving the previous running

- Map Editor
  - Real time testing capabilities
  - Map import/export
  - Camera movements, zoom in/out
  - Handles adding and managing multiple levels to a map
  - Unbounded canvas (virtually infinite positioning)

- Events:
    - EventStream: pub/sub messaging system meant to work within the loop cycle
    - AppEvents: pub/sub messaging system working with postMessage and listeners

- Time:
  - computes delta time
  - manages game speed

- View(camera, basically):
  - smooth/instant zooms
  - smooth/instant focus change
  - handles offsets and provides methods to translate absolute coords to canvas coords

- Collisions:
  - just some basic lightweight and some heavy collision check functions, organized in isolated files, es isRectToRect, isLineToCircle, isConeToPoint... etc

- Base Sprite (rendering is defined just here in my engine)
  - Animations
    - add/remove animations
    - can setup events to happen when specific animations end (onAnimationEnd("animation", callback))
    - strategy: loop or play once
    - animation speed
  - Rendering
    - Rotated rendering with arbitrary pivot
    - absolute or relative rendering to the position to the view

- Recorder (stole the idea from a certain someone)
  - shortcuts to start/stop recording
  - can download recorded video

- scripts (node)
  - prodPipeline.ts (relies on a couple of external packages)
    - builds the ts/bundles the tree of imported files from the index
    - obfuscates scripts
    - zips it all, ready to be uploaded to some publishers
  - assetsIndex.ts
    - list all files in a folder, and creates a typescript file `index.ts` in that folder that imports and export all of them in a centralized object.
  - listCommits.ts (using external package `gitlog`)
    - creates a .json in assets/others with all of the current repo commit messages and timestamps. Idk, fun to display updates in game that no one will read probably