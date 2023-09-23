/* eslint-disable @typescript-eslint/no-this-alias */
export class Node<T> {
  public data: T;

  public prev: Node<T> | null = null;

  public next: Node<T> | null = null;

  constructor(data: Node<T>['data']) {
    this.data = data;
  }

  public forward(n: number): Node<T> | null {
    let currentNode: Node<T> | null = this;

    for (let i = 0; i < n; i++) {
      if (currentNode === null) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return currentNode;
  }

  public backward(n: number): Node<T> | null {
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

  public getSize(): DoublyLinkedList<T>['size'] {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public getHead(): DoublyLinkedList<T>['head'] {
    return this.head;
  }

  public getTail(): DoublyLinkedList<T>['tail'] {
    return this.tail;
  }

  public append(node: Node<T>): void {
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

  public prepend(node: Node<T>): void {
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

  public clear(): void {
    this.size = 0;

    this.head = null;
    this.tail = null;
  }

  public remove(node: Node<T>): void {
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

  public insertAfter(node: Node<T>, target: Node<T>): void {
    if (target === this.tail) {
      this.append(node);
    } else {
      this.size++;

      node.prev = target;
      node.next = target.next;
      target.next!.prev = node;
      target.next = node;
    }
  }

  public insertBefore(node: Node<T>, target: Node<T>): void {
    if (target === this.head) {
      this.prepend(node);
    } else {
      this.size++;

      node.next = target;
      node.prev = target.prev;
      target.prev!.next = node;
      target.prev = node;
    }
  }

  public find(callback: (node: Node<T>) => boolean): Node<T> | null {
    return Array.from(this).find(callback) ?? null;
  }

  public reverse(): void {
    [this.head, this.tail] = [this.tail, this.head];

    for (const node of this) {
      [node.prev, node.next] = [node.next, node.prev];
    }
  }

  public toArray(): Node<T>[] {
    return Array.from(this);
  }

  static fromArray<T>(array: T[]): DoublyLinkedList<T> {
    const dll = new DoublyLinkedList<T>();
    array.forEach(item => dll.append(new Node<T>(item)));

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
