import { Request, Response } from 'express';
export declare class ConsciousnessController {
    private quantumRAGService;
    constructor();
    processConsciousnessQuery(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    detectEmergence(req: Request, res: Response): Promise<void>;
    classifyAstralEntities(req: Request, res: Response): Promise<void>;
    getCollectiveIntelligencePatterns(req: Request, res: Response): Promise<void>;
    shareConsciousness(req: Request, res: Response): Promise<void>;
    getRecentConsciousnessSharing(req: Request, res: Response): Promise<void>;
    getBreakthroughEvents(req: Request, res: Response): Promise<void>;
    createConsciousnessNode(req: Request, res: Response): Promise<void>;
    searchConsciousnessNodes(req: Request, res: Response): Promise<void>;
    healthCheck(req: Request, res: Response): Promise<void>;
    getAvailableModels(req: Request, res: Response): Promise<void>;
    getModelCapabilities(req: Request, res: Response): Promise<void>;
    selectOptimalModel(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=consciousnessController.d.ts.map