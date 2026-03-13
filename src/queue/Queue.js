class Queue {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.members = [];
  }

  push(user) {
    if (this.contains(user.id)) return false;
    this.members.push({ ...user, joinedAt: Date.now() });
    return true;
  }

  pop() {
    return this.members.shift() || null;
  }

  peek() {
    return this.members[0] || null;
  }

  remove(userId) {
    const index = this.members.findIndex((m) => m.id === userId);
    if (index === -1) return false;
    this.members.splice(index, 1);
    return true;
  }

  contains(userId) {
    return this.members.some((m) => m.id === userId);
  }

  getPosition(userId) {
    const index = this.members.findIndex((m) => m.id === userId);
    return index === -1 ? null : index;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      length: this.members.length,
      members: this.members,
    };
  }
}

export default Queue;
