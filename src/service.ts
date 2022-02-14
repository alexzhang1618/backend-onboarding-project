import { Connection, createQueryBuilder, EntityRepository } from 'typeorm';
import { Item } from './models/Item';
import { Order } from './models/Order';
import { User } from './models/User';

export const getItems = async (conn: Connection) => {
  const db = conn.getRepository(Item);
  const items = await db.find();
  class Entry {
    uuid: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
  };
  return items.map((item) => {
    const entry = new Entry();
    entry.uuid = item.uuid;
    entry.name = item.name;
    entry.description = item.description;
    entry.price = item.price;
    entry.createdAt = item.createdAt;
    return entry;
  });
};

export const getUsers = async (conn: Connection) => {
  const db = conn.getRepository(User);
  const users = await db.find();
  class Entry {
    uuid: string;
    name: String;
  };
  return users.map((user) => {
    const entry = new Entry();
    entry.uuid = user.uuid;
    entry.name = user.name;
    return entry;
  });
};

export const getUser = async (conn: Connection, uuid: string) => {
  const db = conn.getRepository(User);
  const user = await db.createQueryBuilder("user")
    .innerJoinAndSelect("user.orders", "order")
    .innerJoinAndSelect("order.item", "item")
    .where("user.uuid = :userUuid", { userUuid: uuid })
    .getOne();
  class orderEntry {
    uuid: string;
    item: string;
    price: number;
    createdAt: string;
  }
  class Entry {
    uuid: string;
    name: string;
    orders: orderEntry[];
  }
  const orders = user.orders.map((order) => {
    const oEntry = new orderEntry();
    oEntry.uuid = order.uuid;
    oEntry.item = order.item.name;
    oEntry.price = order.item.price;
    oEntry.createdAt = order.createdAt;
    return oEntry;
  })
  const ret = new Entry();
  ret.uuid = user.uuid;
  ret.name = user.name;
  ret.orders = orders;
  return ret;
}

export const getOrders = async (conn: Connection, userId: string) => {
  const db = conn.getRepository(Order);
  const orders = await db.createQueryBuilder("order")
    .innerJoinAndSelect("order.item", "item")
    .where("order.user = :user", { user: userId })
    .getMany();
  class Entry {
    uuid: string;
    createdAt: string;
    item: Item;
  }
  return orders;
}

export const createItem = async (conn: Connection, name: string, description: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = description;
  item.price = price;
  item.createdAt = new Date().toString();
  item.orders = [];
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const createUser = async (conn: Connection, name: string, password: string) => {
  const user = new User();
  user.name = name;
  user.password = password;
  user.orders = [];
  const createdUser = await conn.manager.save(user);
  return { username: name, password: password, uuid: createdUser.uuid };
};

export const createOrder = async (conn: Connection, itemId: string, userId: string) => {
  const user = await conn.getRepository(User).findOne({ where: { 'uuid': userId } });
  const item = await conn.getRepository(Item).findOne({ where: { 'uuid': itemId } });
  const order = new Order();
  order.createdAt = new Date().toString();
  order.user = user;
  order.item = item;
  const res = await conn.manager.save(order);
  return res;
};

/** Return true if the item was deleted, false if not */
export const deleteItem = async (conn: Connection, uuid: string) => {
  const db = conn.getRepository(Item);
  const response = await db.delete(uuid);
  if (response.affected == 1) {
    return true;
  } else {
    return false;
  }
};

export const login = async (conn: Connection, username: string, password: string) => {
  const db = conn.getRepository(User);
  const response = await db.find();
  for (let i = 0; i < response.length; i++) {
    if (response[i].name == username && response[i].password == password) {
      return response[i].uuid;
    }
  }
  return "";
}