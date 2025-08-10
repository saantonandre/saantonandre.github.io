# Guidelines

## Functions

- Top-level functions should not be anonymous (arrow functions)
  
- Use arrow functions only if they need to have a bounded "this" scope.
  
### Naming conventions

- Functions returning a boolean should start with `is` (`isBlue`, `isValid`)

- Anything returning a structure, while not modifying the input should start with `get` (`getRectSides`)

- Collisions should be named like: `ShapeToShape` (`isConeToPoint`) and the shapes order should correspond to the parameters (`isConeToPoint(cone, point)`)

- Parameters between same-shape collisions should be named like: `a`,`b`

- Parameters between different shapes collisions should instead be named like: `point`, `line`

- `get` functions without success, should return undefined.

## Variables

- Variables that are not supposed to change, should be defined as const

- Variables should be defined in the lower necessary scope

## General
- No default exports
- Folders should have uppercased initials when the main export is a Class (same as files)