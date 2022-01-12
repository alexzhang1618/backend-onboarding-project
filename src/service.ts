import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';

export const createItem = async (conn: Connection, name: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = "TODO: FILL THIS OUT";
  item.price = price;
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const deleteItem = (name: string) => {
  /*
  if (!(name in db)) {
    throw new Error("item doesn't exist!");
  }
  delete db[name];
  */
}