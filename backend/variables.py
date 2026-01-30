"""Template variables support.

This module defines the variables that can be used in email subject/body templates
and provides a small helper to render a template for a given recipient.

Supported tokens:
- $firstname
- $lastname

Unknown tokens are left as-is.
"""

from __future__ import annotations

import re
from typing import Mapping

# Public list of supported template tokens (useful for UI hints)
SUPPORTED_VARIABLES = ["$firstname", "$lastname"]

# Regex that matches "$token" style variables
_VAR_RE = re.compile(r"\$[A-Za-z_][A-Za-z0-9_]*")


def render_template(template: str, recipient_data: Mapping[str, str]) -> str:
    """Replace supported variables in `template` using `recipient_data`.

    - Uses recipient_data keys `firstname` and `lastname`.
    - Leaves unknown variables unchanged.
    - Missing values are replaced by an empty string.
    """

    if not template:
        return ""

    def _replace(match: re.Match[str]) -> str:
        token = match.group(0)
        key = token[1:]  # strip leading '$'

        # Only replace supported variables; otherwise keep token as-is.
        if token not in SUPPORTED_VARIABLES:
            return token

        return str(recipient_data.get(key, "") or "")

    return _VAR_RE.sub(_replace, template)

"""
This module defines the variables that can be used in email subject/body templates
and provides a small helper to render a template for a given recipient.

Supported tokens:
- $firstname
- $lastname

Unknown tokens are left as-is.
"""

from __future__ import annotations

import re
from typing import Mapping

# Public list of supported template tokens (useful for UI hints)
SUPPORTED_VARIABLES = ["$firstname", "$lastname"]

# Regex that matches "$token" style variables
_VAR_RE = re.compile(r"\$[A-Za-z_][A-Za-z0-9_]*")


def render_template(template: str, recipient_data: Mapping[str, str]) -> str:
    """Replace supported variables in `template` using `recipient_data`.

    - Uses recipient_data keys `firstname` and `lastname`.
    - Leaves unknown variables unchanged.
    - Missing values are replaced by an empty string.
    """

    if not template:
        return ""

    def _replace(match: re.Match[str]) -> str:
        token = match.group(0)
        key = token[1:]  # strip leading '$'

        # Only replace supported variables; otherwise keep token as-is.
        if token not in SUPPORTED_VARIABLES:
            return token

        return str(recipient_data.get(key, "") or "")

    return _VAR_RE.sub(_replace, template)
