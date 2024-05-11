import { DoublyLinkedList, Node } from './dll';

import * as Schema from './schema';

export type WithReorderingPositionValue<T> = T & {
  position: Schema.ReorderingItemPositionValueType;
};

export class ReorderingPosition {
  readonly value: Schema.ReorderingItemPositionValueType;

  constructor(value: Schema.ReorderingItemPositionValueType) {
    if (!Schema.ReorderingItemPositionValue.safeParse(value).success) {
      throw new Error('Position is not a positive integer');
    }

    this.value = value;
  }

  eq(another: ReorderingPosition): boolean {
    return this.value === another.value;
  }
}

class ReorderingItem {
  constructor(
    readonly id: Schema.ReorderingItemIdType,
    readonly position: ReorderingPosition
  ) {}

  eq(anotherItemId: ReorderingItem['id']): boolean {
    return this.id === anotherItemId;
  }
}

enum ReorderingTransferDirection {
  upwards = 'upwards',
  downwards = 'downwards',
  noop = 'noop',
}

export class ReorderingTransfer {
  readonly id: ReorderingItem['id'];

  readonly to: ReorderingPosition;

  constructor(config: {
    id: ReorderingItem['id'];
    to: Schema.ReorderingItemPositionValueType;
  }) {
    this.id = config.id;
    this.to = new ReorderingPosition(config.to);
  }

  getDirection(
    currentPosition: ReorderingPosition
  ): ReorderingTransferDirection {
    if (this.to.value === currentPosition.value)
      return ReorderingTransferDirection.noop;

    if (this.to.value > currentPosition.value) {
      return ReorderingTransferDirection.downwards;
    }

    return ReorderingTransferDirection.upwards;
  }
}

export class ReorderingCalculator {
  private dll: DoublyLinkedList<ReorderingItem>;

  constructor() {
    this.dll = DoublyLinkedList.fromArray<ReorderingItem>([]);
  }

  static fromArray(ids: ReorderingItem['id'][]) {
    const reordering = new ReorderingCalculator();
    for (const id of ids) {
      reordering.add(id);
    }
    return reordering;
  }

  add(id: ReorderingItem['id']): ReorderingItem {
    const position = new ReorderingPosition(this.dll.getSize());
    const item = new ReorderingItem(id, position);
    this.dll.append(new Node(item));
    return item;
  }

  delete(id: ReorderingItem['id']) {
    const item = this.dll.find(x => x.data.eq(id));
    if (!item) {
      throw new Error('Cannot find Item');
    }
    this.dll.remove(item);
    this.recalculate();
  }

  transfer(
    transfer: ReorderingTransfer
  ): ReturnType<ReorderingCalculator['read']> {
    const current = this.dll.find(node => node.data.eq(transfer.id));
    const target = this.dll.find(node => node.data.position.eq(transfer.to));

    if (!current) {
      throw new Error('Cannot find current Item');
    }
    if (!target) {
      throw new Error('Cannot find target Item');
    }

    const direction = transfer.getDirection(current.data.position);

    if (direction === ReorderingTransferDirection.noop) return this.read();
    if (direction === ReorderingTransferDirection.upwards) {
      this.dll.remove(current);
      this.dll.insertBefore(current, target);
      this.recalculate();
    }
    if (direction === ReorderingTransferDirection.downwards) {
      this.dll.remove(current);
      this.dll.insertAfter(current, target);
      this.recalculate();
    }
    return this.read();
  }

  read() {
    const ids = Array.from(this.dll).map(item => item.data.id);
    const items = Array.from(this.dll).map(item => item.data);
    return { ids, items };
  }

  private recalculate() {
    this.dll = ReorderingCalculator.fromArray(this.read().ids).dll;
  }
}

export class ReorderingIntegrator {
  static appendPosition(reordering: Schema.ReorderingType[]) {
    return function<T extends { id: Schema.ReorderingItemIdType }>(
      item: T
    ): WithReorderingPositionValue<T> {
      return {
        ...item,
        position: reordering.find(x => x.id === item.id)?.position ?? 0,
      };
    };
  }

  static sortByPosition() {
    return (
      a: WithReorderingPositionValue<unknown>,
      b: WithReorderingPositionValue<unknown>
    ) => a.position - b.position;
  }
}
