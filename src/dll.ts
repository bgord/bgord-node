export class Node<T> {
  data: T;

  prev: Node<T> | null = null;

  next: Node<T> | null = null;

  constructor(data: Node<T>['data']) {
    this.data = data;
  }

  forward(n: number): Node<T> | null {
    let currentNode: Node<T> | null = this;

    for (let i = 0; i < n; i++) {
      if (currentNode === null) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return currentNode;
  }

  backward(n: number): Node<T> | null {
    let currentNode: Node<T> | null = this;

    for (let i = 0; i < n; i++) {
      if (currentNode === null) {
        return currentNode;
      }

      currentNode = currentNode.prev;
    }
    return currentNode;
  }
}

export class DoublyLinkedList<T> {
  static EMPTY_SIZE = 0;

  private size = DoublyLinkedList.EMPTY_SIZE;

  private head: Node<T> | null = null;

  private tail: Node<T> | null = null;

  getSize(): DoublyLinkedList<T>['size'] {
    return this.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  getHead(): DoublyLinkedList<T>['head'] {
    return this.head;
  }

  getTail(): DoublyLinkedList<T>['tail'] {
    return this.tail;
  }

  append(node: Node<T>): void {
    if (this.head === null || this.tail === null) {
      this.size++;

      this.head = node;
      this.tail = node;
    } else {
      this.size++;

      this.tail.next = node;
      node.prev = this.tail;

      this.tail = node;
    }
  }

  prepend(node: Node<T>): void {
    if (this.head === null || this.tail === null) {
      this.size++;

      this.head = node;
      this.tail = node;
    } else {
      this.size++;

      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }

  clear(): void {
    this.size = 0;

    this.head = null;
    this.tail = null;
  }

  remove(node: Node<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    this.size--;
    node.prev = null;
    node.next = null;
  }

  insertAfter(node: Node<T>, target: Node<T>): void {
    if (target === this.tail) {
      this.append(node);
    } else {
      this.size++;

      node.prev = target;
      node.next = target.next;
      // biome-ignore lint: lint/style/noNonNullAssertion
      target.next!.prev = node;
      target.next = node;
    }
  }

  insertBefore(node: Node<T>, target: Node<T>): void {
    if (target === this.head) {
      this.prepend(node);
    } else {
      this.size++;

      node.next = target;
      node.prev = target.prev;
      // biome-ignore lint: lint/style/noNonNullAssertion
      target.prev!.next = node;
      target.prev = node;
    }
  }

  find(callback: (node: Node<T>) => boolean): Node<T> | null {
    return Array.from(this).find(callback) ?? null;
  }

  reverse(): void {
    [this.head, this.tail] = [this.tail, this.head];

    // @ts-ignore
    for (const node of this) {
      [node.prev, node.next] = [node.next, node.prev];
    }
  }

  toArray(): Node<T>[] {
    return Array.from(this);
  }

  static fromArray<T>(array: T[]): DoublyLinkedList<T> {
    const dll = new DoublyLinkedList<T>();

    for (const item of array) {
      dll.append(new Node<T>(item));
    }

    return dll;
  }

  *[Symbol.iterator](): IterableIterator<Node<T>> {
    let current: Node<T> | null = this.head;

    while (current) {
      yield current;

      current = current.next;
    }
  }
}
