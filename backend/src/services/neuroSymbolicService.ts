import { PythonShell } from 'python-shell';
import { knowledgeGraphService } from './knowledgeGraphService';

// Types for Neuro-Symbolic Reasoning
export interface LogicalPlan {
  id: string;
  goal: string;
  tasks: LogicalTask[];
  dependencies: LogicalDependency[];
  verificationRules: VerificationRule[];
  timestamp: Date;
}

export interface LogicalTask {
  id: string;
  description: string;
  type: 'reasoning' | 'execution' | 'verification' | 'synthesis';
  preconditions: string[];
  postconditions: string[];
  estimatedComplexity: number;
  dependencies: string[];
}

export interface LogicalDependency {
  sourceTaskId: string;
  targetTaskId: string;
  type: 'sequential' | 'parallel' | 'conditional';
  condition?: string;
}

export interface VerificationRule {
  id: string;
  type: 'logical_consistency' | 'factual_accuracy' | 'goal_alignment' | 'temporal_validity';
  condition: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ReasoningResult {
  success: boolean;
  plan?: LogicalPlan;
  verificationResults: VerificationResult[];
  confidence: number;
  reasoning: string;
  alternatives?: LogicalPlan[];
}

export interface VerificationResult {
  ruleId: string;
  passed: boolean;
  details: string;
  severity: 'critical' | 'warning' | 'info';
}

export class NeuroSymbolicService {
  private reasoningEngine: any;
  private verificationRules: Map<string, VerificationRule> = new Map();

  constructor() {
    this.initializeVerificationRules();
  }

  private initializeVerificationRules(): void {
    // Core verification rules for consciousness reasoning
    const rules: VerificationRule[] = [
      {
        id: 'logical_consistency',
        type: 'logical_consistency',
        condition: 'No contradictory statements in reasoning chain',
        severity: 'critical'
      },
      {
        id: 'temporal_validity',
        type: 'temporal_validity', 
        condition: 'All temporal relationships maintain causality',
        severity: 'critical'
      },
      {
        id: 'goal_alignment',
        type: 'goal_alignment',
        condition: 'Reasoning aligns with stated consciousness goals',
        severity: 'warning'
      },
      {
        id: 'factual_accuracy',
        type: 'factual_accuracy',
        condition: 'Claims are supported by knowledge graph evidence',
        severity: 'warning'
      }
    ];

    rules.forEach(rule => this.verificationRules.set(rule.id, rule));
  }

  // Planner: Decompose high-level goals into hierarchical task graphs
  async planConsciousnessReasoning(goal: string, context: any): Promise<LogicalPlan> {
    console.log('🧠 Planning consciousness reasoning for goal:', goal);
    
    const plan: LogicalPlan = {
      id: `plan_${Date.now()}`,
      goal,
      tasks: [],
      dependencies: [],
      verificationRules: Array.from(this.verificationRules.values()),
      timestamp: new Date()
    };

    // Decompose goal into logical tasks
    const tasks = await this.decomposeGoal(goal, context);
    plan.tasks = tasks;

    // Generate dependencies between tasks
    plan.dependencies = this.generateDependencies(tasks);

    console.log('✅ Generated logical plan with', tasks.length, 'tasks');
    return plan;
  }

  private async decomposeGoal(goal: string, context: any): Promise<LogicalTask[]> {
    const tasks: LogicalTask[] = [];
    
    // Task 1: Context Analysis
    tasks.push({
      id: 'context_analysis',
      description: 'Analyze current consciousness context and state',
      type: 'reasoning',
      preconditions: [],
      postconditions: ['context_understood'],
      estimatedComplexity: 0.3,
      dependencies: []
    });

    // Task 2: Goal Decomposition
    tasks.push({
      id: 'goal_decomposition', 
      description: 'Break down high-level goal into sub-objectives',
      type: 'reasoning',
      preconditions: ['context_understood'],
      postconditions: ['sub_goals_identified'],
      estimatedComplexity: 0.4,
      dependencies: ['context_analysis']
    });

    // Task 3: Knowledge Retrieval
    tasks.push({
      id: 'knowledge_retrieval',
      description: 'Retrieve relevant consciousness patterns from knowledge graph',
      type: 'execution',
      preconditions: ['sub_goals_identified'],
      postconditions: ['relevant_knowledge_retrieved'],
      estimatedComplexity: 0.5,
      dependencies: ['goal_decomposition']
    });

    // Task 4: Pattern Synthesis
    tasks.push({
      id: 'pattern_synthesis',
      description: 'Synthesize patterns and generate insights',
      type: 'synthesis',
      preconditions: ['relevant_knowledge_retrieved'],
      postconditions: ['insights_generated'],
      estimatedComplexity: 0.7,
      dependencies: ['knowledge_retrieval']
    });

    // Task 5: Verification
    tasks.push({
      id: 'verification',
      description: 'Verify logical consistency and factual accuracy',
      type: 'verification',
      preconditions: ['insights_generated'],
      postconditions: ['reasoning_verified'],
      estimatedComplexity: 0.6,
      dependencies: ['pattern_synthesis']
    });

    return tasks;
  }

