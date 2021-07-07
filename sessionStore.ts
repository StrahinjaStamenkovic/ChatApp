class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, session: any) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  public sessions: Map<any, any>;
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id: string): any {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: any) {
    this.sessions.set(id, session);
  }

  findAllSessions(): IterableIterator<any> {
    return this.sessions.values();
  }
}

module.exports = {
  InMemorySessionStore,
};
