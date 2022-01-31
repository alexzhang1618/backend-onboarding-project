import { connect } from 'http2';
import { Connection, EntityRepository } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';
import { User } from './models/User';

export const getItems = async (conn: Connection) => {
  const db = conn.getRepository(Item);
  const items = await db.find();
  class Entry {
    uuid: string;
    name: string;
    price: number;
    createdAt: string;
  };
  return items.map((item) => {
    const entry = new Entry();
    entry.uuid = item.uuid;
    entry.name = item.name;
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

export const createItem = async (conn: Connection, name: string, description: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = description;
  item.price = price;
  item.createdAt = new Date().toString();
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const createUser = async (conn: Connection, name: string, password: string) => {
  const user = new User();
  user.name = name;
  user.password = password;
  const createdUser = await conn.manager.save(user);
  return createdUser.uuid;
};

/** Return true if the item was deleted, false if not */
export const deleteItem = async (conn: Connection, uuid: string) => {
  const db = conn.getRepository(Item);
  const response = await db.delete(uuid);
  console.log(response);
  if (response.affected == 1) {
    return true;
  } else {
    return false;
  }
};
