# FrameLearn — Development Strategy & Review Gates

## 1. Development Methodology
FrameLearn follows an incremental software engineering workflow tailored for academic rigour and quality assurance:

```
REQUIREMENTS → DESIGN → IMPLEMENTATION → TESTING → INTERNAL REVIEW → LECTURER REVIEW → APPROVAL → NEXT MILESTONE
```

## 2. Review Gate Protocol
No team member or subagent may begin work on subsequent business milestones (e.g., Auth, Bookings, Galleries) without explicit written approval following the Lecturer Review Gate.

### Review Checklist per Milestone:
1. All automated unit and lint checks pass clean.
2. Architecture rules and design system guidelines strictly adhered to.
3. No business logic implemented prematurely.
4. Comprehensive documentation updated.
5. Review summary submitted to project lecturer.

## 3. Version Control Strategy
- **`main`**: Production-ready, lecturer-approved releases.
- **`development`**: Integration branch for current milestone work.
- **`feature/*`**: Short-lived feature branches tied to approved tasks.
- **`fix/*`**: Bug fixes.
- **`docs/*`**: Documentation updates.
