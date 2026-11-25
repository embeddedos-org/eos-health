#!/usr/bin/env python3
"""Unit tests for check_firmware_syntax.check_file brace and parenthesis counts.

Run: python3 -m unittest verification/test_check_firmware_syntax.py
"""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import check_firmware_syntax  # noqa: E402


def errors_for(source: str) -> list[str]:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "sample.c"
        path.write_text(source, encoding="utf-8")
        issues = check_firmware_syntax.check_file(path)
    return [i["msg"] for i in issues if i["level"] == "ERROR"]


class BalanceCountTest(unittest.TestCase):
    def test_double_slash_inside_string_is_not_a_comment(self):
        # Same shape as UnityPrint("file://"); in the vendored unity.c.
        src = 'void f(void)\n{\n    print("file://");\n}\n'
        self.assertEqual(errors_for(src), [])

    def test_brace_after_url_string_is_counted(self):
        src = 'void f(void) { print("http://x"); }\n'
        self.assertEqual(errors_for(src), [])

    def test_bracket_char_literals_are_not_counted(self):
        src = "void f(void)\n{\n    putchar('(');\n    putchar('{');\n}\n"
        self.assertEqual(errors_for(src), [])

    def test_escaped_quote_inside_string(self):
        src = 'void f(void)\n{\n    print("\\"(");\n}\n'
        self.assertEqual(errors_for(src), [])

    def test_quote_char_literal_before_comment_with_quote(self):
        src = 'void f(int c)\n{\n    if (c == \'"\') { // opening "quote\n        g();\n    }\n}\n'
        self.assertEqual(errors_for(src), [])

    def test_quote_char_literal_then_string_with_bracket(self):
        src = 'void f(void)\n{\n    g(\'"\'); h("(");\n}\n'
        self.assertEqual(errors_for(src), [])

    def test_real_imbalance_is_still_reported(self):
        src = 'void f(void)\n{\n    g((1);\n}\n'
        self.assertEqual(errors_for(src), ["Unbalanced parentheses: net count = +1"])

    def test_code_after_string_and_before_comment(self):
        src = 'void f(void)\n{\n    g("a"); // (note\n}\n'
        self.assertEqual(errors_for(src), [])


if __name__ == "__main__":
    unittest.main()