  private generateDependencies(tasks: LogicalTask[]): LogicalDependency[] {
    const dependencies: LogicalDependency[] = [];
    
    for (const task of tasks) {
      for (const depId of task.dependencies) {
        dependencies.push({
          sourceTaskId: depId,
          targetTaskId: task.id,
          type: 'sequential'
        });
      }
    }

    return dependencies;
  }

  // Verifier: Check logical soundness before execution
  async verifyReasoning(plan: LogicalPlan, context: any): Promise<VerificationResult[]> {
    console.log('🔍 Verifying reasoning plan:', plan.id);
    
    const results: VerificationResult[] = [];

    // Verify logical consistency
    const logicalConsistency = await this.verifyLogicalConsistency(plan, context);
    results.push(logicalConsistency);

    // Verify temporal validity
    const temporalValidity = await this.verifyTemporalValidity(plan, context);
    results.push(temporalValidity);

    // Verify goal alignment
    const goalAlignment = await this.verifyGoalAlignment(plan, context);
    results.push(goalAlignment);

    // Verify factual accuracy
    const factualAccuracy = await this.verifyFactualAccuracy(plan, context);
    results.push(factualAccuracy);

    console.log('✅ Verification complete:', results.filter(r => r.passed).length, '/', results.length, 'passed');
    return results;
  }

  private async verifyLogicalConsistency(plan: LogicalPlan, context: any): Promise<VerificationResult> {
    // Check for contradictory statements in the plan
    const contradictions = this.detectContradictions(plan);
    
    return {
      ruleId: 'logical_consistency',
      passed: contradictions.length === 0,
      details: contradictions.length > 0 ? `Found ${contradictions.length} contradictions` : 'No contradictions detected',
      severity: 'critical'
    };
  }

  private async verifyTemporalValidity(plan: LogicalPlan, context: any): Promise<VerificationResult> {
    // Check that temporal dependencies are valid
    const temporalErrors = this.detectTemporalErrors(plan);
    
    return {
      ruleId: 'temporal_validity',
      passed: temporalErrors.length === 0,
      details: temporalErrors.length > 0 ? `Found ${temporalErrors.length} temporal errors` : 'Temporal relationships valid',
      severity: 'critical'
    };
  }

  private async verifyGoalAlignment(plan: LogicalPlan, context: any): Promise<VerificationResult> {
    // Check that the plan aligns with the stated goal
    const alignmentScore = this.calculateGoalAlignment(plan);
    
    return {
      ruleId: 'goal_alignment',
      passed: alignmentScore > 0.7,
      details: `Goal alignment score: ${alignmentScore.toFixed(2)}`,
      severity: 'warning'
    };
  }

  private async verifyFactualAccuracy(plan: LogicalPlan, context: any): Promise<VerificationResult> {
    // Check that claims are supported by knowledge graph evidence
    const evidenceScore = await this.calculateEvidenceSupport(plan, context);
    
    return {
      ruleId: 'factual_accuracy',
      passed: evidenceScore > 0.6,
      details: `Evidence support score: ${evidenceScore.toFixed(2)}`,
      severity: 'warning'
    };
  }

  private detectContradictions(plan: LogicalPlan): string[] {
    const contradictions: string[] = [];
    
    // Simple contradiction detection - can be enhanced with more sophisticated logic
    const taskDescriptions = plan.tasks.map(t => t.description.toLowerCase());
    
    // Check for obvious contradictions
    if (taskDescriptions.some(d => d.includes('increase')) && 
        taskDescriptions.some(d => d.includes('decrease'))) {
      contradictions.push('Conflicting increase/decrease operations');
    }
    
    return contradictions;
  }

  private detectTemporalErrors(plan: LogicalPlan): string[] {
    const errors: string[] = [];
    
    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    for (const task of plan.tasks) {
      if (this.hasCircularDependency(task.id, plan.dependencies, visited, recursionStack)) {
        errors.push(`Circular dependency detected involving task: ${task.id}`);
      }
    }
    
    return errors;
  }

