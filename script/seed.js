'use strict'

const db = require('../server/db')
const {User, Item, Order, ItemOrder} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      firstName: 'Cody',
      lastName: 'DaPug',
      fullName: 'Cody DaPug',
      email: 'cody@email.com',
      password: '123',
      admin: true
    }),
    User.create({
      firstName: 'Murphy',
      lastName: 'DaPug',
      fullName: 'Murphy DaPug',
      email: 'murphy@email.com',
      password: '123'
    })
  ])

  const items = await Promise.all([
    Item.create({
      name: 'Super Mario 64',
      price: 7999,
      year: 1996,
      inventory: 999,
      imageUrl:
        'https://www.mobygames.com/images/covers/l/6126-super-mario-64-nintendo-64-front-cover.jpg'
    }),
    Item.create({
      name: 'Mario Kart 64',
      price: 8999,
      year: 1997,
      inventory: 999,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMWU1NzAzMWEtYzA1NC00M2FlLWIwNTgtZGIxZjIxMmM3YmUwXkEyXkFqcGdeQXVyNjkxMjYyMjk@._V1_.jpg'
    }),
    Item.create({
      name: 'Super Mario Bros.',
      price: 1999,
      year: 1985,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/81sDxuHDtkL._AC_SL1500_.jpg'
    }),
    Item.create({
      name: 'Super Mario Bros. 3',
      price: 2499,
      year: 1990,
      inventory: 999,
      imageUrl:
        'https://www.mobygames.com/images/covers/l/16093-super-mario-bros-3-nes-front-cover.jpg'
    }),
    Item.create({
      name: 'Super Mario World',
      price: 2999,
      year: 1991,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/31m9yff5o-L.jpg'
    }),
    Item.create({
      name: 'Metroid',
      price: 2899,
      year: 1986,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/518G1QPNYEL.jpg'
    }),
    Item.create({
      name: 'Donkey Kong 3',
      price: 2349,
      year: 1984,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/51JHBEeBepL.jpg'
    }),
    Item.create({
      name: 'Duck Hunt',
      price: 1799,
      year: 1985,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/71%2BfAmMQcPL._AC_SL1500_.jpg'
    }),
    Item.create({
      name: 'Baseball',
      price: 999,
      year: 1985,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/51bnaNuk%2BlL.jpg'
    }),
    Item.create({
      name: 'Pokemon Blue',
      price: 5199,
      year: 1998,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/51LvfCxABtL.jpg'
    }),
    Item.create({
      name: 'Pokemon Red',
      price: 5599,
      year: 1998,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/61wR44VWU%2BL.jpg'
    }),
    Item.create({
      name: 'Pokemon Yellow',
      price: 5999,
      year: 1999,
      inventory: 999,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/61VMUHBuCbL.jpg'
    })
  ])

  const orders = await Promise.all([
    Order.create({
      userId: 1,
      checkedout: true
    }),
    Order.create({
      userId: 1
    })
  ])

  const itemOrder = await Promise.all([
    ItemOrder.create({
      quantity: 1,
      price: 7999,
      itemId: 1,
      orderId: 1
    }),
    ItemOrder.create({
      quantity: 1,
      price: 8999,
      itemId: 2,
      orderId: 1
    }),
    ItemOrder.create({
      quantity: 1,
      price: 7999,
      itemId: 1,
      orderId: 2
    }),
    ItemOrder.create({
      quantity: 1,
      price: 8999,
      itemId: 2,
      orderId: 2
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${items.length} items`)
  console.log(`seeded ${orders.length} orders`)
  console.log(`seeded ${itemOrder.length} items in orders`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
