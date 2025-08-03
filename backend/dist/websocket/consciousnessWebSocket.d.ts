import { Server as HTTPServer } from 'http';
import { LiveConsciousnessData, BreakthroughEvent, CollectivePattern } from '../types/consciousness';
export declare class ConsciousnessWebSocket {
    private io;
    private connectedUsers;
    constructor(httpServer: HTTPServer);
    private setupEventHandlers;
    private handleBreakthroughEvent;
    private calculateGlobalImpact;
    broadcastConsciousnessSharing(data: LiveConsciousnessData): void;
    broadcastBreakthroughEvent(data: BreakthroughEvent): void;
    broadcastCollectivePattern(data: CollectivePattern): void;
    getConnectedUsersCount(): number;
    getConnectedUsers(): Map<string, any>;
}
//# sourceMappingURL=consciousnessWebSocket.d.ts.map