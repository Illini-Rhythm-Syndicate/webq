import Queue from "./Queue.js";
import { sendTurnNotification } from "../bot.js";

const AUTO_POP_MS = 15 * 60 * 1000;

class QueueManager {
  constructor() {
    this.queues = new Map();
    this.userQueueMap = new Map();
    this.timers = new Map();
    this.nextId = 1;
  }

  createQueue(name) {
    const id = String(this.nextId++);
    this.queues.set(id, new Queue(id, name));
    return this.queues.get(id);
  }

  deleteQueue(queueId) {
    const queue = this.queues.get(queueId);
    if (!queue) return false;
    for (const member of queue.members) {
      this.userQueueMap.delete(member.id);
      this._clearTimer(member.id);
    }
    return this.queues.delete(queueId);
  }

  getQueue(queueId) {
    return this.queues.get(queueId) || null;
  }

  getAllQueues() {
    return Array.from(this.queues.values()).map((q) => q.toJSON());
  }

  join(queueId, user, notificationsOptIn = false) {
    if (this.userQueueMap.has(user.id))
      return { ok: false, error: "Already in a queue" };
    const queue = this.queues.get(queueId);
    if (!queue) return { ok: false, error: "Queue not found" };
    queue.push({ ...user, notificationsOptIn });
    this.userQueueMap.set(user.id, queueId);
    if (queue.peek().id === user.id) {
      this._startTimerForFront(queueId);
    }
    return { ok: true };
  }

  leave(userId) {
    const queueId = this.userQueueMap.get(userId);
    if (!queueId) return { ok: false, error: "Not in any queue" };
    const queue = this.queues.get(queueId);
    const wasFirst = queue.peek()?.id === userId;
    queue.remove(userId);
    this.userQueueMap.delete(userId);
    this._clearTimer(userId);
    if (wasFirst) this._startTimerForFront(queueId);
    return { ok: true };
  }

  finish(userId) {
    return this.leave(userId);
  }

  getStatus(userId) {
    const queueId = this.userQueueMap.get(userId);
    if (!queueId) return { inQueue: false };
    const queue = this.queues.get(queueId);
    const position = queue.getPosition(userId);

    const front = queue.peek();
    let frontRemainingMs = 12 * 60 * 1000;
    if (front && this.timers.has(front.id)) {
      const { startedAt } = this.timers.get(front.id);
      const elapsed = Date.now() - startedAt;
      frontRemainingMs = Math.max(0, 12 * 60 * 1000 - elapsed);
    }

    const estimatedWaitMs =
      position === 0 ? 0 : frontRemainingMs + (position - 1) * 12 * 60 * 1000;

    return {
      inQueue: true,
      queueId,
      queueName: queue.name,
      position,
      isMyTurn: position === 0,
      members: queue.members.map((m) => ({ id: m.id, username: m.username })),
      estimatedWaitMs,
    };
  }

  _startTimerForFront(queueId) {
    const queue = this.queues.get(queueId);
    if (!queue) return;
    const front = queue.peek();
    if (front) {
      if (!front.id.startsWith("walkin_") && front.notificationsOptIn) {
        sendTurnNotification(front.id, queue.name);
      }
      this._startTimer(front.id, queueId);
    }
  }

  _startTimer(userId, queueId) {
    this._clearTimer(userId);
    const startedAt = Date.now();
    const handle = setTimeout(() => {
      console.log(`Auto-popping ${userId} from queue ${queueId} after 15 min`);
      this.leave(userId);
    }, AUTO_POP_MS);
    this.timers.set(userId, { handle, startedAt });
  }

  _clearTimer(userId) {
    if (this.timers.has(userId)) {
      clearTimeout(this.timers.get(userId).handle);
      this.timers.delete(userId);
    }
  }
}

const queueManager = new QueueManager();
export default queueManager;
