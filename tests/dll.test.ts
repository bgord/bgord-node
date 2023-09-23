import { describe, test, expect } from 'vitest';

import { DoublyLinkedList, Node } from '../src/dll';

class Token {
  constructor(public value: string) {}
}

const token = new Token('test');

describe('DLL', () => {
  test('creates an empty List', () => {
    const dll = new DoublyLinkedList();

    expect(dll.getSize()).toEqual(0);
    expect(dll.getHead()).toEqual(null);
    expect(dll.getTail()).toEqual(null);
  });

  test('isEmpty()', () => {
    const dll = new DoublyLinkedList();

    expect(dll.isEmpty()).toEqual(true);
  });

  test('appends the first Node', () => {
    const dll = new DoublyLinkedList<Token>();
    const node = new Node<Token>(token);

    dll.append(node);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(node);
    expect(dll.getTail()).toEqual(node);
  });

  test('appends two Nodes', () => {
    const dll = new DoublyLinkedList<Token>();

    const firstNode = new Node<Token>(token);
    const secondNode = new Node<Token>(token);

    dll.append(firstNode);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(firstNode);

    dll.append(secondNode);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(secondNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(null);
  });

  test('appends three Nodes', () => {
    const dll = new DoublyLinkedList<Token>();

    const firstNode = new Node<Token>(token);
    const secondNode = new Node<Token>(token);
    const thirdNode = new Node<Token>(token);

    dll.append(firstNode);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(firstNode);

    dll.append(secondNode);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(secondNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(null);

    dll.append(thirdNode);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(thirdNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(thirdNode);

    expect(thirdNode.backward(1)).toEqual(secondNode);
    expect(thirdNode.forward(1)).toEqual(null);
  });

  test('appends four Nodes', () => {
    const dll = new DoublyLinkedList<Token>();

    const firstNode = new Node<Token>(token);
    const secondNode = new Node<Token>(token);
    const thirdNode = new Node<Token>(token);
    const fourthNode = new Node<Token>(token);

    dll.append(firstNode);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(firstNode);

    dll.append(secondNode);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(secondNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(null);

    dll.append(thirdNode);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(thirdNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(thirdNode);

    expect(thirdNode.backward(1)).toEqual(secondNode);
    expect(thirdNode.forward(1)).toEqual(null);

    dll.append(fourthNode);

    expect(dll.getSize()).toEqual(4);
    expect(dll.getHead()).toEqual(firstNode);
    expect(dll.getTail()).toEqual(fourthNode);

    expect(firstNode.backward(1)).toEqual(null);
    expect(firstNode.forward(1)).toEqual(secondNode);

    expect(secondNode.backward(1)).toEqual(firstNode);
    expect(secondNode.forward(1)).toEqual(thirdNode);

    expect(thirdNode.backward(1)).toEqual(secondNode);
    expect(thirdNode.forward(1)).toEqual(fourthNode);

    expect(fourthNode.backward(1)).toEqual(thirdNode);
    expect(fourthNode.forward(1)).toEqual(null);
  });

  test('prepend one node', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);

    dll.append(node1);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getTail()).toEqual(node1);

    dll.prepend(node2);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node2);
    expect(dll.getTail()).toEqual(node1);
  });

  test('prepend two node', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getTail()).toEqual(node1);

    dll.prepend(node2);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node2);
    expect(dll.getTail()).toEqual(node1);

    dll.prepend(node3);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(node3);
    expect(dll.getHead().next).toEqual(node2);
    expect(dll.getHead().next.next).toEqual(node1);
    expect(dll.getTail()).toEqual(node1);
  });

  test('clear()', () => {
    const dll = new DoublyLinkedList<Token>();
    const node = new Node<Token>(token);

    dll.append(node);

    expect(dll.getSize()).toEqual(1);
    expect(dll.getHead()).toEqual(node);
    expect(dll.getTail()).toEqual(node);

    dll.clear();

    expect(dll.getSize()).toEqual(0);
    expect(dll.getHead()).toEqual(null);
    expect(dll.getTail()).toEqual(null);
  });

  test('remove() head', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);
    dll.append(node3);

    expect(dll.getSize()).toEqual(3);

    dll.remove(node1);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node2);
    expect(dll.getHead().next).toEqual(node3);
    expect(dll.getTail()).toEqual(node3);
  });

  test('remove() tail', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);
    dll.append(node3);

    expect(dll.getSize()).toEqual(3);

    dll.remove(node3);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getHead().next).toEqual(node2);
    expect(dll.getTail()).toEqual(node2);
  });

  test('remove() in between', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);
    dll.append(node3);

    expect(dll.getSize()).toEqual(3);

    dll.remove(node2);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getHead().next).toEqual(node3);
    expect(dll.getTail()).toEqual(node3);
  });

  test('insertAfter() head', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);

    dll.append(node1);

    expect(dll.getSize()).toEqual(1);

    dll.insertAfter(node2, node1);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getTail()).toEqual(node2);
  });

  test('insertAfter() tail', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);

    expect(dll.getSize()).toEqual(2);

    dll.insertAfter(node3, node2);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getHead().next).toEqual(node2);
    expect(dll.getHead().next.next).toEqual(node3);
    expect(dll.getTail()).toEqual(node3);
  });

  test('insertAfter() node in between', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);

    expect(dll.getSize()).toEqual(2);

    dll.insertAfter(node3, node1);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getHead().next).toEqual(node3);
    expect(dll.getHead().next.next).toEqual(node2);
    expect(dll.getTail()).toEqual(node2);
  });

  test('insertBefore() head', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);

    dll.append(node1);

    expect(dll.getSize()).toEqual(1);

    dll.insertBefore(node2, node1);

    expect(dll.getSize()).toEqual(2);
    expect(dll.getHead()).toEqual(node2);
    expect(dll.getTail()).toEqual(node1);
  });

  test('insertBefore() tail', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);

    expect(dll.getSize()).toEqual(2);

    dll.insertBefore(node3, node2);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(node1);
    expect(dll.getHead().next).toEqual(node3);
    expect(dll.getHead().next.next).toEqual(node2);
    expect(dll.getTail()).toEqual(node2);
  });

  test('insertBefore() node in between', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);

    expect(dll.getSize()).toEqual(2);

    dll.insertBefore(node3, node1);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead()).toEqual(node3);
    expect(dll.getHead().next).toEqual(node1);
    expect(dll.getHead().next.next).toEqual(node2);
    expect(dll.getTail()).toEqual(node2);
  });

  test('find()', () => {
    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token);
    const node2 = new Node<Token>(token);
    const node3 = new Node<Token>(token);

    dll.append(node1);
    dll.append(node2);
    dll.append(node3);

    expect(dll.getSize()).toEqual(3);

    expect(dll.find(node => node === dll.getHead())).toEqual(node1);
    expect(dll.find(node => node === dll.getTail())).toEqual(node3);
    expect(dll.find(node => node.data.value === 'ok')).toEqual(null);
  });

  test('fromArray()', () => {
    const data = [token, token, token];

    const dll = DoublyLinkedList.fromArray<Token>(data);

    expect(dll.getSize()).toEqual(3);
    expect(dll.getHead().backward(1)).toEqual(null);
    expect(dll.getHead().forward(1)).not.toEqual(null);
    expect(dll.getHead().forward(2)).not.toEqual(null);
    expect(dll.getHead().forward(3)).toEqual(null);
    expect(dll.getTail().forward(1)).toEqual(null);
    expect(dll.getTail().backward(1)).not.toEqual(null);
    expect(dll.getTail().backward(2)).not.toEqual(null);
    expect(dll.getTail().backward(3)).toEqual(null);
  });

  test('toArray()', () => {
    const data = [token, token, token];

    const dll = DoublyLinkedList.fromArray<Token>(data);

    expect(dll.getSize()).toEqual(3);
    expect(dll.toArray().length).toEqual(3);
    expect(dll.toArray()[0].data).toEqual(data[0]);
    expect(dll.toArray()[1].data).toEqual(data[1]);
    expect(dll.toArray()[2].data).toEqual(data[2]);
  });

  test('reverse()', () => {
    const token1 = new Token('test1');
    const token2 = new Token('test2');
    const token3 = new Token('test3');
    const token4 = new Token('test4');

    const dll = new DoublyLinkedList<Token>();
    const node1 = new Node<Token>(token1);
    const node2 = new Node<Token>(token2);
    const node3 = new Node<Token>(token3);
    const node4 = new Node<Token>(token4);

    dll.append(node1);
    dll.append(node2);
    dll.append(node3);
    dll.append(node4);

    expect(dll.getSize()).toEqual(4);

    dll.reverse();

    expect(dll.getSize()).toEqual(4);
    expect(dll.getHead()).toEqual(node4);
    expect(dll.getHead().next).toEqual(node3);
    expect(dll.getHead().next.next).toEqual(node2);
    expect(dll.getHead().next.next.next).toEqual(node1);
    expect(dll.getTail()).toEqual(node1);
  });

  test('Symbol.iterator()', () => {
    const dll = new DoublyLinkedList<Token>();

    const firstToken = new Token('first');
    const firstNode = new Node<Token>(firstToken);

    const secondToken = new Token('second');
    const secondNode = new Node<Token>(secondToken);

    const thirdToken = new Token('third');
    const thirdNode = new Node<Token>(thirdToken);

    dll.append(firstNode);
    dll.append(secondNode);
    dll.append(thirdNode);

    let index = 0;

    for (const node of dll) {
      if (index === 0) expect(node.data).toEqual(firstToken);
      if (index === 1) expect(node.data).toEqual(secondToken);
      if (index === 2) expect(node.data).toEqual(thirdToken);

      index++;
    }
  });
});
