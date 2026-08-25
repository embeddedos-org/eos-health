<!-- generated: eos-ai-scaffold -->
# Tasks

Working ledger for `eos-health`. The planner writes entries; each owning role
updates its own row. Roles are in [AGENTS.md](./AGENTS.md), the workflow in
[ORCHESTRATION.md](./ORCHESTRATION.md), the gate in [VERIFY.md](./VERIFY.md).

Status is one of: `todo`, `in-progress`, `blocked`, `review`, `done`.

## Active

| ID | Task | Owner | Mode | Status | Depends on |
|----|------|-------|------|--------|------------|
| —  | No active tasks. | — | — | — | — |

## Completed

| ID | Task | Owner | Verified by | Evidence |
|----|------|-------|-------------|----------|
| T-001 | Remove hardcoded `/home/ubuntu` paths that broke the repo off one machine | backend | reviewer | `verification/test_corner_cases.py:745` wrote its report to `/home/ubuntu/eos-health/verification/corner_case_report.json` and `clinical/analysis/visualize_clinical_results.py:25` wrote to `/home/ubuntu/eos-health/clinical/analysis/results`. Both are module-level statements, so the first raised `FileNotFoundError` during pytest collection and aborted the entire run. Both now resolve relative to `Path(__file__)`. The corner-case script runs to completion and writes its report. |
| T-002 | Make pytest collect the real suite instead of hardware scripts | testing | reviewer | Three files match `test_*.py` but are not pytest modules: `test_corner_cases.py` (standalone, body runs at import and ends in `sys.exit()`), `eos_factory_test.py` and `ble_hardware_test.py` (need `bleak` and real BLE hardware). Collecting them aborted the run before any real test executed. Added `pytest.ini` with `testpaths = verification/test_algorithms.py`. Also marked that file's own `test()` assertion helper `__test__ = False` — pytest was collecting it and erroring on its `name`/`result` parameters. Result: 10 passed, 0 errors (was 0 passed, 2 errors). |

---

## Task template

```markdown
### T-000 — <short title>

Owner: <role>
Mode: <see MODES.md>
Status: todo
Depends on: <task ids, or none>

Goal
: <one sentence: what is true afterwards that is not true now>

Acceptance criteria
: - <observable, checkable statement>
  - <observable, checkable statement>

Files in scope
: <paths the owner is expected to touch>

Out of scope
: <what this task deliberately does not change>

Risks
: <what could break, and what would reveal it>

Verification
: | Check | Command | Result |
  |-------|---------|--------|
  | <name> | `<command>` | `NOT RUN` |
```

## Verification commands for this repository

No verification command was detected at the repository root. Establish the build and test commands before reporting any check as `PASS`; until then every check is `UNKNOWN`.

## Rules

- One task per unit of work that can be verified on its own.
- Acceptance criteria are written before work starts and are not edited to match
  what was built. If they were wrong, say so and rewrite them explicitly.
- A task reaches `done` only when the definition of done in
  [ORCHESTRATION.md](./ORCHESTRATION.md) is met and the verification commands
  were actually run.
- `blocked` requires a note naming what it is blocked on and who can unblock it.
