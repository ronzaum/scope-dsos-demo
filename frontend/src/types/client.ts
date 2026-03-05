/**
 * Types for the client API response shape.
 * Matches what the API server returns from parsed markdown files.
 */

export interface ClientIssue {
  id: string;
  title: string;
  status: string;
  severity: string;
  severityEmoji?: string;
  logged?: string;
  date?: string;
  source?: string;
  category?: string;
  description?: string;
  rootCause?: string;
  resolution?: string;
  resolutionDate?: string;
  crossClientScan?: string;
  prevention?: string;
  playbookUpdate?: string;
  note?: string;
  affectedUsers?: string;
}

export interface ClientInteraction {
  date: string;
  source: string;
  summary: string;
}

export interface ClientStakeholder {
  name: string;
  role: string;
  priority: string;
  trustLevel: string | number;
  communicationStyle?: string;
  commStyle?: string;
  notes?: string;
}

export interface FrictionPoint {
  severity: string;
  emoji?: string;
  text: string;
}

export interface ConstraintMapUser {
  userType?: string;
  type?: string;
  count: number | string;
  topPainPoint?: string;
  painPoint?: string;
  adoptionSignal?: string;
}

export interface ProductMatchEntry {
  need: string;
  scopeCapability?: string;
  capability?: string;
  fit: string;
  priority: string;
}

export interface ClientConstraintMap {
  userMap: ConstraintMapUser[];
  solutionsAudit: {
    previousTools?: string;
    frictionPoints?: FrictionPoint[];
  };
  productMatch: ProductMatchEntry[];
  wedgeUseCase?: string;
  wedge?: string;
}

export interface DeploymentPhase {
  name?: string;
  phase?: string;
  status: string;
  timeline?: string;
  duration?: string;
  startDate?: string;
  items?: string[];
  features?: string[];
}

export interface DeploymentRisk {
  risk: string;
  likelihood: string;
  impact: string;
  mitigation: string;
  status: string;
}

export interface ClientDeploymentPlan {
  method: { name: string; rationale: string } | string;
  rationale?: string;
  phases: DeploymentPhase[];
  riskRegister?: DeploymentRisk[];
  risks?: DeploymentRisk[];
}

export interface ClientDeploymentState {
  stage?: string;
  phase?: string;
  featuresLive?: string;
  users?: string;
  adoptionPercent?: number | null;
  adoption?: number | null;
  baselineImprovement?: string;
  featuresInPhase2?: string;
}

export interface ClientProfile {
  sector?: string;
  size?: string;
  inspectionTypes?: string;
  geography?: string;
  source?: string;
  dateCreated?: string;
  [key: string]: string | undefined;
}

export interface ClientCommercial {
  contractStatus?: string;
  contractValue?: string;
  term?: string;
  renewalDate?: string;
  economicBuyer?: string;
  expansionPotential?: string;
  successCriteria?: string;
  [key: string]: string | undefined;
}

export interface PlaybookContribution {
  date: string;
  description: string;
}

/** Full client API response for /api/clients/:slug */
export interface ClientApiResponse {
  name: string;
  slug: string;
  health?: string;
  profile: ClientProfile;
  commercial: ClientCommercial;
  deploymentState: ClientDeploymentState;
  constraintMap?: ClientConstraintMap;
  deploymentPlan?: ClientDeploymentPlan;
  issueLog?: ClientIssue[];
  interactionHistory?: ClientInteraction[];
  stakeholderMap?: ClientStakeholder[];
  playbookContributions?: PlaybookContribution[];
}
