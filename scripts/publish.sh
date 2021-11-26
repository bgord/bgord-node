#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

CURRENT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

if test $CURRENT_BRANCH != "master"
then
  error "You have to have the master branch checked out"
  exit 1
fi
success "You are on the master branch"

if test $(git rev-parse master) != $(git rev-parse origin/master)
then
    error "There are some differences between master and origin/master"
    info "Please, sync them"
    exit 1
fi
success "All changes are pushed to the remote master branch"

info "Run yarn version --{major,minor,patch}"
press_enter_to_continue

info "Push to the master branch with --follow-tags"
press_enter_to_continue

info "Run npm publish --dry-run"
press_enter_to_continue

info "Run npm publish"
press_enter_to_continue
