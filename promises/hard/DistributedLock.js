// Problem Description – Distributed Mutex with Expiry (TTL Lock)
//
// You are required to implement a DistributedLock that provides exclusive access
// to a resource identified by a lockKey.
//
// Only one client can hold a lock at a time.
// If the lock is already held, new acquire requests must wait in a FIFO queue.
//
// Requirements:
// 1. Exclusive Access: only one active lock holder per lockKey
// 2. FIFO Queue: waiting acquire() calls must be served in order
// 3. TTL Expiry (Deadlock Guard):
//    - each lock is granted with a ttl (ms)
//    - after ttl expires, lock must auto-expire and be granted to next waiter
// 4. Safe Unlock:
//    - unlock() should release the lock immediately
//    - if unlock() is called after ttl already expired, ignore it
// 5. Lock Extension:
//    - extend(additionalMs) should increase ttl only if caller still owns the lock
//    - if caller lost ownership, ignore / reject
//
class DistributedLock {
<<<<<<< HEAD
  constructor() {
    this.locks = new Map(); // lockKey -> state
    this.ownerId = 0;
  }

  async acquire(lockKey, ttlMs) {
    if (!this.locks.has(lockKey)) {
      this.locks.set(lockKey, {
        currentOwner: null,
        queue: [],
        timer: null,
        expiry: 0
      });
    }

    const state = this.locks.get(lockKey);

    return new Promise((resolve) => {
      const request = () => {
        const ownerToken = ++this.ownerId;

        state.currentOwner = ownerToken;
        state.expiry = Date.now() + ttlMs;

        state.timer = setTimeout(() => {
          // Auto-expire
          if (state.currentOwner === ownerToken) {
            state.currentOwner = null;
            state.timer = null;
            this._grantNext(lockKey);
          }
        }, ttlMs);

        resolve(this._createLockHandle(lockKey, ownerToken));
      };

      if (!state.currentOwner) {
        request();
      } else {
        state.queue.push(request);
      }
    });
  }

  _grantNext(lockKey) {
    const state = this.locks.get(lockKey);
    if (!state) return;

    if (!state.currentOwner && state.queue.length > 0) {
      const next = state.queue.shift();
      next();
    }
  }

  _createLockHandle(lockKey, ownerToken) {
    const state = this.locks.get(lockKey);

    return {
      unlock: () => {
        if (!state || state.currentOwner !== ownerToken) {
          return; // Ignore stale unlock
        }

        clearTimeout(state.timer);
        state.currentOwner = null;
        state.timer = null;

        this._grantNext(lockKey);
      },

      extend: (additionalMs) => {
        if (!state || state.currentOwner !== ownerToken) {
          return false; // Lost ownership
        }

        const remaining = state.expiry - Date.now();
        const newTtl = Math.max(0, remaining) + additionalMs;

        clearTimeout(state.timer);

        state.expiry = Date.now() + newTtl;

        state.timer = setTimeout(() => {
          if (state.currentOwner === ownerToken) {
            state.currentOwner = null;
            state.timer = null;
            this._grantNext(lockKey);
          }
        }, newTtl);

        return true;
      }
    };
  }
=======
  constructor() { }
  async acquire(lockKey, ttlMs) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
}

module.exports = DistributedLock;
