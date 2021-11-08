#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

info "Make sure all changes are pushed to the master branch"
press_enter_to_continue

info "Run yarn version --{major,minor,patch}"
press_enter_to_continue

info "Push to the master branch with --follow-tags"
press_enter_to_continue

info "Run npm publish --dry-run"
press_enter_to_continue

info "Run npm publish"
press_enter_to_continue
