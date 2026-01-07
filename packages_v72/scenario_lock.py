"""
CHE·NU™ — Scenario-Lock Simulation System (Standalone)
Version: V1.0
Date: 2026-01-07

run = template × factors × module_set
GOUVERNANCE > EXÉCUTION
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import uuid4


class RunStatus(str, Enum):
    PLANNED = "planned"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ActionType(str, Enum):
    ACTION = "action"
    CALL = "call"
    MEETING = "meeting"
    ACTIVATE = "activate"
    EXPECT = "expect"
    INJECT = "inject"


@dataclass
class Factor:
    id: str
    name: str
    value_type: str
    possible_values: List[Any] = field(default_factory=list)
    default_value: Any = None


@dataclass
class SimulationRun:
    id: str = field(default_factory=lambda: str(uuid4()))
    template_id: str = ""
    factors: Dict[str, Any] = field(default_factory=dict)
    enabled_modules: List[str] = field(default_factory=list)
    status: RunStatus = RunStatus.PLANNED
    current_day: int = 0
    events: List[Dict[str, Any]] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    governance_violations: List[Dict[str, Any]] = field(default_factory=list)


class ScenarioLockEngine:
    """Moteur de simulation Scenario-Lock"""
    
    CORE_FACTORS = [
        Factor("user_profile", "Profil", "enum", ["entrepreneur", "freelance", "individual"], "individual"),
        Factor("tech_savviness", "Tech Level", "enum", ["low", "medium", "high"], "medium"),
        Factor("governance_strictness", "Gouvernance", "enum", ["minimal", "balanced", "strict"], "balanced"),
    ]
    
    TEMPLATES = {
        "onboarding_30d": {
            "name": "Onboarding 30j",
            "duration": 30,
            "actions": {
                1: ["ACTION login", "ACTIVATE core.identity"],
                7: ["EXPECT threads >=3"],
                15: ["ACTIVATE meetings.manager"],
                30: ["EXPECT onboarding_complete true"],
            }
        }
    }
    
    def __init__(self):
        self._runs: Dict[str, SimulationRun] = {}
    
    def create_run(self, template_id: str, factors: Dict[str, Any], modules: List[str]) -> SimulationRun:
        if template_id not in self.TEMPLATES:
            raise ValueError(f"Template inconnu: {template_id}")
        run = SimulationRun(template_id=template_id, factors=factors, enabled_modules=modules)
        self._runs[run.id] = run
        return run
    
    def start_run(self, run_id: str) -> bool:
        if run_id not in self._runs:
            return False
        self._runs[run_id].status = RunStatus.RUNNING
        self._runs[run_id].current_day = 1
        return True
    
    def execute_day(self, run_id: str) -> List[Dict[str, Any]]:
        run = self._runs.get(run_id)
        if not run or run.status != RunStatus.RUNNING:
            return []
        
        template = self.TEMPLATES[run.template_id]
        actions = template["actions"].get(run.current_day, [])
        events = [{"day": run.current_day, "action": a, "synthetic": True} for a in actions]
        run.events.extend(events)
        run.current_day += 1
        
        if run.current_day > template["duration"]:
            run.status = RunStatus.COMPLETED
        
        return events
    
    def run_complete(self, template_id: str, factors: Dict[str, Any], modules: List[str]) -> Dict[str, Any]:
        run = self.create_run(template_id, factors, modules)
        self.start_run(run.id)
        while run.status == RunStatus.RUNNING:
            self.execute_day(run.id)
        return {
            "run_id": run.id,
            "status": run.status.value,
            "days": run.current_day - 1,
            "events": len(run.events),
            "violations": len(run.governance_violations),
        }


def test_scenario_lock():
    engine = ScenarioLockEngine()
    result = engine.run_complete("onboarding_30d", {"user_profile": "entrepreneur"}, [])
    assert result["status"] == "completed"
    assert result["days"] == 30
    print("✓ Test 1: Simulation complète")
    print("✓ Test 2: Status completed")
    print("✓ Test 3: 30 jours")
    print("\n✅ Scenario Lock tests passent!")


if __name__ == "__main__":
    test_scenario_lock()
