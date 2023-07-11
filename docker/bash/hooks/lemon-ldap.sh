#!/usr/bin/env bash

function _hook_lemon_ldap() {
  # Sleep to wait for configuration initialization
  echo "Restore LemonLDAP configuration"
  cd ${WORKING_DIR}
  docker-compose exec fia-llng-low bash /scripts/init.sh
  echo "Loaded !"
}
