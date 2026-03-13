import Queue from "./Queue.js";

class QueueManager {
  constructor() {
    this.queues = new Map();
    this.nextId = 1;
  }

  createQueue(name) {
    const id = String(this.nextId++);
    this.queues.set(id, new Queue(id, name));
    return this.queues.get(id);
  }

  deleteQueue(queueId) {
    return this.queues.delete(queueId);
  }

  getQueue(queueId) {
    return this.queues.get(queueId) || null;
  }

  getAllQueues() {
    return Array.from(this.queues.values()).map((q) => q.toJSON());
  }
}

const queueManager = new QueueManager();
export default queueManager;
