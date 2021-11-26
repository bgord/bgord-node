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

git push --follow-tags
success "Pushed the version commit and new tag to origin/master"

if test ! $(npm whoami)
then
  error "You're not logged in to npm"
  info "Run [npm login], you can find the credentials on Keeper"
  exit 1
fi
success "You're logged in to npm"

npm publish --dry-run
success "Ran npm publish --dry-run"

info "Run npm publish"
press_enter_to_continue

npm publish

success "The package has been published!"
