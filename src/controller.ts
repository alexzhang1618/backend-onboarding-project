import { Router, Request, Response } from "express";
import path from "path";
import { createBrotliDecompress } from "zlib";
import { createItem, deleteItem, getItems, createUser, getUsers, createOrder, getOrders } from "./service";

export const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

router.get('/items', async (req, res) => {
  const items = await getItems(req.dbConnection);
  return res.send(
    items
  );
});

router.get('/users', async (req, res) => {
  const users = await getUsers(req.dbConnection);
  return res.send(
    users
  );
});

router.get('/orders', async (req, res) => {
  if (!('userId' in req.query)) {
    return res.status(400).send('Missing required variables!');
  }
  const userId = req.query.userId as string;
  const orders = await getOrders(req.dbConnection, userId);
  return res.send(
    orders
  );
})

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// router.use("/admin", (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     if (authorizedUsers.includes(bearerToken)) {
//       return next();
//     }
//   }
//   return res.status(401).send("Unauthorized");
// });

// handle all POST requests that match '/'
router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body) || !('description' in req.body)) {
    return res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const description = req.body.description as string;
  const price = Number(req.body.price);
  if (name.length < 0 || name.length > 26 || isNaN(price)) {
    return res.status(400).send('Invalid argument shape!');
  }
  const uuid = await createItem(req.dbConnection, name, description, price);
  return res.send(
    uuid
  );
});

router.delete('/items/:uuid', async (req: Request, res: Response) => {
  /** Get the uuid parameters after "uuid:" */
  if (!('uuid' in req.params)) {
    return res.status(400).send('Missing required variables!');
  }
  const uuid = req.params.uuid;
  try {
    const status = await deleteItem(req.dbConnection, uuid);
    if (status) {
      return res.status(200).send("Item successfully deleted.");
    }
    return res.status(400).send("Item not found.");
  } catch (error) {
    return res.status(400).send(error.toString());
  }
});

router.post('/user', async (req: Request, res: Response) => {
  if (!('name' in req.body) || (!('password' in req.body))) {
    return res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const password = req.body.password as string;
  const uuid = await createUser(req.dbConnection, name, password);
  return res.send(
    uuid
  );
});

router.post('/order', async (req: Request, res: Response) => {
  if (!('itemId' in req.body) || !('userId' in req.body)) {
    return res.status(400).send('Missing required variables!');
  }
  const itemId = req.body.itemId as string;
  const userId = req.body.userId as string;
  const order = await createOrder(req.dbConnection, itemId, userId);
  return res.send(
    order
  );
});