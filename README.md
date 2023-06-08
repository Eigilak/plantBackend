
# Maria's Plant App

## Considerations


General Considerations:
1. Follow best practices for code organization and documentation.
2. Focus on core features and avoid complex functionalities.
3. Keep the design simple and functional.
4. tests and more tests

Marias plants - backend
- Code first approach
    - It is just easier so I don’t have to context switch all the time
- Technologies used
    - Tests - jest
    - TypeOrm
    - Graphql
    - TS
- Entities
    - Plant
        - id - number
        - name- varchar
        - Picture - varchar
        - boughtAt - Date
        - deceased -  bool nix —> brug date
        - createdAt - Date
    - Owner - considered entity
- Resolvers + test
    - C - createPlant
    - R - getPlants / getPlant
    - U - updatePlant
    - D - deletePlant



## Installation

```bash
$ pnpm install && docker compose up -d
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