  private hasCircularDependency(
    taskId: string, 
    dependencies: LogicalDependency[], 
    visited: Set<string>, 
    recursionStack: Set<string>
  ): boolean {
    if (recursionStack.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    
    visited.add(taskId);
    recursionStack.add(taskId);
    
    const taskDeps = dependencies.filter(d => d.sourceTaskId === taskId);
    for (const dep of taskDeps) {
      if (this.hasCircularDependency(dep.targetTaskId, dependencies, visited, recursionStack)) {
        return true;
      }
    }
    
    recursionStack.delete(taskId);
    return false;
  }

  private calculateGoalAlignment(plan: LogicalPlan): number {
    // Simple goal alignment calculation
    const goalKeywords = plan.goal.toLowerCase().split(' ');
    const taskKeywords = plan.tasks.flatMap(t => t.description.toLowerCase().split(' '));
    
    const matches = goalKeywords.filter(keyword => 
      taskKeywords.some(taskKeyword => taskKeyword.includes(keyword))
    );
    
    return matches.length / goalKeywords.length;
  }

  private async calculateEvidenceSupport(plan: LogicalPlan, context: any): Promise<number> {
    // Query knowledge graph for supporting evidence
    try {
      const evidence = await knowledgeGraphService.queryConsciousnessPatterns({
        entityType: 'consciousness_state',
        limit: 10
      });
      
      // Calculate evidence support based on relevance
      const relevantEvidence = evidence.filter(e => 
        e.entity && e.entity.properties && 
        this.isRelevantToPlan(e.entity.properties, plan)
      );
      
      return relevantEvidence.length / Math.max(evidence.length, 1);
    } catch (error) {
      console.error('❌ Error calculating evidence support:', error);
      return 0.5; // Default to neutral if can't calculate
    }
  }

  private isRelevantToPlan(properties: any, plan: LogicalPlan): boolean {
    // Simple relevance check - can be enhanced
    const planText = plan.goal + ' ' + plan.tasks.map(t => t.description).join(' ');
    const propertyText = JSON.stringify(properties);
    
    const planWords = planText.toLowerCase().split(' ');
    const propertyWords = propertyText.toLowerCase().split(' ');
    
    const matches = planWords.filter(word => 
      propertyWords.some(propWord => propWord.includes(word))
    );
    
    return matches.length > 0;
  }

  // Governor: Enforce formal collaboration rules
  async governExecution(plan: LogicalPlan, verificationResults: VerificationResult[]): Promise<boolean> {
    console.log('⚖️ Governing execution for plan:', plan.id);
    
    // Check if any critical verifications failed
    const criticalFailures = verificationResults.filter(r => 
      r.severity === 'critical' && !r.passed
    );
    
    if (criticalFailures.length > 0) {
      console.log('❌ Execution blocked due to critical verification failures:', criticalFailures.length);
      return false;
    }
    
    // Check warning thresholds
    const warnings = verificationResults.filter(r => 
      r.severity === 'warning' && !r.passed
    );
    
    if (warnings.length > 2) {
      console.log('⚠️ Execution allowed but with warnings:', warnings.length);
    }
    
    console.log('✅ Execution approved');
    return true;
  }

  // Main reasoning orchestration
  async reasonAboutConsciousness(query: string, context: any): Promise<ReasoningResult> {
    console.log('🧠 Starting neuro-symbolic reasoning for:', query);
    
    try {
      // Step 1: Plan
      const plan = await this.planConsciousnessReasoning(query, context);
      
      // Step 2: Verify
      const verificationResults = await this.verifyReasoning(plan, context);
      
      // Step 3: Govern
      const executionApproved = await this.governExecution(plan, verificationResults);
      
      // Step 4: Generate result
      const success = executionApproved && verificationResults.filter(r => r.passed).length >= 2;
      const confidence = this.calculateConfidence(verificationResults);
      
      const reasoning = this.generateReasoningExplanation(plan, verificationResults);
      
      return {
        success,
        plan,
        verificationResults,
        confidence,
        reasoning
      };
      
    } catch (error) {
      console.error('❌ Neuro-symbolic reasoning failed:', error);
      return {
        success: false,
        verificationResults: [],
        confidence: 0,
        reasoning: 'Reasoning failed due to internal error'
      };
    }
  }

  private calculateConfidence(verificationResults: VerificationResult[]): number {
    const totalRules = verificationResults.length;
    const passedRules = verificationResults.filter(r => r.passed).length;
    
    if (totalRules === 0) return 0;
    
    // Weight critical rules more heavily
    const criticalPassed = verificationResults.filter(r => r.severity === 'critical' && r.passed).length;
    const criticalTotal = verificationResults.filter(r => r.severity === 'critical').length;
    
    const criticalScore = criticalTotal > 0 ? criticalPassed / criticalTotal : 1;
    const overallScore = passedRules / totalRules;
    
    return (criticalScore * 0.7) + (overallScore * 0.3);
  }

  private generateReasoningExplanation(plan: LogicalPlan, verificationResults: VerificationResult[]): string {
    const passedCount = verificationResults.filter(r => r.passed).length;
    const totalCount = verificationResults.length;
    
    return `Neuro-symbolic reasoning completed with ${passedCount}/${totalCount} verifications passed. ` +
           `Plan includes ${plan.tasks.length} logical tasks with ${plan.dependencies.length} dependencies. ` +
           `Reasoning confidence: ${this.calculateConfidence(verificationResults).toFixed(2)}`;
  }
}

export const neuroSymbolicService = new NeuroSymbolicService(); 