import { Request, Response } from 'express';
import { neuroSymbolicService, LogicalPlan, ReasoningResult } from '../services/neuroSymbolicService';

export class NeuroSymbolicController {
  
  // Main reasoning endpoint
  async reasonAboutConsciousness(req: Request, res: Response): Promise<void> {
    try {
      const { query, context } = req.body;
      
      if (!query) {
        res.status(400).json({ 
          success: false, 
          error: 'Query is required' 
        });
        return;
      }
      
      console.log('🧠 Neuro-symbolic reasoning request:', query);
      
      const result = await neuroSymbolicService.reasonAboutConsciousness(query, context || {});
      
      res.json({ 
        success: result.success,
        message: result.success ? '✅ Neuro-symbolic reasoning completed successfully' : '❌ Reasoning failed verification',
        data: {
          reasoning: result.reasoning,
          confidence: result.confidence,
          plan: result.plan,
          verificationResults: result.verificationResults
        }
      });
    } catch (error) {
      console.error('❌ Neuro-symbolic reasoning error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Neuro-symbolic reasoning failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Plan generation endpoint
  async generatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { goal, context } = req.body;
      
      if (!goal) {
        res.status(400).json({ 
          success: false, 
          error: 'Goal is required' 
        });
        return;
      }
      
      console.log('🧠 Generating logical plan for goal:', goal);
      
      const plan = await neuroSymbolicService.planConsciousnessReasoning(goal, context || {});
      
      res.json({ 
        success: true, 
        message: `✅ Generated logical plan with ${plan.tasks.length} tasks`,
        data: {
          plan: plan
        }
      });
    } catch (error) {
      console.error('❌ Plan generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate logical plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Verification endpoint
  async verifyPlan(req: Request, res: Response): Promise<void> {
    try {
      const { plan, context } = req.body;
      
      if (!plan) {
        res.status(400).json({ 
          success: false, 
          error: 'Plan is required' 
        });
        return;
      }
      
      console.log('🔍 Verifying logical plan:', plan.id);
      
      const verificationResults = await neuroSymbolicService.verifyReasoning(plan, context || {});
      const passedCount = verificationResults.filter(r => r.passed).length;
      const totalCount = verificationResults.length;
      
      res.json({ 
        success: true, 
        message: `✅ Verification complete: ${passedCount}/${totalCount} passed`,
        data: {
          verificationResults: verificationResults,
          summary: {
            passed: passedCount,
            total: totalCount,
            criticalFailures: verificationResults.filter(r => r.severity === 'critical' && !r.passed).length,
            warnings: verificationResults.filter(r => r.severity === 'warning' && !r.passed).length
          }
        }
      });
    } catch (error) {
      console.error('❌ Plan verification error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to verify logical plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Execution governance endpoint
  async governExecution(req: Request, res: Response): Promise<void> {
    try {
      const { plan, verificationResults } = req.body;
      
      if (!plan || !verificationResults) {
        res.status(400).json({ 
          success: false, 
          error: 'Plan and verification results are required' 
        });
        return;
      }
      
      console.log('⚖️ Governing execution for plan:', plan.id);
      
      const executionApproved = await neuroSymbolicService.governExecution(plan, verificationResults);
      
      res.json({ 
        success: true, 
        message: executionApproved ? '✅ Execution approved' : '❌ Execution blocked',
        data: {
          executionApproved: executionApproved,
          plan: plan,
          verificationResults: verificationResults
        }
      });
    } catch (error) {
      console.error('❌ Execution governance error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to govern execution',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Confidence calculation endpoint
  async calculateConfidence(req: Request, res: Response): Promise<void> {
    try {
      const { verificationResults } = req.body;
      
      if (!verificationResults) {
        res.status(400).json({ 
          success: false, 
          error: 'Verification results are required' 
        });
        return;
      }
      
      console.log('🧮 Calculating confidence from verification results');
      
      const confidence = neuroSymbolicService['calculateConfidence'](verificationResults);
      
      res.json({ 
        success: true, 
        message: `✅ Confidence calculated: ${confidence.toFixed(2)}`,
        data: {
          confidence: confidence,
          verificationResults: verificationResults
        }
      });
    } catch (error) {
      console.error('❌ Confidence calculation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to calculate confidence',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get verification rules endpoint
  async getVerificationRules(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 Retrieving verification rules');
      
      const rules = Array.from(neuroSymbolicService['verificationRules'].values());
      
      res.json({ 
        success: true, 
        message: `✅ Retrieved ${rules.length} verification rules`,
        data: {
          rules: rules
        }
      });
    } catch (error) {
      console.error('❌ Get verification rules error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve verification rules',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Health check for neuro-symbolic service
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      res.json({ 
        success: true, 
        message: '🧠 Neuro-symbolic reasoning service is healthy',
        data: {
          service: 'neuro-symbolic-reasoning',
          status: 'operational',
          features: {
            planning: 'available',
            verification: 'available',
            governance: 'available',
            confidence: 'available'
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Neuro-symbolic health check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Neuro-symbolic service health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const neuroSymbolicController = new NeuroSymbolicController(); 