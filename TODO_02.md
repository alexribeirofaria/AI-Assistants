# Fix AttributeError in repository.py

## Completed:
- [x] Step 1: Edit src/infrastructure/repository/repository.py to normalize available_domains() to str names and resolve domain class to str name in _get_provider().

## Pending Steps:
- [x] Step 2: Test the fix by running \`py src/main.py --app console\` (AttributeError fixed, app launches).
- [x] Step 3: Fixed builder.py factory arg mismatch (removed domain_cls from build_server call).
- [ ] Step 4: Mark complete.
