import {
  Adjacency,
  ContainerState,
  dump,
  GameState,
  insert,
  tick,
} from './GameState'

describe('tick', () => {
  test('do nothing', () => {
    expect(tick({ adjacencies: [], containers: [] })).toStrictEqual({
      adjacencies: [],
      containers: [],
    })
  })
  test('no transfer to non-adjacent', () => {
    const adjacencies = new Array<Adjacency>()
    const containers: ContainerState[] = [
      { type: 'source', inventory: { count: 16, name: 'iron rod' } },
      { type: 'sink', inventory: undefined },
    ]
    expect(
      tick({
        adjacencies,
        containers,
      }),
    ).toStrictEqual<GameState>({
      adjacencies,
      containers,
    })
  })
  describe('sink and source', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    test('no transfer once empty', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                type: 'source',
                inventory: { count: 1, name: 'iron rod' },
              },
              { type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { type: 'source', inventory: undefined },
          { type: 'sink', inventory: { count: 1, name: 'iron rod' } },
        ],
      })
    })
    test('transfer forward two to adjacent', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                type: 'source',
                inventory: { count: 16, name: 'iron gear' },
              },
              { type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { type: 'source', inventory: { count: 14, name: 'iron gear' } },
          { type: 'sink', inventory: { count: 2, name: 'iron gear' } },
        ],
      })
    })
    test('transfer backward two to adjacent', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                type: 'source',
                inventory: { count: 16, name: 'iron gear' },
              },
              { type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { type: 'source', inventory: { count: 14, name: 'iron gear' } },
          { type: 'sink', inventory: { count: 2, name: 'iron gear' } },
        ],
      })
    })
    test('backpressure upon mixed types', () => {
      const adjacencies = [{ from: 0, to: 1 }]
      expect(
        tick({
          adjacencies,
          containers: [
            {
              type: 'source',
              inventory: { count: 16, name: 'iron gear' },
            },
            { type: 'sink', inventory: { count: 16, name: 'iron rod' } },
          ],
        }),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            type: 'source',
            inventory: { count: 16, name: 'iron gear' },
          },
          { type: 'sink', inventory: { count: 16, name: 'iron rod' } },
        ],
      })
    })
  })
})

describe('insert', () => {
  test('add 32 iron gear', () => {
    expect(
      insert(
        {
          adjacencies: [],
          containers: [{ type: 'source' }],
        },
        { count: 32, name: 'iron gear' },
      ),
    ).toStrictEqual({
      adjacencies: [],
      containers: [
        { type: 'source', inventory: { count: 32, name: 'iron gear' } },
      ],
    })
  })
})

test('dump', () => {
  expect(
    dump({
      adjacencies: [],
      containers: [
        { type: 'source', inventory: { count: 16, name: 'iron rod' } },
        { type: 'sink', inventory: { count: 32, name: 'iron gear' } },
      ],
    }),
  ).toStrictEqual({
    adjacencies: [],
    containers: [
      { type: 'source', inventory: { count: 16, name: 'iron rod' } },
      { type: 'sink' },
    ],
  })
})
