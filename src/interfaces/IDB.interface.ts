export default interface IDBUpgradeEvent extends Event {
  target: IDBOpenDBRequest & { result: IDBDatabase }
}
