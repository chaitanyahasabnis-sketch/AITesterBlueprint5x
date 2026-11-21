#!/usr/bin/env python3
"""Fetch a Jira issue and print it as compact JSON for the test-plan skill.

Usage:
    python scripts/fetch-jira.py VWO-49

Credentials (first match wins):
    1. Environment variables already set in the shell.
    2. The nearest `.env` file, searched from this script's folder upward to
       the repository root (see `.env.example` in the skill folder).

Required variables:
    JIRA_BASE_URL   e.g. https://your-org.atlassian.net
    JIRA_EMAIL      the Atlassian account email
    JIRA_API_TOKEN  an API token from https://id.atlassian.com/manage-profile/security/api-tokens
                    (JIRA_TOKEN is still accepted for older setups)

Standard library only: no jq, curl or pip packages needed, so it runs on Windows too.
Exit codes: 0 ok, 1 usage/config error, 2 HTTP/network error.
"""
from __future__ import annotations

import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

FIELDS = "summary,description,issuetype,priority,status,components,labels,fixVersions,issuelinks,attachment"
KEY_PATTERN = re.compile(r"^[A-Z][A-Z0-9_]*-\d+$")


def find_env_file(start: Path) -> Path | None:
    """Walk from `start` up to the repo root (folder with .git) looking for a .env file."""
    for folder in [start, *start.parents]:
        candidate = folder / ".env"
        if candidate.is_file():
            return candidate
        if (folder / ".git").exists():
            break
    return None


def load_env_file(path: Path) -> dict[str, str]:
    """Parse simple KEY=VALUE lines; ignores blanks, comments and surrounding quotes."""
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export "):]
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def get_config() -> dict[str, str]:
    file_values: dict[str, str] = {}
    env_file = find_env_file(Path(__file__).resolve().parent)
    if env_file:
        file_values = load_env_file(env_file)

    def pick(*names: str) -> str:
        for name in names:
            value = os.environ.get(name) or file_values.get(name)
            if value:
                return value
        return ""

    config = {
        "base_url": pick("JIRA_BASE_URL").rstrip("/"),
        "email": pick("JIRA_EMAIL"),
        "token": pick("JIRA_API_TOKEN", "JIRA_TOKEN"),
    }
    missing = [name for name, key in (("JIRA_BASE_URL", "base_url"), ("JIRA_EMAIL", "email"),
                                      ("JIRA_API_TOKEN", "token")) if not config[key]]
    if missing:
        where = f"(looked in environment and {env_file})" if env_file else "(no .env file found)"
        sys.exit(f"error: missing {', '.join(missing)} {where}. Copy .env.example to .env and fill it in.")
    return config


def adf_to_text(node) -> str:
    """Flatten Atlassian Document Format (Jira Cloud v3 descriptions) into plain text."""
    if node is None:
        return ""
    if isinstance(node, str):
        return node
    if isinstance(node, list):
        return "".join(adf_to_text(child) for child in node)
    node_type = node.get("type")
    if node_type == "text":
        return node.get("text", "")
    if node_type == "hardBreak":
        return "\n"
    inner = adf_to_text(node.get("content", []))
    if node_type == "listItem":
        return "- " + inner.strip() + "\n"
    if node_type in {"paragraph", "heading", "blockquote", "codeBlock", "rule"}:
        return inner + "\n"
    if node_type in {"tableRow"}:
        return " | ".join(adf_to_text(c).strip() for c in node.get("content", [])) + "\n"
    return inner


def fetch_issue(key: str, config: dict[str, str]) -> dict:
    url = f"{config['base_url']}/rest/api/3/issue/{urllib.parse.quote(key)}?fields={FIELDS}"
    auth = base64.b64encode(f"{config['email']}:{config['token']}".encode()).decode()
    request = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}",
                                                   "Accept": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        hints = {401: "check JIRA_EMAIL / JIRA_API_TOKEN", 403: "the account cannot view this issue",
                 404: "issue key not found or no permission"}
        print(f"error: HTTP {exc.code} for {key}: {hints.get(exc.code, exc.reason)}", file=sys.stderr)
    except urllib.error.URLError as exc:
        print(f"error: cannot reach {config['base_url']}: {exc.reason}", file=sys.stderr)
    sys.exit(2)


def summarise(issue: dict) -> dict:
    fields = issue.get("fields", {})
    name = lambda obj: (obj or {}).get("name")  # noqa: E731
    return {
        "key": issue.get("key"),
        "summary": fields.get("summary"),
        "type": name(fields.get("issuetype")),
        "priority": name(fields.get("priority")),
        "status": name(fields.get("status")),
        "components": [c.get("name") for c in fields.get("components") or []],
        "labels": fields.get("labels") or [],
        "fixVersions": [v.get("name") for v in fields.get("fixVersions") or []],
        "description_text": adf_to_text(fields.get("description")).strip(),
        "description": fields.get("description"),
        "links": [
            {"type": (link.get("type") or {}).get("name"),
             "key": (link.get("outwardIssue") or link.get("inwardIssue") or {}).get("key")}
            for link in fields.get("issuelinks") or []
        ],
        "attachments": [a.get("filename") for a in fields.get("attachment") or []],
    }


def main(argv: list[str]) -> None:
    if len(argv) != 2 or argv[1] in {"-h", "--help"}:
        sys.exit("usage: python fetch-jira.py <ISSUE-KEY>   e.g. VWO-49")
    key = argv[1].strip().upper()
    if not KEY_PATTERN.match(key):
        sys.exit(f"error: '{argv[1]}' does not look like a Jira key (expected e.g. VWO-49)")
    config = get_config()
    print(json.dumps(summarise(fetch_issue(key, config)), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main(sys.argv)
