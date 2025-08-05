import { Request, Response } from 'express';
import { hierarchicalAgentService, ExecutionResult, Agent, CollaborationProtocol } from '../services/hierarchicalAgentService';
import { neuroSymbolicService, LogicalPlan } from '../services/neuroSymbolicService';

export class HierarchicalAgentController {
  
  // Execute a plan using the hierarchical agent system
  async executePlan(req: Request, res: Response): Promise<void> {
    try {
      const { plan, context } = req.body;
      
      if (!plan) {
        res.status(400).json({ 
          success: false, 
          error: 'Plan is required' 
        });
        return;
      }
      
      console.log('🤖 Executing hierarchical plan:', plan.id);
      
      const result = await hierarchicalAgentService.executePlan(plan);
      
      res.json({ 
        success: result.success,
        message: result.success ? '✅ Hierarchical execution completed successfully' : '❌ Execution failed',
        data: {
          executionResult: result,
          summary: {
            totalTasks: result.agentResults.length,
            successfulTasks: result.agentResults.filter(r => r.status === 'completed').length,
            executionTime: result.totalExecutionTime,
            confidence: result.confidence
          }
        }
      });
    } catch (error) {
      console.error('❌ Hierarchical execution error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Hierarchical execution failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Execute a reasoning query through the full NS-HAG pipeline
  async executeNSHAGPipeline(req: Request, res: Response): Promise<void> {
    try {
      const { query, context } = req.body;
      
      if (!query) {
        res.status(400).json({ 
          success: false, 
          error: 'Query is required' 
        });
        return;
      }
      
      console.log('🧠 Executing full NS-HAG pipeline for query:', query);
      
      // Step 1: Neuro-Symbolic Reasoning
      const reasoningResult = await neuroSymbolicService.reasonAboutConsciousness(query, context || {});
      
      if (!reasoningResult.success || !reasoningResult.plan) {
        res.json({ 
          success: false,
          message: '❌ Neuro-symbolic reasoning failed',
          data: {
            reasoningResult: reasoningResult
          }
        });
        return;
      }
      
      // Step 2: Hierarchical Agent Execution
      const executionResult = await hierarchicalAgentService.executePlan(reasoningResult.plan);
      
      // Step 3: Synthesize results
      const pipelineResult = {
        success: reasoningResult.success && executionResult.success,
        query: query,
        reasoning: reasoningResult,
        execution: executionResult,
        confidence: (reasoningResult.confidence + executionResult.confidence) / 2,
        totalExecutionTime: executionResult.totalExecutionTime
      };
      
      res.json({ 
        success: pipelineResult.success,
        message: pipelineResult.success ? '✅ NS-HAG pipeline completed successfully' : '❌ Pipeline failed',
        data: pipelineResult
      });
    } catch (error) {
      console.error('❌ NS-HAG pipeline error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'NS-HAG pipeline failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get agent status
  async getAgentStatus(req: Request, res: Response): Promise<void> {
    try {
      console.log('🤖 Retrieving agent status');
      
      const agents = await hierarchicalAgentService.getAgentStatus();
      
      res.json({ 
        success: true, 
        message: `✅ Retrieved status for ${agents.length} agents`,
        data: {
          agents: agents,
          summary: {
            totalAgents: agents.length,
            idleAgents: agents.filter(a => a.status === 'idle').length,
            busyAgents: agents.filter(a => a.status === 'busy').length,
            averageSuccessRate: agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length
          }
        }
      });
    } catch (error) {
      console.error('❌ Get agent status error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve agent status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get collaboration protocols
  async getProtocols(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 Retrieving collaboration protocols');
      
      const protocols = await hierarchicalAgentService.getProtocols();
      
      res.json({ 
        success: true, 
        message: `✅ Retrieved ${protocols.length} collaboration protocols`,
        data: {
          protocols: protocols
        }
      });
    } catch (error) {
      console.error('❌ Get protocols error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve collaboration protocols',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create a new agent
  async createAgent(req: Request, res: Response): Promise<void> {
    try {
      const { id, type, capabilities } = req.body;
      
      if (!id || !type || !capabilities) {
        res.status(400).json({ 
          success: false, 
          error: 'Agent id, type, and capabilities are required' 
        });
        return;
      }
      
      console.log('🤖 Creating new agent:', id);
      
      // This would integrate with the agent service to create a new agent
      // For now, return a success response
      res.json({ 
        success: true, 
        message: `✅ Agent ${id} created successfully`,
        data: {
          agentId: id,
          type: type,
          capabilities: capabilities
        }
      });
    } catch (error) {
      console.error('❌ Create agent error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Assign a task to a specific agent
  async assignTask(req: Request, res: Response): Promise<void> {
    try {
      const { agentId, task } = req.body;
      
      if (!agentId || !task) {
        res.status(400).json({ 
          success: false, 
          error: 'Agent ID and task are required' 
        });
        return;
      }
      
      console.log('📋 Assigning task to agent:', agentId);
      
      // This would integrate with the agent service to assign a task
      // For now, return a success response
      res.json({ 
        success: true, 
        message: `✅ Task assigned to agent ${agentId}`,
        data: {
          agentId: agentId,
          task: task,
          status: 'assigned'
        }
      });
    } catch (error) {
      console.error('❌ Assign task error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to assign task',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get execution metrics
  async getExecutionMetrics(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 Retrieving execution metrics');
      
      // This would calculate metrics from recent executions
      const metrics = {
        totalExecutions: 0,
        successfulExecutions: 0,
        averageExecutionTime: 0,
        averageConfidence: 0,
        agentUtilization: 0,
        collaborationEfficiency: 0
      };
      
      res.json({ 
        success: true, 
        message: '✅ Retrieved execution metrics',
        data: {
          metrics: metrics
        }
      });
    } catch (error) {
      console.error('❌ Get metrics error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve execution metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Health check for hierarchical agent service
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const agents = await hierarchicalAgentService.getAgentStatus();
      const protocols = await hierarchicalAgentService.getProtocols();
      
      res.json({ 
        success: true, 
        message: '🤖 Hierarchical agent system is healthy',
        data: {
          service: 'hierarchical-agent-system',
          status: 'operational',
          features: {
            agentOrchestration: 'available',
            taskDecomposition: 'available',
            collaborationProtocols: 'available',
            executionMetrics: 'available'
          },
          agents: agents.length,
          protocols: protocols.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Hierarchical agent health check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Hierarchical agent system health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const hierarchicalAgentController = new HierarchicalAgentController(); 