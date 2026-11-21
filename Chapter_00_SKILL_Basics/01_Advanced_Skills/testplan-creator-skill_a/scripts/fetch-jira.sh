#!/usr/bin/env bash
# Fetch a JIRA issue as JSON. Usage: ./fetch-jira.sh VWO-1234
# Needs: JIRA_BASE_URL (e.g. https://yourco.atlassian.net), JIRA_EMAIL, JIRA_API_TOKEN
#   - read from the environment, or from the nearest .env file (script folder up to repo root)
# Requires curl + jq. On Windows / without jq, use the equivalent: python fetch-jira.py VWO-1234
set -euo pipefail

KEY="${1:?usage: fetch-jira.sh <ISSUE-KEY>}"

# Load the nearest .env (does not override variables already set in the shell)
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
while [ -n "$dir" ]; do
  if [ -f "$dir/.env" ]; then
    while IFS='=' read -r k v; do
      k="${k#export }"; k="${k// /}"
      [[ -z "$k" || "$k" == \#* ]] && continue
      v="${v%\"}"; v="${v#\"}"; v="${v%\'}"; v="${v#\'}"
      [ -z "${!k:-}" ] && export "$k=$v"
    done < "$dir/.env"
    break
  fi
  [ -e "$dir/.git" ] && break
  parent="$(dirname "$dir")"; [ "$parent" = "$dir" ] && break; dir="$parent"
done

JIRA_API_TOKEN="${JIRA_API_TOKEN:-${JIRA_TOKEN:-}}"   # JIRA_TOKEN accepted for older setups
: "${JIRA_BASE_URL:?set JIRA_BASE_URL}"
: "${JIRA_EMAIL:?set JIRA_EMAIL}"
: "${JIRA_API_TOKEN:?set JIRA_API_TOKEN}"
command -v jq >/dev/null || { echo "jq not found - use: python fetch-jira.py $KEY" >&2; exit 1; }

curl -sSf -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Accept: application/json" \
  "${JIRA_BASE_URL%/}/rest/api/3/issue/${KEY}?fields=summary,description,issuetype,priority,status,components,labels,fixVersions,issuelinks,attachment" \
| jq '{
    key: .key,
    summary: .fields.summary,
    type: .fields.issuetype.name,
    priority: .fields.priority.name,
    status: .fields.status.name,
    components: [.fields.components[]?.name],
    labels: .fields.labels,
    fixVersions: [.fields.fixVersions[]?.name],
    description: .fields.description,
    links: [.fields.issuelinks[]? | {type: .type.name, key: (.outwardIssue.key // .inwardIssue.key)}],
    attachments: [.fields.attachment[]? | .filename]
  }'
